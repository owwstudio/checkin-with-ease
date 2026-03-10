import React from 'react';

interface StreakDisplayProps {
    streakCount: number;
    hasCheckedIn: boolean;
    isLate: boolean;
    freezesLeft: number;
    usedFreezeToday: boolean;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({ 
    streakCount, hasCheckedIn, isLate, freezesLeft, usedFreezeToday 
}) => {
    // Determine the state of the streak
    const isBroken = hasCheckedIn && isLate && !usedFreezeToday;
    const isActive = streakCount > 0 && !isBroken;
    const justIncreased = isActive && hasCheckedIn && !isLate;

    // Determine Heat Level
    let heatLevelClass = 'heat-low';
    let fireIcon = '🔹'; // Default / low 1-5
    let titleText = 'Memulai Kebiasaan';

    if (streakCount >= 6 && streakCount <= 15) {
        heatLevelClass = 'heat-medium';
        fireIcon = '🔥';
        titleText = 'Mulai Membara';
    } else if (streakCount >= 16) {
        heatLevelClass = 'heat-high';
        fireIcon = '⚡'; // Or combinations like 🔥⚡
        titleText = 'Tak Terhentikan!';
    }

    if (isBroken) {
        heatLevelClass = 'broken';
        fireIcon = '🧊';
        titleText = 'Streak Terputus';
    } else if (usedFreezeToday) {
        heatLevelClass = 'frozen';
        fireIcon = '❄️';
        titleText = 'Streak Dibekukan';
    }

    return (
        <div className="streak-wrapper">
            <div className={`streak-container glass-panel ${heatLevelClass} ${isActive ? 'active-streak' : ''}`}>
                <div className="streak-icon-wrapper">
                    <div className="streak-icon">
                        {fireIcon}
                    </div>
                </div>
                
                <div className="streak-info">
                    <div className="streak-header">
                        <span className="streak-number">{isBroken ? 0 : streakCount}</span>
                        <span className="streak-label">Hari</span>
                    </div>
                    <span className="streak-text">{titleText}</span>
                </div>
                
                {justIncreased && (
                    <div className="streak-pop">+1</div>
                )}
            </div>

            {/* Freeze Indicators */}
            <div className="freeze-inventory">
                <span className="freeze-label">Streak Freeze Bulan Ini: </span>
                <div className="freeze-slots">
                    {[...Array(6)].map((_, i) => (
                        <span key={i} className={`freeze-slot ${i < freezesLeft ? 'available' : 'used'}`} title={i < freezesLeft ? 'Tersedia' : 'Terpakai'}>
                            {i < freezesLeft ? '❄️' : '💧'}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};
