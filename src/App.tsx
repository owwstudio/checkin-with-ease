import { useState, useEffect } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { StatusCard } from './components/StatusCard';
import { CheckInButton } from './components/CheckInButton';
import { CheckOutButton } from './components/CheckOutButton';
import { Toast } from './components/Toast';
import { SelfieCamera } from './components/SelfieCamera';
import type { Mood } from './components/MoodSelector';
import { MoodSelector } from './components/MoodSelector';
import type { Feedback } from './components/FeedbackSelector';
import { FeedbackSelector } from './components/FeedbackSelector';
import { StreakDisplay } from './components/StreakDisplay';
import { LeaveButton } from './components/LeaveButton';
import { AttendanceCalendar } from './components/AttendanceCalendar';
import { useTimeValidation } from './hooks/useTimeValidation';
import { formatTime } from './utils/timeFormatters';
import { db, getTodayString } from './utils/db';
import './index.css';

function App() {
  const { currentTime, isCheckInAllowed, isCheckOutAllowed } = useTimeValidation();

  // Local ephemeral state for UI only
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [isCameraOpenFor, setIsCameraOpenFor] = useState<'checkin' | 'checkout' | null>(null);

  // Load Data using Dexie
  const todayStr = getTodayString(currentTime);

  const dailyActivity = useLiveQuery(
    () => db.activities.where('dateString').equals(todayStr).first(),
    [todayStr]
  );

  const userState = useLiveQuery(
    () => db.userState.get(1),
    []
  );

  // Derived state from Database
  const hasCheckedIn = !!dailyActivity?.checkInTime;
  const isLate = !!dailyActivity?.isLate;
  const hasCheckedOut = !!dailyActivity?.checkOutTime;
  const isEarlyLeave = !!dailyActivity?.isEarlyLeave;
  const isLeave = !!dailyActivity?.isLeave;

  const streakCount = userState?.streakCount ?? 0; // default if not found
  const freezesLeft = userState?.freezesLeft ?? 6;
  const usedFreezeToday = userState?.usedFreezeToday ?? false;
  
  // Initialize Database state if it does not exist
  useEffect(() => {
    const initDB = async () => {
      // FORCE HARD RESET (to ensure streak returns to 0)
      if (!localStorage.getItem('app_hard_reset_v1')) {
        await db.activities.clear();
        await db.userState.clear();
        localStorage.setItem('app_hard_reset_v1', 'true');
        window.location.reload();
        return;
      }

      // Init UserState
      const existingUser = await db.userState.get(1);
      if (!existingUser) {
        await db.userState.put({
          id: 1,
          streakCount: 0,
          freezesLeft: 6,
          usedFreezeToday: false,
          lastActiveDate: todayStr
        });
      } else if (existingUser.lastActiveDate !== todayStr) {
        // Rollover logic: Reset usedFreezeToday for the new day
        await db.userState.update(1, {
          usedFreezeToday: false,
          lastActiveDate: todayStr
        });
      }
    };
    initDB();
  }, [todayStr]);

  // Auto-Reminder Notifications logic (triggers only exactly once on the 0th second)
  useEffect(() => {
    const exactHour = currentTime.getHours();
    const exactMinute = currentTime.getMinutes();
    const exactSecond = currentTime.getSeconds();

    if (exactHour === 8 && exactMinute === 50 && exactSecond === 0 && !hasCheckedIn) {
      setTimeout(() => {
        setToastMessage('Waktu Check-In dimulai dalam 10 menit. Bersiaplah!');
        setIsToastVisible(true);
      }, 0);
    } else if (exactHour === 16 && exactMinute === 55 && exactSecond === 0 && hasCheckedIn && !hasCheckedOut) {
      setTimeout(() => {
        setToastMessage('Waktu kerja segera berakhir dalam 5 menit. Jangan lupa Check-Out!');
        setIsToastVisible(true);
      }, 0);
    }
  }, [currentTime, hasCheckedIn, hasCheckedOut]);

  const handleCapturePhoto = async (photoData: string) => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    if (isCameraOpenFor === 'checkin') {
      const timeStr = formatTime(now);
      
      let newIsLate = false;
      let newStreakCount = streakCount;
      let newFreezesLeft = freezesLeft;
      let newUsedFreezeToday = usedFreezeToday;
      // Late if after 11:00
      if (hour > 11 || (hour === 11 && minute > 0)) {
        newIsLate = true;
        if (freezesLeft > 0) {
          newFreezesLeft -= 1;
          newUsedFreezeToday = true;
        } else {
          newStreakCount = 0; // Break the streak
        }
      } else {
        newIsLate = false;
        newUsedFreezeToday = false;
        newStreakCount += 1; // Increase the streak
      }

      // Update Local Ephemeral User State in DB
      await db.userState.update(1, {
        streakCount: newStreakCount,
        freezesLeft: newFreezesLeft,
        usedFreezeToday: newUsedFreezeToday,
        lastActiveDate: todayStr
      });

      // Insert Activity Record to DB
      const existingActivity = await db.activities.where('dateString').equals(todayStr).first();
      if (existingActivity && existingActivity.id) {
          await db.activities.update(existingActivity.id, {
            checkInTime: timeStr,
            checkInPhoto: photoData,
            mood: selectedMood,
            isLate: newIsLate
         });
      } else {
        await db.activities.add({
          dateString: todayStr,
          checkInTime: timeStr,
          checkInPhoto: photoData,
          mood: selectedMood,
          isLate: newIsLate
        });
      }
      setSelectedMood(null);

    } else if (isCameraOpenFor === 'checkout') {
      const timeStr = formatTime(now);
      // "Pulang Cepat" if checking out before 17:00
      const earlyLeave = hour < 17;

      const existingActivity = await db.activities.where('dateString').equals(todayStr).first();
      if (existingActivity && existingActivity.id) {
         await db.activities.update(existingActivity.id, {
            checkOutTime: timeStr,
            checkOutPhoto: photoData,
            feedback: selectedFeedback,
            isEarlyLeave: earlyLeave
         });
      } else {
         await db.activities.add({
            dateString: todayStr,
            checkOutTime: timeStr,
            checkOutPhoto: photoData,
            feedback: selectedFeedback,
            isEarlyLeave: earlyLeave
         });
      }
      setSelectedFeedback(null);
    }

    setIsCameraOpenFor(null);
  };

  const initCheckIn = () => {
    if (isCheckInAllowed && !hasCheckedIn) {
      setIsCameraOpenFor('checkin');
    }
  };

  const initCheckOut = () => {
    if (isCheckOutAllowed && !hasCheckedOut) {
      setIsCameraOpenFor('checkout');
    }
  };

  const handleLeaveRequest = async () => {
    const existingActivity = await db.activities.where('dateString').equals(todayStr).first();
    if (existingActivity && existingActivity.id) {
       await db.activities.update(existingActivity.id, {
          isLeave: true
       });
    } else {
       await db.activities.add({
          dateString: todayStr,
          isLeave: true
       });
    }
    
    setToastMessage('Status Cuti/Izin berhasil disimpan!');
    setIsToastVisible(true);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">CheckInWithEase</h1>
        <p className="app-subtitle">Sistem Absensi Terpercaya & Premium</p>
      </header>

      <div className="clock-container">
        <div className="clock-time">{formatTime(currentTime)}</div>
        <div className="clock-date">
          {currentTime.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <StreakDisplay
        streakCount={streakCount}
        hasCheckedIn={hasCheckedIn}
        isLate={isLate}
        freezesLeft={freezesLeft}
        usedFreezeToday={usedFreezeToday}
      />

      <StatusCard
        hasCheckedIn={hasCheckedIn}
        checkInTime={dailyActivity?.checkInTime ?? null}
        checkInPhoto={dailyActivity?.checkInPhoto ?? null}
        selectedMood={dailyActivity?.mood ?? null}
        isLate={isLate}
        hasCheckedOut={hasCheckedOut}
        checkOutTime={dailyActivity?.checkOutTime ?? null}
        checkOutPhoto={dailyActivity?.checkOutPhoto ?? null}
        selectedFeedback={dailyActivity?.feedback ?? null}
        isEarlyLeave={isEarlyLeave}
      />

      {!hasCheckedIn && isCheckInAllowed && (
        <MoodSelector
          selectedMood={selectedMood}
          onSelect={setSelectedMood}
          isAllowed={isCheckInAllowed}
        />
      )}

      {!hasCheckedIn && isCheckInAllowed && !isLeave && (
        <CheckInButton
          isAllowed={isCheckInAllowed}
          hasCheckedIn={hasCheckedIn}
          onCheckIn={initCheckIn}
        />
      )}

      {/* Button for logging Leave (Cuti/Izin) */}
      <LeaveButton 
        isAllowed={true} 
        hasCheckedIn={hasCheckedIn} 
        isLeave={isLeave} 
        onLeave={handleLeaveRequest} 
      />

      {hasCheckedIn && !hasCheckedOut && isCheckOutAllowed && !isLeave && (
        <FeedbackSelector
          selectedFeedback={selectedFeedback}
          onSelect={setSelectedFeedback}
          isAllowed={isCheckOutAllowed}
        />
      )}

      {hasCheckedIn && !hasCheckedOut && isCheckOutAllowed && (
        <CheckOutButton
          isAllowed={isCheckOutAllowed}
          hasCheckedOut={hasCheckedOut}
          onCheckOut={initCheckOut}
        />
      )}

      {isCameraOpenFor && (
        <SelfieCamera
          title={`Live Selfie untuk ${isCameraOpenFor === 'checkin' ? 'Check-In' : 'Check-Out'}`}
          onCapture={handleCapturePhoto}
          onCancel={() => setIsCameraOpenFor(null)}
        />
      )}

      {/* Monthly Attendance Calendar */}
      <AttendanceCalendar />

      <Toast
        message={toastMessage}
        isVisible={isToastVisible}
        type="warning"
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}

export default App;
