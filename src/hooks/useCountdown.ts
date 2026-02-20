import { useEffect, useState } from 'react';

export function useCountdown(
  initialCount: number,
  callbackfn: (() => void) | null = null
) {
  const [countdownStarted, setCountdownStarted] = useState(false);
  const [countdown, setCountdown] = useState(initialCount);

  useEffect(() => {
    if (!countdownStarted) {
      return;
    }

    if (countdown === 0 && callbackfn) {
      callbackfn();
    }

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callbackfn, countdown, countdownStarted]);

  return {
    countdownStarted,
    startCountdown: () => setCountdownStarted(true),
    countdown,
  };
}
