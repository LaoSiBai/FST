import { useState, useEffect } from 'react';

function getCityTime(offsetHours: number): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + offsetHours * 60 * 60000);
}

export function useClock(timezoneOffset: number = 8) {
  const [time, setTime] = useState(() => getCityTime(timezoneOffset));
  const [totalMinutes, setTotalMinutes] = useState<number>(() => {
    const t = getCityTime(timezoneOffset);
    return t.getHours() * 60 + t.getMinutes();
  });

  useEffect(() => {
    const updateTime = () => {
      const now = getCityTime(timezoneOffset);
      setTime(now);
      setTotalMinutes(now.getHours() * 60 + now.getMinutes());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [timezoneOffset]);

  return { time, totalMinutes };
}
