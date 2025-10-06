import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Video, VideoProgress, QuizAttempt } from '../types';

interface DataContextType {
  videos: Video[];
  addVideo: (video: Omit<Video, 'id' | 'createdAt'>) => void;
  getVideoById: (id: string) => Video | undefined;
  videoProgress: VideoProgress[];
  updateProgress: (progress: Partial<VideoProgress> & { videoId: string; studentId: string }) => void;
  getProgress: (videoId: string, studentId: string) => VideoProgress | undefined;
  quizAttempts: QuizAttempt[];
  addQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'attemptedAt'>) => void;
  getQuizAttempts: (videoId: string, studentId: string) => QuizAttempt[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [videos, setVideos] = useState<Video[]>([
    {
      id: 'demo-1',
      teacherId: '1',
      title: 'Introduction to Photosynthesis',
      description: 'Learn about the process of photosynthesis in plants and how they convert sunlight into energy.',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      duration: 596,
      thumbnailUrl: '',
      createdAt: new Date(),
      questions: [
        {
          id: 'q1',
          videoId: 'demo-1',
          questionText: 'What is the primary source of energy for photosynthesis?',
          correctAnswer: 'Sunlight',
          options: ['Water', 'Sunlight', 'Carbon Dioxide', 'Oxygen'],
          timestamp: 120,
          explanation: 'Sunlight is the primary energy source that plants use in photosynthesis to convert carbon dioxide and water into glucose.',
          orderIndex: 1,
        },
        {
          id: 'q2',
          videoId: 'demo-1',
          questionText: 'Which gas do plants absorb during photosynthesis?',
          correctAnswer: 'Carbon Dioxide',
          options: ['Oxygen', 'Nitrogen', 'Carbon Dioxide', 'Hydrogen'],
          timestamp: 240,
          explanation: 'Plants absorb carbon dioxide from the atmosphere and use it along with water to produce glucose and oxygen.',
          orderIndex: 2,
        },
        {
          id: 'q3',
          videoId: 'demo-1',
          questionText: 'What is the green pigment in plants called?',
          correctAnswer: 'Chlorophyll',
          options: ['Hemoglobin', 'Chlorophyll', 'Melanin', 'Carotene'],
          timestamp: 360,
          explanation: 'Chlorophyll is the green pigment found in chloroplasts that captures light energy for photosynthesis.',
          orderIndex: 3,
        },
      ],
    },
  ]);

  const [videoProgress, setVideoProgress] = useState<VideoProgress[]>([]);
  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>([]);

  const addVideo = (video: Omit<Video, 'id' | 'createdAt'>) => {
    const newVideo: Video = {
      ...video,
      id: `video-${Date.now()}`,
      createdAt: new Date(),
    };
    setVideos((prev) => [...prev, newVideo]);
  };

  const getVideoById = (id: string) => {
    return videos.find((v) => v.id === id);
  };

  const updateProgress = (progress: Partial<VideoProgress> & { videoId: string; studentId: string }) => {
    setVideoProgress((prev) => {
      const existingIndex = prev.findIndex(
        (p) => p.videoId === progress.videoId && p.studentId === progress.studentId
      );

      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], ...progress };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: `progress-${Date.now()}`,
            studentId: progress.studentId,
            videoId: progress.videoId,
            watchTime: progress.watchTime || 0,
            completed: progress.completed || false,
            lastPosition: progress.lastPosition || 0,
            startedAt: new Date(),
            ...progress,
          },
        ];
      }
    });
  };

  const getProgress = (videoId: string, studentId: string) => {
    return videoProgress.find((p) => p.videoId === videoId && p.studentId === studentId);
  };

  const addQuizAttempt = (attempt: Omit<QuizAttempt, 'id' | 'attemptedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attempt,
      id: `attempt-${Date.now()}`,
      attemptedAt: new Date(),
    };
    setQuizAttempts((prev) => [...prev, newAttempt]);
  };

  const getQuizAttempts = (videoId: string, studentId: string) => {
    return quizAttempts.filter((a) => a.videoId === videoId && a.studentId === studentId);
  };

  return (
    <DataContext.Provider
      value={{
        videos,
        addVideo,
        getVideoById,
        videoProgress,
        updateProgress,
        getProgress,
        quizAttempts,
        addQuizAttempt,
        getQuizAttempts,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
