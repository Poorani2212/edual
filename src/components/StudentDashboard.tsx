import React, { useState } from 'react';
import { Play, LogOut, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Video } from '../types';
import { VideoPlayer } from './VideoPlayer';

export const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { videos, getProgress } = useData();
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const getVideoProgress = (videoId: string) => {
    if (!user) return null;
    return getProgress(videoId, user.id);
  };

  const calculateProgressPercentage = (videoId: string, duration: number) => {
    const progress = getVideoProgress(videoId);
    if (!progress) return 0;
    return Math.min((progress.watchTime / duration) * 100, 100);
  };

  if (selectedVideo) {
    return <VideoPlayer video={selectedVideo} onBack={() => setSelectedVideo(null)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-white to-blue-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/edual.jpg" alt="Eduflex AI" className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Student Dashboard</h1>
                <p className="text-sm text-slate-600">Welcome, {user?.fullName}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{videos.length}</h3>
            <p className="text-slate-600">Available Videos</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">
              {videos.filter((v) => {
                const progress = user ? getProgress(v.id, user.id) : null;
                return progress && !progress.completed;
              }).length}
            </h3>
            <p className="text-slate-600">In Progress</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">
              {videos.filter((v) => {
                const progress = user ? getProgress(v.id, user.id) : null;
                return progress?.completed;
              }).length}
            </h3>
            <p className="text-slate-600">Completed</p>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Course Videos</h2>
          <p className="text-slate-600 mt-1">Watch videos and complete quizzes to track your progress</p>
        </div>

        {videos.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-slate-100">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No videos available</h3>
            <p className="text-slate-600">Check back later for new content</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const progress = getVideoProgress(video.id);
              const progressPercentage = calculateProgressPercentage(video.id, video.duration);
              const isCompleted = progress?.completed;

              return (
                <div
                  key={video.id}
                  className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all hover:scale-[1.02]"
                >
                  <div className="aspect-video bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center relative">
                    <Play className="w-16 h-16 text-white opacity-70" />
                    {isCompleted && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1">
                        <CheckCircle className="w-3 h-3" />
                        <span>Completed</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{video.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2">{video.description}</p>

                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <BookOpen className="w-4 h-4" />
                        <span>{video.questions.length} questions</span>
                      </div>
                    </div>

                    {progress && progressPercentage > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-cyan-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setSelectedVideo(video)}
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all shadow-lg shadow-cyan-200"
                    >
                      <Play className="w-4 h-4" />
                      <span>{progress ? 'Continue' : 'Start'} Learning</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
