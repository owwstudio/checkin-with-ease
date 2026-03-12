import type { DailyActivity } from '../utils/db';

interface CalendarInfoModalProps {
  isOpen: boolean;
  date: Date;
  statusText: string;
  statusClass: string;
  activity: DailyActivity | null;
  onClose: () => void;
}

export function CalendarInfoModal({ 
  isOpen, 
  date, 
  statusText,
  statusClass,
  activity, 
  onClose 
}: CalendarInfoModalProps) {
  if (!isOpen) return null;

  const dateStr = date.toLocaleDateString('id-ID', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });

  return (
    <div className="calendar-modal-overlay" onClick={onClose}>
      <div className="calendar-modal glass-panel" onClick={e => e.stopPropagation()}>
        <div className="cal-modal-header">
          <h3 className="cal-modal-date">{dateStr}</h3>
          <button className="cal-modal-close" onClick={onClose}>✕</button>
        </div>

        <div className={`cal-modal-status-banner bg-${statusClass}`}>
          {statusText}
        </div>

        <div className="cal-modal-content">
          {activity ? (
            <div className="cal-modal-details">
              {activity.isLeave ? (
                <div className="cal-detail-row">
                  <span className="cal-detail-label">Status:</span>
                  <span className="cal-detail-value leave-text">Cuti / Izin</span>
                </div>
              ) : (
                <>
                  <div className="cal-detail-row">
                    <span className="cal-detail-label">Jam Masuk (Check-In):</span>
                    <span className="cal-detail-value font-mono">
                      {activity.checkInTime || '-'}
                    </span>
                  </div>
                  
                  <div className="cal-detail-row">
                    <span className="cal-detail-label">Jam Keluar (Check-Out):</span>
                    <span className="cal-detail-value font-mono">
                      {activity.checkOutTime || '-'}
                    </span>
                  </div>

                  {activity.checkInPhoto && (
                    <div className="cal-photo-section">
                      <span className="cal-detail-label">Foto Selfie (Masuk):</span>
                      <img 
                        src={activity.checkInPhoto} 
                        alt="Check-in Selfie" 
                        className="cal-selfie-thumb"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="cal-modal-empty">
              <span className="empty-icon">📂</span>
              <p>Tidak ada catatan kehadiran pada hari ini.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
