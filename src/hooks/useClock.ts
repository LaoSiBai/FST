import { useState, useEffect } from 'react';

export function useClock() {
    const [time, setTime] = useState(new Date());
    const [totalMinutes, setTotalMinutes] = useState(0);

    useEffect(() => {
        const updateTime = () => {
            const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Shanghai' }));
            setTime(now);
            setTotalMinutes(now.getHours() * 60 + now.getMinutes());
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return { time, totalMinutes };
}
