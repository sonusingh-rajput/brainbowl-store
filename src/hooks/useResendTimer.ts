import { useState, useEffect } from 'react';

export function useResendTimer(initialSeconds = 60) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(timer);
  }, [isTimerActive, timeLeft]);

  const startTimer = () => {
    setTimeLeft(initialSeconds);
    setIsTimerActive(true);
  };

  return { timeLeft, isTimerActive, startTimer };
}