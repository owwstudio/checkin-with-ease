import React from 'react';

interface CheckInButtonProps {
    isAllowed: boolean;
    hasCheckedIn: boolean;
    onCheckIn: () => void;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({ isAllowed, hasCheckedIn, onCheckIn }) => {
    if (hasCheckedIn) {
        return (
            <button className="checkin-btn checked-in glass-panel" disabled>
                <span className="icon">✓</span>
                Berhasil Absen
            </button>
        );
    }

    return (
        <div className="checkin-wrapper">
            <button
                className={`checkin-btn glass-panel ${!isAllowed ? 'disabled' : ''}`}
                onClick={isAllowed ? onCheckIn : undefined}
                disabled={!isAllowed}
            >
                <span className="icon">{isAllowed ? '👋' : '🔒'}</span>
                {isAllowed ? 'Check In Sekarang' : 'Di Luar Jam Kerja'}
            </button>
            {!isAllowed && (
                <div className="error-message">
                    Absensi hanya dapat dilakukan antara pukul 09:00 - 17:00
                </div>
            )}
        </div>
    );
};
