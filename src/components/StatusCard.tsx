import React from 'react';

interface StatusCardProps {
    hasCheckedIn: boolean;
    checkInTime: string | null;
    checkInPhoto?: string | null;
    selectedMood?: string | null;
    isLate?: boolean;
    hasCheckedOut: boolean;
    checkOutTime: string | null;
    checkOutPhoto?: string | null;
    selectedFeedback?: string | null;
    isEarlyLeave?: boolean;
}

export const StatusCard: React.FC<StatusCardProps> = ({ 
    hasCheckedIn, checkInTime, checkInPhoto, selectedMood, hasCheckedOut, checkOutTime, checkOutPhoto, selectedFeedback, isLate, isEarlyLeave 
}) => {
    return (
        <div className={`status-card glass-panel ${hasCheckedIn ? 'active' : ''} ${hasCheckedOut ? 'completed' : ''}`}>
            <div className="status-label">Status Kehadiran Hari Ini</div>
            <div className="status-value">
                {hasCheckedIn ? (
                    <div className="status-history">
                        <div className="status-history-item">
                            <div className="status-history-content">
                                <div className="status-history-header">
                                    <span className={`status-indicator ${isLate ? 'offline' : 'online'}`}></span>
                                    <span className="time-text">Masuk: {checkInTime}</span>
                                    {selectedMood && (
                                        <span className="mood-badge" title="Mood Hari Ini">{selectedMood}</span>
                                    )}
                                </div>
                                <span className={`status-badge ${isLate ? 'late' : 'ontime'}`}>
                                    {isLate ? 'Terlambat' : 'Hadir Tepat Waktu'}
                                </span>
                            </div>
                            {checkInPhoto && (
                                <div className="status-photo-container">
                                    <img src={checkInPhoto} alt="Check-In" className="status-photo" />
                                </div>
                            )}
                        </div>
                        
                        {hasCheckedOut && (
                            <div className="status-history-item checkout">
                                <div className="status-history-content">
                                <div className="status-history-header">
                                        <span className={`status-indicator ${isEarlyLeave ? 'offline' : 'online'}`}></span>
                                        <span className="time-text">Pulang: {checkOutTime}</span>
                                        {selectedFeedback && (
                                            <span className="mood-badge" title="Evaluasi Hari Ini">{selectedFeedback}</span>
                                        )}
                                    </div>
                                    <span className={`status-badge ${isEarlyLeave ? 'early' : 'ontime'}`}>
                                        {isEarlyLeave ? 'Pulang Cepat' : 'Tepat Waktu'}
                                    </span>
                                </div>
                                {checkOutPhoto && (
                                    <div className="status-photo-container">
                                        <img src={checkOutPhoto} alt="Check-Out" className="status-photo" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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
