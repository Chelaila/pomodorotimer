import * as React from 'react';
import { createContext, useContext, useState } from 'react';
import { TimerType } from '../types/timer';

interface TimerProgressContextType {
  progress: number;
  currentTimerType: TimerType;
  setProgress: (progress: number) => void;
  setCurrentTimerType: (type: TimerType) => void;
}

const TimerProgressContext = createContext<TimerProgressContextType | undefined>(undefined);

export const TimerProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState(0);
  const [currentTimerType, setCurrentTimerType] = useState<TimerType>('pomodoro');

  return (
    <TimerProgressContext.Provider value={{ 
      progress, 
      currentTimerType,
      setProgress, 
      setCurrentTimerType 
    }}>
      {children}
    </TimerProgressContext.Provider>
  );
};

export const useTimerProgress = () => {
  const context = useContext(TimerProgressContext);
  if (context === undefined) {
    throw new Error('useTimerProgress must be used within a TimerProgressProvider');
  }
  return context;
};