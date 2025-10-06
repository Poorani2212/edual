export type UserRole = 'teacher' | 'student';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface Video {
  id: string;
  teacherId: string;
  title: string;
  description: string;
  videoUrl: string;
  duration: number;
  thumbnailUrl?: string;
  createdAt: Date;
  questions: Question[];
}

export interface Question {
  id: string;
  videoId: string;
  questionText: string;
  correctAnswer: string;
  options: string[];
  timestamp: number;
  explanation: string;
  orderIndex: number;
}

export interface VideoProgress {
  id: string;
  studentId: string;
  videoId: string;
  watchTime: number;
  completed: boolean;
  lastPosition: number;
  startedAt: Date;
  completedAt?: Date;
}

export interface QuizAttempt {
  id: string;
  studentId: string;
  videoId: string;
  questionId: string;
  studentAnswer: string;
  isCorrect: boolean;
  attemptedAt: Date;
}
