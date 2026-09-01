import React, { useState, useEffect } from 'react';

export default function FocusTimerModal({ isOpen, onClose, activeTask, onCompleteSession }) {
  const [mode, setMode] = useState('pomodoro'); // pomodoro (25m), short_break (5m), long_break (15m)
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [ambientSound, setAmbientSound] = useState('rain'); // 'rain', 'waves', 'white_noise', 'none'
  const [sessionsCompleted, setSessionsCompleted] = useState(0);

  useEffect(() => {
    if (mode === 'pomodoro') setTimeLeft(25 * 60);
    if (mode === 'short_break') setTimeLeft(5 * 60);
    if (mode === 'long_break') setTimeLeft(15 * 60);
    setIsRunning(false);
  }, [mode]);

  useEffect(() => {
    let timer = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      if (mode === 'pomodoro') {
        setSessionsCompleted((prev) => prev + 1);
        if (onCompleteSession) onCompleteSession(activeTask);
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode]);

  if (!isOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalModeDuration = mode === 'pomodoro' ? 25 * 60 : mode === 'short_break' ? 5 * 60 : 15 * 60;
  const progressPercentage = ((totalModeDuration - timeLeft) / totalModeDuration) * 100;
  const strokeDashoffset = 251.2 - (251.2 * progressPercentage) / 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant/30 relative overflow-hidden">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold font-label-bold mb-2">
            <span className="material-symbols-outlined text-[15px] animate-pulse">timer</span>
            Deep Focus Mode
          </div>
          <h2 className="text-xl font-bold font-headline-md text-on-surface">
            {activeTask ? activeTask.title : "Study Session"}
          </h2>
          {activeTask && (
            <p className="text-xs text-on-surface-variant mt-1">
              Subject: <span className="font-semibold text-primary">{activeTask.subject}</span>
            </p>
          )}
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex bg-surface-container-low p-1 rounded-2xl mb-8 border border-outline-variant/20">
          {[
            { id: 'pomodoro', label: 'Pomodoro (25m)' },
            { id: 'short_break', label: 'Short Break (5m)' },
            { id: 'long_break', label: 'Long Break (15m)' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id)}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                mode === tab.id
                  ? 'bg-surface text-primary shadow-sm font-bold'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Circular Timer Visual */}
        <div className="relative w-52 h-52 mx-auto flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#e0e0fa"
              strokeWidth="6"
            />
            {/* Active Progress */}
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#4343d5"
              strokeWidth="6"
              strokeDasharray="251.2"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-extrabold font-display-lg text-on-surface tracking-tight">
              {formattedTime}
            </span>
            <span className="text-xs font-medium text-on-surface-variant uppercase tracking-wider mt-1">
              {isRunning ? 'Focusing...' : timeLeft === 0 ? 'Completed!' : 'Ready'}
            </span>
          </div>
        </div>

        {/* Primary Timer Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-full font-bold text-sm text-white shadow-lg transition-all flex items-center gap-2 active:scale-95 ${
              isRunning 
                ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-500/25' 
                : 'bg-primary hover:bg-primary-container shadow-primary/30'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {isRunning ? 'pause' : 'play_arrow'}
            </span>
            <span>{isRunning ? 'Pause' : 'Start Timer'}</span>
          </button>
          
          <button
            onClick={() => {
              setIsRunning(false);
              if (mode === 'pomodoro') setTimeLeft(25 * 60);
              if (mode === 'short_break') setTimeLeft(5 * 60);
              if (mode === 'long_break') setTimeLeft(15 * 60);
            }}
            className="w-12 h-12 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
            title="Reset Timer"
          >
            <span className="material-symbols-outlined text-[20px]">restart_alt</span>
          </button>
        </div>

        {/* Ambient Sound & Stats Footer */}
        <div className="pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px] text-tertiary">headphones</span>
            <span>Ambient:</span>
            <select 
              value={ambientSound} 
              onChange={(e) => setAmbientSound(e.target.value)}
              className="bg-surface-container-low border border-outline-variant/30 rounded-lg px-2 py-1 text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              <option value="rain">Soft Rain</option>
              <option value="waves">Ocean Waves</option>
              <option value="white_noise">White Noise</option>
              <option value="none">Muted</option>
            </select>
          </div>
          <div className="flex items-center gap-1 font-semibold text-primary">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>{sessionsCompleted} completed</span>
          </div>
        </div>

      </div>
    </div>
  );
}
