import { useState, useEffect } from 'react';

const SHANGHAI_OFFSET = 8 * 60; // UTC+8

function getShanghaiTime(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + SHANGHAI_OFFSET * 60000);
}

export function useClock() {
  const [time, setTime] = useState(getShanghaiTime);
  const [totalMinutes, setTotalMinutes] = useState<number>(() => {
    const t = getShanghaiTime();
    return t.getHours() * 60 + t.getMinutes();
  });

  useEffect(() => {
    const updateTime = () => {
      const now = getShanghaiTime();
      setTime(now);
      setTotalMinutes(now.getHours() * 60 + now.getMinutes());
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return { time, totalMinutes };
}
