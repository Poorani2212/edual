import React, { useState } from 'react';
import { Upload, Plus, Video, LogOut, BookOpen, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { UploadVideoModal } from './UploadVideoModal';

export const TeacherDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { videos } = useData();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const teacherVideos = videos.filter((v) => v.teacherId === user?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/edual.jpg" alt="Eduflex AI" className="h-10 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-slate-800">Teacher Dashboard</h1>
                <p className="text-sm text-slate-600">Welcome back, {user?.fullName}</p>
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
              <div className="bg-blue-100 p-3 rounded-lg">
                <Video className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{teacherVideos.length}</h3>
            <p className="text-slate-600">Total Videos</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-cyan-100 p-3 rounded-lg">
                <BookOpen className="w-6 h-6 text-cyan-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">
              {teacherVideos.reduce((acc, v) => acc + v.questions.length, 0)}
            </h3>
            <p className="text-slate-600">Total Questions</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">Active</h3>
            <p className="text-slate-600">Platform Status</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">My Videos</h2>
          <button
            onClick={() => setShowUploadModal(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Plus className="w-5 h-5" />
            <span>Upload New Video</span>
          </button>
        </div>

        {teacherVideos.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-lg border border-slate-100">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">No videos yet</h3>
            <p className="text-slate-600 mb-6">Start by uploading your first educational video</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <Plus className="w-5 h-5" />
              <span>Upload Video</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teacherVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow"
              >
                <div className="aspect-video bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Video className="w-16 h-16 text-white opacity-50" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{video.title}</h3>
                  <p className="text-slate-600 text-sm mb-4 line-clamp-2">{video.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-slate-500">
                      <BookOpen className="w-4 h-4" />
                      <span>{video.questions.length} questions</span>
                    </div>
                    <span className="text-slate-500">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showUploadModal && <UploadVideoModal onClose={() => setShowUploadModal(false)} />}
    </div>
  );
};
