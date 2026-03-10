import { useState, useEffect } from 'react';
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
import { MusicSelector } from './components/MusicSelector';
import { useTimeValidation } from './hooks/useTimeValidation';
import { formatTime } from './utils/timeFormatters';
import './index.css';

function App() {
  const { currentTime, isCheckInAllowed, isCheckOutAllowed } = useTimeValidation();
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkInTime, setCheckInTime] = useState<string | null>(null);
  const [checkInPhoto, setCheckInPhoto] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood>(null);
  const [isLate, setIsLate] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [checkOutTime, setCheckOutTime] = useState<string | null>(null);
  const [checkOutPhoto, setCheckOutPhoto] = useState<string | null>(null);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback>(null);
  const [isEarlyLeave, setIsEarlyLeave] = useState(false);
  const [streakCount, setStreakCount] = useState<number>(12); // Mock initial streak of 12 days
  const [freezesLeft, setFreezesLeft] = useState<number>(6); // Start with 6 freezes
  const [usedFreezeToday, setUsedFreezeToday] = useState<boolean>(false);
  
  // Music logic
  const [isFastest, setIsFastest] = useState<boolean>(false);
  const [showMusicSelector, setShowMusicSelector] = useState<boolean>(false);
  const [musicUrl, setMusicUrl] = useState<string | null>(null);

  const [toastMessage, setToastMessage] = useState<string>('');
  const [isToastVisible, setIsToastVisible] = useState<boolean>(false);
  const [isCameraOpenFor, setIsCameraOpenFor] = useState<'checkin' | 'checkout' | null>(null);

  // Auto-clear checkin if day changes (simplistic approach for demo)
  useEffect(() => {
    if (currentTime.getHours() === 0 && currentTime.getMinutes() === 0) {
      setHasCheckedIn(false);
      setCheckInTime(null);
      setCheckInPhoto(null);
      setSelectedMood(null);
      setIsLate(false);
      setHasCheckedOut(false);
      setCheckOutTime(null);
      setCheckOutPhoto(null);
      setSelectedFeedback(null);
      setIsEarlyLeave(false);
      setUsedFreezeToday(false);
      setIsFastest(false);
      setShowMusicSelector(false);
      setMusicUrl(null);
    }

    // Auto-Reminder Notifications logic (triggers only exactly once on the 0th second)
    const exactHour = currentTime.getHours();
    const exactMinute = currentTime.getMinutes();
    const exactSecond = currentTime.getSeconds();

    if (exactHour === 8 && exactMinute === 50 && exactSecond === 0 && !hasCheckedIn) {
      setToastMessage('Waktu Check-In dimulai dalam 10 menit. Bersiaplah!');
      setIsToastVisible(true);
    } else if (exactHour === 16 && exactMinute === 55 && exactSecond === 0 && hasCheckedIn && !hasCheckedOut) {
      setToastMessage('Waktu kerja segera berakhir dalam 5 menit. Jangan lupa Check-Out!');
      setIsToastVisible(true);
    }

  }, [currentTime, hasCheckedIn, hasCheckedOut]);

  const handleCapturePhoto = (photoData: string) => {
    const now = new Date();
    
    if (isCameraOpenFor === 'checkin') {
      setCheckInPhoto(photoData);
      setHasCheckedIn(true);
      setCheckInTime(formatTime(now));

      const hour = now.getHours();
      const minute = now.getMinutes();
      // Late if after 11:00
      if (hour > 11 || (hour === 11 && minute > 0)) {
        setIsLate(true);
        // Implement Freeze Logic
        if (freezesLeft > 0) {
          setFreezesLeft(prev => prev - 1);
          setUsedFreezeToday(true);
        } else {
          setStreakCount(0); // Break the streak
        }
      } else {
        setIsLate(false);
        setUsedFreezeToday(false);
        setStreakCount(prev => prev + 1); // Increase the streak
        
        // Mock logic: if arriving before 09:30, user is considered "The Fastest" today
        if (hour < 9 || (hour === 9 && minute <= 30)) {
          setIsFastest(true);
          setShowMusicSelector(true);
        }
      }
    } else if (isCameraOpenFor === 'checkout') {
      setCheckOutPhoto(photoData);
      setHasCheckedOut(true);
      setCheckOutTime(formatTime(now));

      const hour = now.getHours();
      // "Pulang Cepat" if checking out before 17:00
      if (hour < 17) {
        setIsEarlyLeave(true);
      } else {
        setIsEarlyLeave(false);
      }
    }
    
    setIsCameraOpenFor(null);
  };

  const initCheckIn = () => {
    if (isCheckInAllowed && !hasCheckedIn && selectedMood) {
      setIsCameraOpenFor('checkin');
    }
  };

  const initCheckOut = () => {
    if (isCheckOutAllowed && !hasCheckedOut && selectedFeedback) {
      setIsCameraOpenFor('checkout');
    }
  };

  const handleMusicSubmit = (url: string) => {
    let embeddedUrl = url;
    
    // Convert regular URLs to embed URLs
    if (url.includes('spotify.com/track')) {
        const trackId = url.split('track/')[1].split('?')[0];
        embeddedUrl = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator`;
    } else if (url.includes('youtube.com/watch')) {
        const videoId = url.split('v=')[1].split('&')[0];
        embeddedUrl = `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1].split('?')[0];
        embeddedUrl = `https://www.youtube.com/embed/${videoId}`;
    }

    setMusicUrl(embeddedUrl);
    setShowMusicSelector(false);
  };

  const handleMusicSkip = () => {
    setShowMusicSelector(false);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">CheckInWithEase</h1>
        <p className="app-subtitle">Sistem Absensi Terpercaya & Premium</p>
      </header>

      {/* Embedded Music of the Day Player */}
      {musicUrl && (
        <div className="music-player-container glass-panel">
            <h3 className="music-player-title">🎵 Music of the Day</h3>
            <iframe 
                src={musicUrl} 
                width="100%" 
                height={musicUrl.includes('spotify') ? "80" : "150"} 
                frameBorder="0" 
                allowFullScreen={false} 
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
                loading="lazy"
                title="Office Playlist"
                className="music-iframe"
            ></iframe>
        </div>
      )}

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
        checkInTime={checkInTime}
        checkInPhoto={checkInPhoto}
        selectedMood={selectedMood}
        isLate={isLate}
        hasCheckedOut={hasCheckedOut}
        checkOutTime={checkOutTime}
        checkOutPhoto={checkOutPhoto}
        selectedFeedback={selectedFeedback}
        isEarlyLeave={isEarlyLeave}
      />

      {showMusicSelector && hasCheckedIn && isFastest && (
        <MusicSelector 
          onSubmit={handleMusicSubmit} 
          onSkip={handleMusicSkip} 
        />
      )}

      {!hasCheckedIn && isCheckInAllowed && (
        <MoodSelector 
          selectedMood={selectedMood} 
          onSelect={setSelectedMood} 
          isAllowed={isCheckInAllowed} 
        />
      )}

      {selectedMood && !hasCheckedIn && (
        <CheckInButton
          isAllowed={isCheckInAllowed}
          hasCheckedIn={hasCheckedIn}
          onCheckIn={initCheckIn}
        />
      )}

      {hasCheckedIn && !hasCheckedOut && isCheckOutAllowed && (
        <FeedbackSelector 
          selectedFeedback={selectedFeedback} 
          onSelect={setSelectedFeedback} 
          isAllowed={isCheckOutAllowed} 
        />
      )}

      {selectedFeedback && hasCheckedIn && !hasCheckedOut && (
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
