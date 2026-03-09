import React from 'react';
import { formatTime, formatDate } from '../utils/timeFormatters';

interface ClockProps {
    currentTime: Date;
}

export const Clock: React.FC<ClockProps> = ({ currentTime }) => {
    return (
        <div className="clock-container glass-panel">
            <div className="clock-date">{formatDate(currentTime)}</div>
            <div className="clock-time">{formatTime(currentTime)}</div>
        </div>
    );
};
