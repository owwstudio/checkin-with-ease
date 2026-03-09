import { useState, useEffect } from 'react';
import { Clock } from './components/Clock';
import { StatusCard } from './components/StatusCard';
import { CheckInButton } from './components/CheckInButton';
import { useTimeValidation } from './hooks/useTimeValidation';
import { formatTime } from './utils/timeFormatters';
import './index.css';

function App() {
  const { currentTime, isAllowed } = useTimeValidation();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);

  // Auto-clear checkin if day changes (simplistic approach for demo)
  useEffect(() => {
    if (currentTime.getHours() === 0 && currentTime.getMinutes() === 0) {
      setHasCheckedIn(false);
      setCheckInTime(null);
    }
  }, [currentTime]);

  const handleCheckIn = () => {
    if (isAllowed && !hasCheckedIn) {
      setHasCheckedIn(true);
      setCheckInTime(formatTime(new Date()));
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Work Attendance</h1>
        <p className="app-subtitle">Corporate Check-in Portal</p>
      </header>

      <Clock currentTime={currentTime} />

      <StatusCard
        hasCheckedIn={hasCheckedIn}
        checkInTime={checkInTime}
      />

      <CheckInButton
        isAllowed={isAllowed}
        hasCheckedIn={hasCheckedIn}
        onCheckIn={handleCheckIn}
      />
    </div>
  );
}

export default App;
