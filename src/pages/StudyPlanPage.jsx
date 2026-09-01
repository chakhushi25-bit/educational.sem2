import React, { useState } from 'react';

export default function StudyPlanPage({ 
  studyPlan, 
  onTogglePlanItem, 
  onOpenNewPlanModal, 
  onStartFocusSession, 
  setCurrentTab 
}) {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const currentWeekData = studyPlan.weeks.find(w => w.weekNumber === selectedWeek) || studyPlan.weeks[0];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-8 space-y-8 pb-24">
      
      {/* Header Plan Overview Banner */}
      <div className="bg-gradient-to-br from-primary via-primary-container to-secondary rounded-3xl p-6 sm:p-10 text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold font-label-bold mb-4">
            <span className="material-symbols-outlined text-[16px] text-tertiary-fixed">verified</span>
            Adaptive Curriculum Active
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold font-display-lg tracking-tight">
            {studyPlan.goalTitle}
          </h1>
          <p className="text-xs sm:text-base text-white/90 mt-1 font-body-md">
            {studyPlan.targetExam} • Calibrated for peak long-term memory retention
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl">
              <span className="text-2xl sm:text-3xl font-black font-display-lg block">{studyPlan.daysRemaining}</span>
              <span className="text-xs text-white/85 font-medium">Days Remaining</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl">
              <span className="text-2xl sm:text-3xl font-black font-display-lg block">{studyPlan.totalTopics}</span>
              <span className="text-xs text-white/85 font-medium">Topics & Concepts</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl">
              <span className="text-2xl sm:text-3xl font-black font-display-lg block">{studyPlan.quizzesScheduled}</span>
              <span className="text-xs text-white/85 font-medium">Active Quizzes</span>
            </div>
            <div className="bg-white/15 backdrop-blur-sm p-4 rounded-2xl">
              <span className="text-2xl sm:text-3xl font-black font-display-lg block">{studyPlan.dailyCommitmentHours}h</span>
              <span className="text-xs text-white/85 font-medium">Daily Target</span>
            </div>
          </div>

          {/* Actions Toolbar */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-white/20">
            <button
              onClick={() => onStartFocusSession ? onStartFocusSession({ title: "Day 1 Core Focus", subject: "Biology" }) : null}
              className="px-6 py-3 bg-white text-primary rounded-full text-xs font-bold font-label-bold hover:bg-slate-100 transition-all flex items-center gap-2 shadow-md active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              <span>Start Today's Session</span>
            </button>
            <button
              onClick={onOpenNewPlanModal}
              className="px-6 py-3 bg-white/20 text-white hover:bg-white/30 rounded-full text-xs font-bold font-label-bold transition-colors flex items-center gap-2 backdrop-blur-sm"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              <span>Regenerate / New Syllabus</span>
            </button>
          </div>
        </div>
      </div>

      {/* Week Timeline Selector */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 hide-scrollbar">
        {studyPlan.weeks.map((week) => (
          <button
            key={week.weekNumber}
            onClick={() => setSelectedWeek(week.weekNumber)}
            className={`px-5 py-3 rounded-2xl text-xs font-bold font-label-bold shrink-0 transition-all flex items-center gap-2.5 ${
              selectedWeek === week.weekNumber
                ? 'bg-primary text-white shadow-md'
                : 'bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant/30'
            }`}
          >
            <span>Week {week.weekNumber}</span>
            {week.isCurrent && (
              <span className="px-2 py-0.5 rounded-full text-[9px] uppercase bg-emerald-400 text-slate-900 font-extrabold">
                Current
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Week Title & Description */}
      <div>
        <h2 className="text-xl font-bold font-headline-sm text-on-surface">
          {currentWeekData.title}
        </h2>
        <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">
          Week {currentWeekData.weekNumber} Curriculum & Daily Schedule
        </p>
      </div>

      {/* Days List */}
      <div className="space-y-6">
        {currentWeekData.days.map((day, dIdx) => (
          <div key={dIdx} className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-4">
            
            {/* Day Header */}
            <div className="flex items-center justify-between pb-4 border-b border-outline-variant/20">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm font-display-lg">
                  {day.dayName.split(',')[0]}
                </span>
                <div>
                  <h3 className="text-base font-bold font-headline-sm text-on-surface">
                    {day.dayName}
                  </h3>
                  <span className="text-xs text-on-surface-variant">
                    {day.items.length} sessions scheduled
                  </span>
                </div>
              </div>

              <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                {day.items.filter(i => i.completed).length}/{day.items.length} Done
              </span>
            </div>

            {/* Day Items */}
            <div className="space-y-3.5">
              {day.items.map((item) => (
                <div
                  key={item.id}
                  className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    item.completed
                      ? 'bg-surface-container-low/50 border-outline-variant/30 opacity-75'
                      : 'bg-surface-container/40 border-outline-variant/30 hover:border-primary/40'
                  }`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    
                    {/* Checkbox Trigger */}
                    <button
                      onClick={() => onTogglePlanItem(item.id)}
                      className={`mt-0.5 w-7 h-7 rounded-xl flex items-center justify-center transition-colors shrink-0 ${
                        item.completed
                          ? 'bg-primary text-white shadow-xs'
                          : 'border-2 border-outline hover:border-primary text-transparent'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[18px]">check</span>
                    </button>

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          item.type === 'Theory' 
                            ? 'bg-blue-100 text-blue-800' 
                            : item.type === 'Practice' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.type}
                        </span>
                        <span className="text-xs font-bold text-on-surface-variant">
                          {item.subject}
                        </span>
                        <span className="text-xs text-outline flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">schedule</span>
                          {item.duration} ({item.time})
                        </span>
                      </div>

                      <h4 className={`text-base font-bold text-on-surface mt-1.5 ${item.completed ? 'line-through text-outline' : ''}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                  </div>

                  {!item.completed && (
                    <button
                      onClick={() => onStartFocusSession ? onStartFocusSession(item) : null}
                      className="self-end sm:self-center px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full text-xs font-bold font-label-bold transition-all shrink-0 flex items-center gap-1.5"
                    >
                      <span className="material-symbols-outlined text-[16px]">timer</span>
                      <span>Focus</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
