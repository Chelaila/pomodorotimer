import { useCallback } from 'react';

interface UseTimerProps {
  onTimeEnd: () => void;
}

export const useTimer = ({ onTimeEnd }: UseTimerProps) => {
  const handleTimeEnd = useCallback(() => {
    onTimeEnd();
  }, [onTimeEnd]);

  return { handleTimeEnd };
};
