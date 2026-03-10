import React from 'react';

interface CheckOutButtonProps {
    isAllowed: boolean;
    hasCheckedOut: boolean;
    onCheckOut: () => void;
}

export const CheckOutButton: React.FC<CheckOutButtonProps> = ({ isAllowed, hasCheckedOut, onCheckOut }) => {
    if (hasCheckedOut) {
        return (
            <button className="checkout-btn checked-out glass-panel" disabled>
                <span className="icon">🏁</span>
                Berhasil Check Out
            </button>
        );
    }

    return (
        <div className="checkin-wrapper">
            <button
                className={`checkout-btn glass-panel ${!isAllowed ? 'disabled' : ''}`}
                onClick={isAllowed ? onCheckOut : undefined}
                disabled={!isAllowed}
            >
                <span className="icon">{isAllowed ? '🏃' : '🔒'}</span>
                {isAllowed ? 'Check Out Sekarang' : 'Di Luar Jam Kerja'}
            </button>
            {!isAllowed && (
                <div className="error-message">
                    Check-out hanya dapat dilakukan setelah pukul 09:00
                </div>
            )}
        </div>
    );
};
