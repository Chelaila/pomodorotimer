import * as React from 'react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Task } from '../../interfaces/task/Task.interface';
import { TimerConfig, TimerType } from '../../interfaces/timer/Timer.interface';
import TimerTypeSelector from './TimerTypeSelector';
import Controls from './Controls';

interface TimerProps {
  activeConfig: TimerConfig;
  currentTask: Task | null;
  onTimeEnd: () => void;
}

const TitleService = {
  updateTitle: (timeLeft: number, isActive: boolean, currentTimerType: TimerType) => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    const timerIcons: Record<TimerType, string> = { 'pomodoro': '🍅', 'descanso-corto': '☕', 'descanso-largo': '🌙' };
    const timerType = timerIcons[currentTimerType];
    document.title = isActive ? `${timerType} ${formattedTime} - Pomodoro Timer` : 'Pomodoro Timer';
  },
  resetTitle: () => {
    document.title = 'Pomodoro Timer';
  }
};

const Timer: React.FC<TimerProps> = ({ activeConfig, currentTask, onTimeEnd }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentTimerType, setCurrentTimerType] = useState<TimerType>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(activeConfig.pomodoroTime * 60);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');

  const startTimeRef = useRef<number | null>(null);
  const expectedTimeRef = useRef<number>(activeConfig.pomodoroTime * 60);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const alarmCountRef = useRef<number>(0);
  const alarmIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const previousTimerTypeRef = useRef<TimerType>(currentTimerType);

  const getInitialSeconds = useCallback((): number => {
    switch (currentTimerType) {
      case 'pomodoro': return activeConfig.pomodoroTime * 60;
      case 'descanso-corto': return activeConfig.shortBreakTime * 60;
      case 'descanso-largo': return activeConfig.longBreakTime * 60;
      default: return activeConfig.pomodoroTime * 60;
    }
  }, [currentTimerType, activeConfig]);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }, []);

  // Reinicia el timer cuando cambia la configuración activa
  useEffect(() => {
    const newTime = getInitialSeconds();
    setTimeLeft(newTime);
    expectedTimeRef.current = newTime;
    setIsActive(false);
    startTimeRef.current = null;
    previousTimerTypeRef.current = currentTimerType;
  }, [activeConfig.id, getInitialSeconds]);

  // Actualiza el tiempo al cambiar el tipo de timer (solo si está pausado)
  useEffect(() => {
    if (!isActive && startTimeRef.current === null && currentTimerType !== previousTimerTypeRef.current) {
      const newTime = getInitialSeconds();
      if (newTime !== timeLeft) {
        setTimeLeft(newTime);
        expectedTimeRef.current = newTime;
      }
      previousTimerTypeRef.current = currentTimerType;
    }
  }, [currentTimerType, isActive, timeLeft, getInitialSeconds]);

  // Mantiene el título del documento actualizado
  useEffect(() => {
    TitleService.updateTitle(timeLeft, isActive, currentTimerType);
    return () => {
      TitleService.resetTitle();
    };
  }, [timeLeft, isActive, currentTimerType]);

  // Solicita permiso de notificaciones al montar
  useEffect(() => {
    if ('Notification' in globalThis) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  }, []);

  // Inicializa el audio
  useEffect(() => {
    audioRef.current = new Audio('/alarm.mp3');
    audioRef.current.loop = false;
    audioContextRef.current = new (globalThis.AudioContext || (globalThis as any).webkitAudioContext)();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (alarmIntervalRef.current) {
        clearInterval(alarmIntervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const handleAlarm = useCallback(async () => {
    if (!audioRef.current || !audioContextRef.current) return;

    alarmCountRef.current = 0;

    const playAlarm = async () => {
      if (alarmCountRef.current >= 3) {
        if (alarmIntervalRef.current) clearInterval(alarmIntervalRef.current);
        return;
      }

      const audioContext = audioContextRef.current;
      if (audioContext?.state === 'suspended') {
        await audioContext.resume();
      }

      audioRef.current?.play();

      if (notificationPermission === 'granted' && currentTask) {
        new Notification('¡Timer completado!', {
          body: `La tarea "${currentTask.title}" ha terminado`,
          icon: '/images/favicon.ico'
        });
      }

      alarmCountRef.current += 1;
    };

    await playAlarm();
    alarmIntervalRef.current = setInterval(playAlarm, 1000);
  }, [notificationPermission, currentTask]);

  // Cuenta regresiva con setInterval (sigue corriendo en pestañas inactivas, throttled a ~1s)
  // + setTimeout programado al instante exacto del fin para disparar la alarma sin depender del tick
  useEffect(() => {
    if (!isActive || expectedTimeRef.current <= 0) {
      return;
    }

    if (!startTimeRef.current) {
      startTimeRef.current = performance.now();
    }

    const endTimeMs = startTimeRef.current + expectedTimeRef.current * 1000;

    const tick = () => {
      const remainingMs = Math.max(0, endTimeMs - performance.now());
      const remainingSec = Math.ceil(remainingMs / 1000);
      setTimeLeft((prev) => (prev !== remainingSec ? remainingSec : prev));
    };

    tick();
    const intervalId = setInterval(tick, 500);

    const alarmTimeoutId = setTimeout(() => {
      setTimeLeft(0);
      setIsActive(false);
      startTimeRef.current = null;
      handleAlarm();
      onTimeEnd();
    }, Math.max(0, endTimeMs - performance.now()));

    // Recalibrar al volver a la pestaña por si el navegador throttled el tick
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(intervalId);
      clearTimeout(alarmTimeoutId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [isActive, onTimeEnd, handleAlarm]);

  const handleStart = useCallback(() => {
    setIsActive(true);
  }, []);

  const handleStop = useCallback(() => {
    if (startTimeRef.current) {
      const currentTime = performance.now();
      const elapsed = Math.floor((currentTime - startTimeRef.current) / 1000);
      const newTimeLeft = Math.max(0, expectedTimeRef.current - elapsed);
      setTimeLeft(newTimeLeft);
      expectedTimeRef.current = newTimeLeft;
    }
    setIsActive(false);
    startTimeRef.current = null;
  }, []);

  const handleReset = useCallback(() => {
    setIsActive(false);
    startTimeRef.current = null;
    const newTime = getInitialSeconds();
    setTimeLeft(newTime);
    expectedTimeRef.current = newTime;
  }, [getInitialSeconds]);

  const handleTimerTypeChange = useCallback((type: TimerType) => {
    setIsActive(false);
    startTimeRef.current = null;
    setCurrentTimerType(type);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className={`text-6xl font-bold transition-colors duration-200 ${
        isActive ? 'text-primary-main' : 'text-secondary-dark'
      }`}>
        {formatTime(timeLeft)}
      </div>

      <TimerTypeSelector
        currentTimerType={currentTimerType}
        onTimerTypeChange={handleTimerTypeChange}
      />

      <Controls
        isActive={isActive}
        onStart={handleStart}
        onPause={handleStop}
        onReset={handleReset}
      />

      {currentTask && (
        <div className="text-text-secondary text-lg">
          <span>Tarea actual: {currentTask.title}</span>
        </div>
      )}
    </div>
  );
};

export default Timer;
