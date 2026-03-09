import React from 'react';

interface StatusCardProps {
    hasCheckedIn: boolean;
    checkInTime: string | null;
}

export const StatusCard: React.FC<StatusCardProps> = ({ hasCheckedIn, checkInTime }) => {
    return (
        <div className={`status-card glass-panel ${hasCheckedIn ? 'active' : ''}`}>
            <div className="status-label">Status Kehadiran Hari Ini</div>
            <div className="status-value">
                {hasCheckedIn ? (
                    <>
                        <span className="status-indicator online"></span>
                        Hadir (Absen: {checkInTime})
                    </>
                ) : (
                    <>
                        <span className="status-indicator offline"></span>
                        Belum Absen
                    </>
                )}
            </div>
        </div>
    );
};
