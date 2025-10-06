import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Award, Brain } from 'lucide-react';
import { Video, Question } from '../types';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

interface QuizSectionProps {
  video: Video;
  onBack: () => void;
  onReplaySegment: (timestamp: number) => void;
  onReturnToVideo: () => void;
}

export const QuizSection: React.FC<QuizSectionProps> = ({
  video,
  onBack,
  onReplaySegment,
  onReturnToVideo,
}) => {
  const { user } = useAuth();
  const { addQuizAttempt } = useData();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(new Set());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const currentQuestion = video.questions[currentQuestionIndex];
  const totalQuestions = video.questions.length;
  const allQuestionsAnswered = answeredQuestions.size === totalQuestions;

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    setSelectedAnswer(answer);
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswer || !user) return;

    const correct = selectedAnswer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    addQuizAttempt({
      studentId: user.id,
      videoId: video.id,
      questionId: currentQuestion.id,
      studentAnswer: selectedAnswer,
      isCorrect: correct,
    });

    if (correct && !answeredQuestions.has(currentQuestionIndex)) {
      setCorrectAnswers((prev) => prev + 1);
    }

    setAnsweredQuestions((prev) => new Set(prev).add(currentQuestionIndex));
  };

  const handleReplaySegment = () => {
    onReplaySegment(currentQuestion.timestamp);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
    } else if (allQuestionsAnswered) {
      setQuizCompleted(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setIsCorrect(false);
    }
  };

  const handleRetry = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setAnsweredQuestions(new Set());
    setCorrectAnswers(0);
    setQuizCompleted(false);
  };

  if (quizCompleted) {
    const percentage = (correctAnswers / totalQuestions) * 100;
    const passed = percentage >= 70;

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-slate-800 rounded-2xl shadow-2xl p-12">
          <div className="text-center">
            <div
              className={`inline-flex p-6 rounded-full mb-6 ${
                passed ? 'bg-green-900/30' : 'bg-yellow-900/30'
              }`}
            >
              <Award className={`w-16 h-16 ${passed ? 'text-green-400' : 'text-yellow-400'}`} />
            </div>

            <h2 className="text-4xl font-bold text-white mb-4">Quiz Completed!</h2>
            <p className="text-slate-300 text-lg mb-8">
              {passed
                ? 'Congratulations! You have demonstrated excellent understanding.'
                : 'Good effort! Review the material and try again to improve your score.'}
            </p>

            <div className="bg-slate-700/50 rounded-xl p-8 mb-8">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Your Score</p>
                  <p className="text-4xl font-bold text-white">
                    {correctAnswers}/{totalQuestions}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-2">Percentage</p>
                  <p className="text-4xl font-bold text-white">{Math.round(percentage)}%</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <button
                onClick={handleRetry}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Retry Quiz</span>
              </button>

              <button
                onClick={onReturnToVideo}
                className="flex items-center justify-center space-x-2 px-6 py-4 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition-all"
              >
                <span>Review Video</span>
              </button>

              <button
                onClick={onBack}
                className="flex items-center justify-center space-x-2 px-6 py-4 text-slate-400 hover:text-white transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <button
          onClick={onReturnToVideo}
          className="flex items-center space-x-2 text-white hover:text-cyan-400 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Video</span>
        </button>

        <div className="bg-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6">
            <div className="flex items-center justify-between text-white mb-4">
              <h2 className="text-2xl font-bold">Quiz Time</h2>
              <div className="bg-white/20 px-4 py-2 rounded-full">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-8">
            <div className="flex items-start space-x-3 mb-8">
              <div className="bg-cyan-900/30 p-3 rounded-lg">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold text-white mb-2">{currentQuestion.questionText}</h3>
                <p className="text-slate-400 text-sm">Select the correct answer below</p>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              {currentQuestion.options.map((option, index) => {
                const isSelected = selectedAnswer === option;
                const isCorrectAnswer = option === currentQuestion.correctAnswer;
                const showCorrectStyle = showFeedback && isCorrectAnswer;
                const showIncorrectStyle = showFeedback && isSelected && !isCorrect;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={showFeedback}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                      showCorrectStyle
                        ? 'border-green-500 bg-green-900/30'
                        : showIncorrectStyle
                        ? 'border-red-500 bg-red-900/30'
                        : isSelected
                        ? 'border-cyan-500 bg-cyan-900/30'
                        : 'border-slate-600 bg-slate-700/50 hover:border-slate-500'
                    } ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-white font-medium">{option}</span>
                      {showFeedback && (
                        <>
                          {showCorrectStyle && <CheckCircle className="w-6 h-6 text-green-400" />}
                          {showIncorrectStyle && <XCircle className="w-6 h-6 text-red-400" />}
                        </>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div
                className={`rounded-xl p-6 mb-6 ${
                  isCorrect ? 'bg-green-900/30 border border-green-700' : 'bg-red-900/30 border border-red-700'
                }`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
                  )}
                  <div>
                    <h4 className={`font-semibold mb-2 ${isCorrect ? 'text-green-300' : 'text-red-300'}`}>
                      {isCorrect ? 'Correct!' : 'Incorrect'}
                    </h4>
                    <p className={`text-sm leading-relaxed ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                </div>

                {!isCorrect && (
                  <button
                    onClick={handleReplaySegment}
                    className="flex items-center space-x-2 mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-all text-sm font-semibold"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Replay Relevant Video Section</span>
                  </button>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-6 border-t border-slate-700">
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-3 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>

              {!showFeedback ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  Submit Answer
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition-all"
                >
                  {currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Quiz'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 bg-slate-800 rounded-xl p-6">
          <h3 className="text-white font-semibold mb-3">Progress Summary</h3>
          <div className="flex flex-wrap gap-2">
            {video.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer(null);
                  setShowFeedback(false);
                  setIsCorrect(false);
                }}
                className={`w-10 h-10 rounded-lg font-semibold transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-cyan-600 text-white'
                    : answeredQuestions.has(index)
                    ? 'bg-green-600 text-white'
                    : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
