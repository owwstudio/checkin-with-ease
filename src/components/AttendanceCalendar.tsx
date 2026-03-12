import { useState } from 'react';
import { db, type DailyActivity } from '../utils/db';
import { useLiveQuery } from 'dexie-react-hooks';
import { CalendarInfoModal } from './CalendarInfoModal';

// Helper to get days in a given month
const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

export function AttendanceCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateInfo, setSelectedDateInfo] = useState<{
    date: Date;
    statusText: string;
    statusClass: string;
    activity: DailyActivity | null;
  } | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  // Format YYYY-MM to filter activities
  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;

  // Query DEXIE for all activities in this month
  const monthlyActivities = useLiveQuery(
    () => db.activities
      .where('dateString')
      .startsWith(monthPrefix)
      .toArray(),
    [monthPrefix]
  );
  
  const activitiesByDate = monthlyActivities?.reduce((acc, activity) => {
    acc[activity.dateString] = activity;
    return acc;
  }, {} as Record<string, DailyActivity>) || {};

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  
  // Create blank cells for offset
  const blankCells = Array.from({ length: firstDayOfMonth }).map((_, i) => (
    <div key={`blank-${i}`} className="cal-cell blank"></div>
  ));

  const dayCells = Array.from({ length: daysInMonth }).map((_, index) => {
    const day = index + 1;
    const dateStr = `${monthPrefix}-${String(day).padStart(2, '0')}`;
    const activity = activitiesByDate[dateStr];
    
    // Evaluate Date context
    const cellDate = new Date(year, month, day);
    const dayOfWeek = cellDate.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Start of current day (local time) to evaluate if date is strictly in the "past"
    // So we don't mark today as "Alpha" if they just haven't clocked in yet
    const todayLocal = new Date();
    todayLocal.setHours(0, 0, 0, 0);
    const isPast = cellDate < todayLocal;

    // Determine Status
    let statusClass = 'neutral';
    let statusText = 'Belum Ada Data';
    
    if (activity) {
      if (activity.isLeave) {
        statusClass = 'leave'; // Blue
        statusText = 'Cuti / Izin';
      } else if (activity.checkInTime) {
        if (activity.isLate) {
          statusClass = 'late'; // Yellow
          statusText = 'Hadir (Terlambat)';
        } else {
          statusClass = 'present'; // Green
          statusText = 'Hadir Tepat Waktu';
        }
      }
    } else {
      if (isPast && !isWeekend) {
        statusClass = 'absent'; // Red (Alpha)
        statusText = 'Alpha / Mangkir';
      } else if (isWeekend) {
        statusClass = 'weekend'; // Gray out weekends slightly
        statusText = 'Akhir Pekan';
      }
    }

    const isClickable = statusClass !== 'neutral' && statusClass !== 'weekend';

    const handleCellClick = () => {
      if (!isClickable) return;
      setSelectedDateInfo({
        date: cellDate,
        statusText,
        statusClass,
        activity: activity || null,
      });
      setIsModalOpen(true);
    };

    return (
      <div 
        key={`day-${day}`} 
        className={`cal-cell status-${statusClass} ${isClickable ? 'clickable' : ''}`}
        onClick={handleCellClick}
      >
        <span className="cal-day-num">{day}</span>
        {statusClass !== 'neutral' && statusClass !== 'weekend' && (
          <div className={`cal-indicator bg-${statusClass}`}></div>
        )}
      </div>
    );
  });

  const monthName = currentDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });

  return (
    <div className="calendar-container glass-panel">
      <div className="calendar-header">
        <button onClick={handlePrevMonth} className="cal-nav-btn">❮</button>
        <h3 className="cal-month-title">{monthName}</h3>
        <button onClick={handleNextMonth} className="cal-nav-btn">❯</button>
      </div>

      <div className="calendar-grid">
        <div className="cal-weekday">Min</div>
        <div className="cal-weekday">Sen</div>
        <div className="cal-weekday">Sel</div>
        <div className="cal-weekday">Rab</div>
        <div className="cal-weekday">Kam</div>
        <div className="cal-weekday">Jum</div>
        <div className="cal-weekday">Sab</div>
        
        {blankCells}
        {dayCells}
      </div>

      <div className="calendar-legend">
        <div className="legend-item"><div className="legend-color bg-present"></div> <span>Hadir</span></div>
        <div className="legend-item"><div className="legend-color bg-late"></div> <span>Telat</span></div>
        <div className="legend-item"><div className="legend-color bg-leave"></div> <span>Cuti</span></div>
        <div className="legend-item"><div className="legend-color bg-absent"></div> <span>Alpha</span></div>
      </div>

      {selectedDateInfo && (
        <CalendarInfoModal
          isOpen={isModalOpen}
          date={selectedDateInfo.date}
          statusText={selectedDateInfo.statusText}
          statusClass={selectedDateInfo.statusClass}
          activity={selectedDateInfo.activity}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
