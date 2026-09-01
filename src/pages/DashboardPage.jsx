import React, { useState } from 'react';

export default function DashboardPage({ 
  user, 
  tasks, 
  onToggleTask, 
  onStartFocus, 
  onRescheduleTask, 
  onAddTask,
  setCurrentTab 
}) {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('Political Science');
  const [newDuration, setNewDuration] = useState('45');

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const strokeOffset = 251.2 - (251.2 * progressPercent) / 100;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      id: `task-${Date.now()}`,
      title: newTitle,
      subject: newSubject,
      duration: parseInt(newDuration, 10),
      tag: "Custom Session",
      dueTime: "Today",
      status: "pending",
      icon: newSubject.toLowerCase().includes('math') ? 'calculate' : newSubject.toLowerCase().includes('hist') ? 'history_edu' : 'menu_book',
      color: "primary"
    });

    setNewTitle('');
    setIsAddingTask(false);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-8 space-y-8 pb-24">
      
      {/* Greeting Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-headline-md text-on-surface flex items-center gap-2">
            Good morning, {user.displayName.split(' ')[0]} <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant font-body-md mt-1">
            Here is your AI-optimized study plan for today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsAddingTask(!isAddingTask)}
            className="px-5 py-2.5 bg-primary text-white rounded-full text-xs font-bold font-label-bold flex items-center gap-1.5 shadow-md hover:bg-primary-container transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Study Task</span>
          </button>
          <button
            onClick={() => setCurrentTab('study_plan')}
            className="px-5 py-2.5 bg-surface hover:bg-surface-container-high text-on-surface rounded-full text-xs font-semibold border border-outline-variant/30 transition-colors shadow-xs"
          >
            Full Roadmap
          </button>
        </div>
      </div>

      {/* Add Task Collapse Form */}
      {isAddingTask && (
        <form onSubmit={handleCreateTask} className="bg-surface p-5 sm:p-6 rounded-3xl border border-primary/40 shadow-lg animate-fadeIn space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">add_task</span> Add Today's Custom Study Goal
            </span>
            <button type="button" onClick={() => setIsAddingTask(false)} className="text-outline hover:text-on-surface text-xs font-medium">Cancel</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              required
              placeholder="Task title (e.g. Bioenergetics Ch 3)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-1 px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
            <select
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="px-4 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
            >
              {user.subjects.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                type="number"
                min="10"
                max="180"
                value={newDuration}
                onChange={(e) => setNewDuration(e.target.value)}
                className="w-24 px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary text-center"
              />
              <span className="self-center text-xs text-on-surface-variant font-medium">mins</span>
              <button type="submit" className="flex-1 px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container shadow-xs">
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Progress Metric Card */}
        <div className="lg:col-span-1 bg-surface-container rounded-3xl p-6 sm:p-7 flex items-center justify-between shadow-sm border border-outline-variant/20">
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Daily Mastery</span>
            <h2 className="text-xl sm:text-2xl font-bold font-headline-sm text-on-surface">
              Today's Progress
            </h2>
            <p className="text-xs text-on-surface-variant font-body-md mt-1">
              {completedCount} of {totalCount} tasks completed
            </p>
          </div>

          {/* Circular Progress Wheel */}
          <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                className="text-primary-fixed-dim"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-primary transition-all duration-700 ease-out"
                cx="50"
                cy="50"
                fill="none"
                r="40"
                stroke="currentColor"
                strokeDasharray="251.2"
                strokeDashoffset={strokeOffset}
                strokeLinecap="round"
                strokeWidth="8"
              />
            </svg>
            <span className="absolute text-sm sm:text-base font-bold font-label-bold text-on-surface">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* AI Insight Box */}
        <div className="lg:col-span-2 bg-tertiary-container/20 border border-tertiary/30 rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-tertiary text-white flex items-center justify-center shrink-0 shadow-sm">
              <span className="material-symbols-outlined text-[24px]">lightbulb</span>
            </div>
            <div>
              <h3 className="text-xs font-bold font-label-bold text-tertiary uppercase tracking-wider">
                StudySync AI Insight
              </h3>
              <p className="text-xs sm:text-sm text-on-surface font-body-md mt-1 leading-relaxed">
                Based on your quiz history, your retention in <span className="font-bold text-tertiary">Political Science</span> is primed for a 15-minute spaced review before tackling new topics today.
              </p>
            </div>
          </div>
          <button
            onClick={() => onRescheduleTask ? onRescheduleTask('ai-tweak') : null}
            className="self-start sm:self-center px-4 py-2 rounded-full bg-tertiary text-white text-xs font-bold font-label-bold hover:bg-tertiary/90 shrink-0 transition-colors shadow-xs"
          >
            Apply Suggestion
          </button>
        </div>

      </div>

      {/* Today's Tasks Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold font-headline-sm text-on-surface">
            Today's Schedule
          </h2>
          <button 
            onClick={() => setCurrentTab('study_plan')}
            className="text-xs font-bold font-label-bold text-primary flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-3.5 py-1.5 rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">calendar_clock</span>
            <span>Timeline View</span>
          </button>
        </div>

        {/* Task Cards */}
        <div className="space-y-3.5">
          {tasks.map((task) => {
            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                className={`bg-surface rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm border transition-all duration-300 ${
                  isDone 
                    ? 'border-outline-variant/30 opacity-70 bg-surface-container-low/50' 
                    : 'border-outline-variant/40 hover:border-primary/40 hover:shadow-md'
                }`}
              >
                <div className="flex items-start sm:items-center gap-4 flex-1">
                  
                  {/* Subject Icon */}
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    isDone 
                      ? 'bg-outline/10 text-outline' 
                      : task.subject.toLowerCase().includes('pol') 
                      ? 'bg-secondary/10 text-secondary' 
                      : task.subject.toLowerCase().includes('hist') 
                      ? 'bg-tertiary/10 text-tertiary' 
                      : 'bg-primary/10 text-primary'
                  }`}>
                    <span className="material-symbols-outlined text-[24px]">
                      {task.icon || 'book'}
                    </span>
                  </div>

                  {/* Task Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                        {task.subject}
                      </span>
                      {task.tag && (
                        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-surface-container-high text-on-surface-variant font-medium">
                          {task.tag}
                        </span>
                      )}
                    </div>
                    <h4 className={`text-base font-bold text-on-surface mt-0.5 ${isDone ? 'line-through text-outline' : ''}`}>
                      {task.title}
                    </h4>
                    <div className="flex items-center gap-4 text-xs text-on-surface-variant mt-1.5">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[15px]">schedule</span>
                        {task.duration} min
                      </span>
                      {task.dueTime && (
                        <span className="text-[11px] text-outline">Due {task.dueTime}</span>
                      )}
                    </div>
                  </div>

                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 self-end sm:self-center">
                  {!isDone && (
                    <button
                      onClick={() => onStartFocus(task)}
                      className="px-5 py-2.5 rounded-full bg-primary text-white text-xs font-bold font-label-bold hover:bg-primary-container shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_arrow</span>
                      <span>Start Focus</span>
                    </button>
                  )}

                  <button
                    onClick={() => onToggleTask(task.id)}
                    className={`px-4 py-2.5 rounded-full text-xs font-bold font-label-bold transition-colors flex items-center gap-1.5 ${
                      isDone
                        ? 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                        : 'bg-surface-container-high text-on-surface hover:bg-emerald-500 hover:text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {isDone ? 'check_circle' : 'radio_button_unchecked'}
                    </span>
                    <span>{isDone ? 'Completed' : 'Mark Done'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
