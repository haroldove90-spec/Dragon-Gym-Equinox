export interface WorkoutMove {
  name: string;
  reps: string;
  sets: number;
  description: string;
}

export interface ProgramSession {
  id: string;
  title: string;
  type: string;
  duration: number; // in minutes
  movesCount: number;
  completed: boolean;
  thumbnail: string;
  moves: WorkoutMove[];
}

export interface Program {
  id: string;
  title: string;
  subtitle: string;
  startDate: string;
  endDate: string;
  image: string;
  isActive: boolean;
  sessions: ProgramSession[];
}

export interface ClassBreakdown {
  strength: number; // 1 to 5
  cardio: number;   // 1 to 5
  athleticism: number; // 1 to 5
}

export interface GymClass {
  id: string;
  title: string;
  category: 'HIIT' | 'Yoga' | 'Pilates' | 'Running' | 'Cycling' | 'Strength';
  instructor: string;
  location: string;
  duration: number; // in minutes
  time: string;
  date: string;
  level: 'All Levels' | 'Intermediate' | 'Advanced';
  image: string;
  description: string;
  breakdown: ClassBreakdown;
  booked: boolean;
  isEquinoxExclusive: boolean;
}

export interface Article {
  id: string;
  title: string;
  category: 'SHOP' | 'BENEFIT' | 'LIFE' | 'NUTRITION';
  image: string;
  subtitle: string;
  content: string;
  readTime: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodType: string;
  emergencyContact: string;
  avatarLetter: string;
  checkInCount: number;
  checkInGoal: number;
  membershipLevel: string;
  favoriteClub: string;
}
