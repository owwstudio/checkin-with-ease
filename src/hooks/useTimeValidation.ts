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
    // Valid if >= 9:00:00 and < 17:00:00. This logic means 17:00 is locked for check-in
    const isCheckInAllowed = currentHour >= WORK_START_HOUR && currentHour < WORK_END_HOUR;
    // Check-out allowed anytime after work start
    const isCheckOutAllowed = currentHour >= WORK_START_HOUR;

    return { currentTime, isCheckInAllowed, isCheckOutAllowed };
};
