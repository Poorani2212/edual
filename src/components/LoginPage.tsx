import React, { useState } from 'react';
import { BookOpen, GraduationCap, Users, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'teacher' | 'student' | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return;

    try {
      setError('');
      await login(email, password, selectedRole);
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
        <div className="max-w-6xl w-full">
          <div className="text-center mb-12">
            <div className="flex justify-center mb-6">
              <img src="/edual.jpg" alt="Eduflex AI" className="h-24 w-auto" />
            </div>
            <h1 className="text-5xl font-bold text-slate-800 mb-4">Welcome to Eduflex AI</h1>
            <p className="text-xl text-slate-600">Intelligent Learning Platform with AI-Powered Feedback</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <button
              onClick={() => setSelectedRole('teacher')}
              className="group relative bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-blue-400 hover:scale-105"
            >
              <div className="absolute top-8 right-8">
                <div className="bg-blue-100 p-3 rounded-full group-hover:bg-blue-200 transition-colors">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Teacher Login</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Upload educational videos and create interactive quizzes to enhance student learning with AI-powered insights.
                </p>
                <div className="mt-6 flex items-center text-blue-600 font-semibold">
                  <span>Continue as Teacher</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole('student')}
              className="group relative bg-white rounded-2xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-cyan-400 hover:scale-105"
            >
              <div className="absolute top-8 right-8">
                <div className="bg-cyan-100 p-3 rounded-full group-hover:bg-cyan-200 transition-colors">
                  <Users className="w-8 h-8 text-cyan-600" />
                </div>
              </div>
              <div className="text-left">
                <h2 className="text-3xl font-bold text-slate-800 mb-4">Student Login</h2>
                <p className="text-slate-600 text-lg leading-relaxed">
                  Watch educational videos, track your progress, and receive intelligent feedback on quizzes tailored to your learning.
                </p>
                <div className="mt-6 flex items-center text-cyan-600 font-semibold">
                  <span>Continue as Student</span>
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>

          <div className="mt-16 text-center">
            <div className="inline-flex items-center space-x-8 text-slate-600">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <span>Interactive Learning</span>
              </div>
              <div className="flex items-center space-x-2">
                <AlertCircle className="w-5 h-5 text-cyan-500" />
                <span>AI-Powered Feedback</span>
              </div>
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-blue-500" />
                <span>Progress Tracking</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <button
          onClick={() => {
            setSelectedRole(null);
            setError('');
            setEmail('');
            setPassword('');
          }}
          className="mb-8 text-slate-600 hover:text-slate-800 flex items-center space-x-2 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Back to role selection</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <div className={`inline-flex p-4 rounded-full mb-4 ${selectedRole === 'teacher' ? 'bg-blue-100' : 'bg-cyan-100'}`}>
              {selectedRole === 'teacher' ? (
                <GraduationCap className={`w-8 h-8 ${selectedRole === 'teacher' ? 'text-blue-600' : 'text-cyan-600'}`} />
              ) : (
                <Users className={`w-8 h-8 ${selectedRole === 'teacher' ? 'text-blue-600' : 'text-cyan-600'}`} />
              )}
            </div>
            <h2 className="text-3xl font-bold text-slate-800 capitalize">{selectedRole} Login</h2>
            <p className="text-slate-600 mt-2">Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder={`${selectedRole}@eduflex.ai`}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold transition-all duration-200 ${
                selectedRole === 'teacher'
                  ? 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200'
                  : 'bg-cyan-600 hover:bg-cyan-700 shadow-lg shadow-cyan-200'
              }`}
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-slate-50 rounded-lg">
            <p className="text-sm text-slate-600 font-medium mb-2">Demo Credentials:</p>
            <p className="text-xs text-slate-500">
              Email: {selectedRole}@eduflex.ai
              <br />
              Password: {selectedRole}123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
