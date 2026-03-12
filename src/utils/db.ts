import Dexie, { type EntityTable } from 'dexie';
import type { Mood } from '../components/MoodSelector';
import type { Feedback } from '../components/FeedbackSelector';

// Define the interface for a Daily Activity record
export interface DailyActivity {
  id?: number;          // Auto-incremented primary key
  dateString: string;   // YYYY-MM-DD
  checkInTime?: string | null;
  checkInPhoto?: string | null;
  mood?: Mood | null;
  isLate?: boolean;
  
  checkOutTime?: string | null;
  checkOutPhoto?: string | null;
  feedback?: Feedback | null;
  isEarlyLeave?: boolean;
  
  isLeave?: boolean; // True if user took Leave (Cuti/Izin)
}

// Define the interface for global User State (only keeps one record usually, ID=1)
export interface UserState {
  id?: number;
  streakCount: number;
  freezesLeft: number;
  usedFreezeToday: boolean;
  lastActiveDate: string; // YYYY-MM-DD to detect day rollover
}

// Subclass Dexie to define our Database
class AppDatabase extends Dexie {
  activities!: EntityTable<DailyActivity, 'id'>;
  userState!: EntityTable<UserState, 'id'>;

  constructor() {
    super('CheckInWithEaseDB_v2'); // Bumping version to clear old cache
    
    // Define schema
    this.version(1).stores({
      activities: '++id, dateString', // dateString is indexed for fast lookups by day
      userState: '++id'
    });
  }
}

export const db = new AppDatabase();

// Helper to get today's date string in YYYY-MM-DD format (local time)
export const getTodayString = (now = new Date()): string => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
