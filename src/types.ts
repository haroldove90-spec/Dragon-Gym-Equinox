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
  category: 'HIIT' | 'Funcional' | 'Pilates' | 'Running' | 'Cycling' | 'Strength';
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

export interface ExerciseSet {
  reps: number;
  weight: number;
  completed: boolean;
}

export interface WorkoutExercise {
  id: string;
  name: string;
  category: string;
  youtubeId: string;
  sets: ExerciseSet[];
}

export interface WorkoutRoutine {
  id: string;
  title: string;
  level: string;
  duration: number;
  exercises: WorkoutExercise[];
}

export interface GymAnnouncement {
  id: string;
  title: string;
  content: string;
  priority: 'Alta' | 'Normal';
  date: string;
}
