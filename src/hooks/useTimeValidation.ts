import { useState, useEffect } from 'react';

const WORK_START_HOUR = 9;
const WORK_END_HOUR = 17;

export const useTimeValidation = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const currentHour = currentTime.getHours();
    // Valid if >= 9:00:00 and < 17:00:00. This logic means 17:00 is locked (since users must check in *before* 5 PM)
    const isAllowed = currentHour >= WORK_START_HOUR && currentHour < WORK_END_HOUR;

    return { currentTime, isAllowed };
};
