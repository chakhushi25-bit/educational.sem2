import React, { useEffect, useState } from 'react';
import { weeklyAnalyticsData, initialBadges } from '../data/mockData';

export default function AnalyticsPage({ user, onScheduleRevision, badges: badgesProp, weeklyAnalytics }) {
  const [selectedDay, setSelectedDay] = useState(null);
  const [badges, setBadges] = useState(badgesProp?.length ? badgesProp : initialBadges);
  const chartData = weeklyAnalytics?.length ? weeklyAnalytics : weeklyAnalyticsData;

  useEffect(() => {
    if (badgesProp?.length) setBadges(badgesProp);
  }, [badgesProp]);

  const maxHours = 8.0;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-8 space-y-8 pb-24">
      
      {/* Title & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-headline-md text-on-surface">
            Performance & Track Record
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            AI learning analytics, study volume trends, and subject mastery indexes.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-full text-xs font-bold font-label-bold self-start">
          <span className="material-symbols-outlined text-[18px]">trending_up</span>
          <span>+14% vs. Last Week</span>
        </div>
      </div>

      {/* 4 Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="material-symbols-outlined text-[22px] text-primary">schedule</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed">+4h</span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold font-display-lg text-on-surface">32.5</span>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Hours this week</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="material-symbols-outlined text-[22px] text-emerald-600">task_alt</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">92%</span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold font-display-lg text-on-surface">{user.tasksCompletedThisWeek}</span>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Tasks completed</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="material-symbols-outlined text-[22px] text-rose-500">local_fire_department</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">Hot</span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold font-display-lg text-on-surface">{user.streakDays}</span>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Day streak</p>
        </div>

        <div className="bg-surface rounded-3xl p-5 sm:p-6 border border-outline-variant/30 shadow-sm">
          <div className="flex items-center justify-between text-on-surface-variant mb-2">
            <span className="material-symbols-outlined text-[22px] text-secondary">psychology</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-secondary-fixed text-on-secondary-fixed">Top 5%</span>
          </div>
          <span className="text-3xl sm:text-4xl font-extrabold font-display-lg text-on-surface">{user.topicsMastered}</span>
          <p className="text-xs text-on-surface-variant font-medium mt-1">Topics mastered</p>
        </div>

      </div>

      {/* StudySync AI Diagnostic Banner */}
      <div className="bg-tertiary-container/20 border border-tertiary/30 rounded-3xl p-6 sm:p-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-tertiary text-white flex items-center justify-center shrink-0 shadow-md">
            <span className="material-symbols-outlined text-[26px]">lightbulb</span>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-tertiary">
              StudySync Performance Insight
            </h3>
            <p className="text-xs sm:text-sm text-on-surface mt-1 leading-relaxed">
              Your <span className="font-bold text-primary">Macroeconomics</span> retention index improved by <span className="font-bold text-emerald-600">18%</span> this week. We suggest a 20-min revision session on Monday to lock in monetary policy terms.
            </p>
          </div>
        </div>

        <button
          onClick={onScheduleRevision}
          className="px-6 py-3 rounded-full bg-tertiary text-white text-xs font-bold font-label-bold hover:bg-tertiary/90 shrink-0 transition-all shadow-sm active:scale-95 flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">event_repeat</span>
          <span>Schedule Revision</span>
        </button>
      </div>

      {/* Analytics Grid: Chart + Subject Mastery */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Weekly Hours Bar Chart */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-headline-sm text-on-surface">Weekly Study Hours</h3>
              <p className="text-xs text-on-surface-variant">Daily volume vs 4.0h baseline target</p>
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
              Avg 4.6h / day
            </span>
          </div>

          <div className="pt-8 pb-2">
            <div className="flex items-end justify-between gap-3 h-48 px-2 sm:px-6">
              {chartData.map((d, idx) => {
                const heightPercent = (d.hours / maxHours) * 100;
                const isSelected = selectedDay === d.day;

                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedDay(isSelected ? null : d.day)}
                    className="flex-1 flex flex-col items-center gap-2 cursor-pointer group"
                  >
                    <span className={`text-[11px] font-bold transition-opacity ${
                      isSelected ? 'opacity-100 text-primary' : 'opacity-0 group-hover:opacity-100 text-on-surface-variant'
                    }`}>
                      {d.hours}h
                    </span>

                    <div className="w-full max-w-[42px] bg-surface-container-high rounded-t-xl h-40 flex items-end p-1 relative overflow-hidden">
                      <div 
                        className={`w-full rounded-t-lg transition-all duration-500 ${
                          isSelected 
                            ? 'bg-primary' 
                            : d.hours >= d.target 
                            ? 'bg-primary-container group-hover:bg-primary' 
                            : 'bg-primary-fixed-dim group-hover:bg-primary-container'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>

                    <span className={`text-xs font-bold transition-colors ${
                      isSelected ? 'text-primary' : 'text-on-surface-variant'
                    }`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Subject Progress Meters */}
        <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-4">
          <h3 className="text-lg font-bold font-headline-sm text-on-surface">Subject Mastery Distribution</h3>
          
          <div className="space-y-4 pt-2">
            {user.subjects.map((sub) => (
              <div key={sub.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <span className={`material-symbols-outlined text-[20px] ${sub.color}`}>{sub.icon}</span>
                    <span className="font-bold text-on-surface">{sub.name}</span>
                  </div>
                  <span className="font-extrabold text-on-surface">{sub.progress}%</span>
                </div>

                <div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      sub.progress >= 80 ? 'bg-emerald-500' : sub.progress >= 60 ? 'bg-primary' : 'bg-amber-500'
                    }`}
                    style={{ width: `${sub.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Badges Section */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold font-headline-sm text-on-surface">Recent Badges & Milestones</h3>
          <span className="text-xs text-primary font-bold">{badges.filter(b => b.unlocked).length} Unlocked</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border flex items-center gap-4 transition-all ${
                badge.unlocked
                  ? 'bg-surface-container-low border-outline-variant/30 shadow-xs'
                  : 'bg-surface-container-lowest/50 border-outline-variant/20 opacity-50'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${badge.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                <span className="material-symbols-outlined text-[22px]">{badge.icon}</span>
              </div>
              <div>
                <h4 className="text-xs font-bold font-headline-sm text-on-surface">{badge.name}</h4>
                <p className="text-[11px] text-on-surface-variant mt-0.5 leading-snug">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
