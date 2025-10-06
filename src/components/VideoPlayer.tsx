import React, { useRef, useState, useEffect } from 'react';
import { ArrowLeft, Play, Pause } from 'lucide-react';
import { Video } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { QuizSection } from './QuizSection';

interface VideoPlayerProps {
  video: Video;
  onBack: () => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onBack }) => {
  const { user } = useAuth();
  const { updateProgress, getProgress } = useData();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [hasWatchedFull, setHasWatchedFull] = useState(false);
  const progressIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (!user) return;

    const progress = getProgress(video.id, user.id);
    if (progress) {
      setHasWatchedFull(progress.completed);
      if (videoRef.current && progress.lastPosition > 0) {
        videoRef.current.currentTime = progress.lastPosition;
      }
    }
  }, [video.id, user, getProgress]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement || !user) return;

    const updateProgressData = () => {
      const currentPos = Math.floor(videoElement.currentTime);
      const totalDuration = Math.floor(videoElement.duration);

      updateProgress({
        videoId: video.id,
        studentId: user.id,
        watchTime: Math.max(currentPos, getProgress(video.id, user.id)?.watchTime || 0),
        lastPosition: currentPos,
        completed: false,
      });
    };

    progressIntervalRef.current = setInterval(updateProgressData, 2000);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [video.id, user, updateProgress, getProgress]);

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleVideoEnd = () => {
    if (!user) return;

    setIsPlaying(false);
    setHasWatchedFull(true);

    updateProgress({
      videoId: video.id,
      studentId: user.id,
      watchTime: video.duration,
      lastPosition: video.duration,
      completed: true,
      completedAt: new Date(),
    });

    setShowQuiz(true);
  };

  const handlePlayPause = () => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const seekToTimestamp = (timestamp: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = timestamp;
    setCurrentTime(timestamp);
    videoRef.current.play();
    setIsPlaying(true);
    setShowQuiz(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (showQuiz && hasWatchedFull) {
    return (
      <QuizSection
        video={video}
        onBack={onBack}
        onReplaySegment={seekToTimestamp}
        onReturnToVideo={() => setShowQuiz(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>

        <div className="bg-slate-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="relative bg-black aspect-video">
            <video
              ref={videoRef}
              src={video.videoUrl}
              className="w-full h-full"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnd}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {!isPlaying && (
                <button
                  onClick={handlePlayPause}
                  className="pointer-events-auto bg-cyan-600 hover:bg-cyan-700 text-white p-6 rounded-full shadow-2xl transition-all hover:scale-110"
                >
                  <Play className="w-12 h-12" />
                </button>
              )}
            </div>
          </div>

          <div className="p-6 bg-slate-800">
            <div className="flex items-center space-x-4 mb-4">
              <button
                onClick={handlePlayPause}
                className="bg-cyan-600 hover:bg-cyan-700 text-white p-3 rounded-full transition-all"
              >
                {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>

              <div className="flex-1">
                <input
                  type="range"
                  min="0"
                  max={video.duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #0891b2 0%, #0891b2 ${(currentTime / video.duration) * 100}%, #475569 ${(currentTime / video.duration) * 100}%, #475569 100%)`,
                  }}
                />
              </div>

              <div className="text-white text-sm font-mono">
                {formatTime(currentTime)} / {formatTime(video.duration)}
              </div>
            </div>

            {!hasWatchedFull && (
              <div className="bg-cyan-900/30 border border-cyan-700 rounded-lg p-4 mb-4">
                <p className="text-cyan-300 text-sm">
                  <strong>Note:</strong> Please watch the entire video to unlock the quiz questions.
                </p>
              </div>
            )}

            <div className="border-t border-slate-700 pt-4">
              <h2 className="text-2xl font-bold text-white mb-2">{video.title}</h2>
              <p className="text-slate-300 leading-relaxed">{video.description}</p>
            </div>

            {hasWatchedFull && (
              <div className="mt-6">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-4 rounded-lg font-semibold transition-all shadow-lg"
                >
                  Start Quiz ({video.questions.length} Questions)
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
