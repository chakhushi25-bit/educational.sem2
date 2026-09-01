import React, { useState } from 'react';

export default function ProfilePage({ user, onUpdateUser, onOpenUpgrade, showToast }) {
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [university, setUniversity] = useState(user.university);
  const [peakFocusTime, setPeakFocusTime] = useState(user.peakFocusTime);
  const [primaryGoal, setPrimaryGoal] = useState(user.primaryGoal);
  const [nudgeIntensity, setNudgeIntensity] = useState(user.nudgeIntensity);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  // Subject management state
  const [subjects, setSubjects] = useState(user.subjects);
  const [newSubName, setNewSubName] = useState('');
  const [isAddingSub, setIsAddingSub] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      displayName,
      university,
      peakFocusTime,
      primaryGoal,
      nudgeIntensity,
      subjects
    });
    setIsEditing(false);
    showToast('AI profile & preferences updated successfully!', 'success');
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;

    const newSub = {
      id: `sub-${Date.now()}`,
      name: newSubName,
      code: "NEW101",
      progress: 50,
      color: "text-primary",
      bg: "bg-primary/10",
      border: "border-primary",
      icon: "menu_book"
    };

    setSubjects([...subjects, newSub]);
    setNewSubName('');
    setIsAddingSub(false);
    showToast(`Added subject ${newSubName}`, 'success');
  };

  const handleRemoveSubject = (id) => {
    setSubjects(subjects.filter(s => s.id !== id));
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-8 space-y-8 pb-24">
      
      {/* Profile Top Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-outline-variant/30 shadow-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          <div className="relative group shrink-0">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full ring-4 ring-primary/20 overflow-hidden shadow-md">
              <img src={user.avatarUrl} alt={user.displayName} className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center ring-2 ring-white shadow-xs" title="Verified Scholar">
              <span className="material-symbols-outlined text-[18px]">verified</span>
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold font-headline-md text-on-surface">
                {user.displayName}
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="self-center sm:self-auto px-5 py-2 rounded-full bg-surface hover:bg-surface-container-high text-xs font-bold font-label-bold text-on-surface border border-outline-variant/30 flex items-center gap-2 transition-colors shadow-xs"
              >
                <span className="material-symbols-outlined text-[16px]">{isEditing ? 'close' : 'edit'}</span>
                <span>{isEditing ? 'Cancel Edit' : 'Edit Profile'}</span>
              </button>
            </div>

            <p className="text-sm sm:text-base text-primary font-semibold font-body-md">
              {user.role}
            </p>
            <p className="text-xs sm:text-sm text-on-surface-variant flex items-center justify-center sm:justify-start gap-1.5">
              <span className="material-symbols-outlined text-[18px]">school</span>
              <span>{user.university}</span>
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2.5 pt-3">
              <span className="px-3.5 py-1.5 bg-surface-container-high rounded-full text-xs font-bold text-on-surface">
                GPA: {user.gpa} / {user.targetGpa} Target
              </span>
              <span className="px-3.5 py-1.5 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold">
                {user.streakDays} Day Streak
              </span>
              {user.isPremium ? (
                <span className="px-3.5 py-1.5 bg-amber-100 text-amber-900 rounded-full text-xs font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">workspace_premium</span> Pro Member
                </span>
              ) : (
                <button
                  onClick={onOpenUpgrade}
                  className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-primary text-white rounded-full text-xs font-bold hover:opacity-90 transition-opacity flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[15px]">workspace_premium</span> Upgrade to Pro
                </button>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* AI Personalization Engine Tuning Meter */}
      <div className="bg-gradient-to-br from-primary-container to-secondary rounded-3xl p-6 sm:p-8 text-white shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-sm shrink-0">
              <span className="material-symbols-outlined text-[26px]">smart_toy</span>
            </div>
            <div>
              <h3 className="text-lg font-bold font-headline-sm">StudySync Engine</h3>
              <p className="text-xs text-white/80">AI Learning Profile: {user.aiTuningScore}% Tuned</p>
            </div>
          </div>
          <span className="text-2xl font-extrabold font-display-lg bg-white/20 px-4 py-1.5 rounded-2xl backdrop-blur-sm">
            {user.aiTuningScore}%
          </span>
        </div>

        <p className="text-xs sm:text-sm text-white/95 leading-relaxed">
          Your adaptive model continuously learns from your quiz response speeds, morning focus concentration levels, and syllabus completion velocity to eliminate burnout.
        </p>

        <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
          <div className="h-full bg-tertiary-fixed rounded-full" style={{ width: `${user.aiTuningScore}%` }} />
        </div>
      </div>

      {/* Settings / Preferences Form */}
      <form onSubmit={handleSaveProfile} className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-6">
        <h3 className="text-lg font-bold font-headline-sm text-on-surface flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
          AI Study Preferences & Calibration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          
          <div>
            <label className="block text-xs font-bold font-label-bold text-on-surface mb-1.5">
              Peak Focus Time (Heavy tasks scheduled here)
            </label>
            <select
              disabled={!isEditing}
              value={peakFocusTime}
              onChange={(e) => setPeakFocusTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-80"
            >
              <option value="Morning (8:00 AM - 11:30 AM)">Morning (8:00 AM - 11:30 AM)</option>
              <option value="Afternoon (1:00 PM - 4:30 PM)">Afternoon (1:00 PM - 4:30 PM)</option>
              <option value="Evening (6:00 PM - 9:30 PM)">Evening (6:00 PM - 9:30 PM)</option>
              <option value="Night Owl (10:00 PM - 1:00 AM)">Night Owl (10:00 PM - 1:00 AM)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold font-label-bold text-on-surface mb-1.5">
              Primary Academic Goal
            </label>
            <input
              type="text"
              disabled={!isEditing}
              value={primaryGoal}
              onChange={(e) => setPrimaryGoal(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-80"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-label-bold text-on-surface mb-1.5">
              AI Nudge Intensity
            </label>
            <select
              disabled={!isEditing}
              value={nudgeIntensity}
              onChange={(e) => setNudgeIntensity(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary disabled:opacity-80"
            >
              <option value="Gentle">Gentle (1 reminder before sessions)</option>
              <option value="Balanced">Balanced (Optimal spaced alerts)</option>
              <option value="Disciplined">Disciplined (Strict exam countdowns)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold font-label-bold text-on-surface mb-1.5">
              Study Reminders
            </label>
            <div className="flex items-center justify-between h-12 px-4 bg-surface-container-low rounded-xl border border-outline-variant/40">
              <span className="text-xs sm:text-sm text-on-surface">15 mins before sessions</span>
              <input
                type="checkbox"
                disabled={!isEditing}
                checked={remindersEnabled}
                onChange={(e) => setRemindersEnabled(e.target.checked)}
                className="w-5 h-5 text-primary rounded focus:ring-primary"
              />
            </div>
          </div>

        </div>

        {isEditing && (
          <div className="pt-3 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-primary text-white text-xs font-bold font-label-bold hover:bg-primary-container shadow-md transition-all active:scale-95"
            >
              Save Profile Changes
            </button>
          </div>
        )}
      </form>

      {/* Active Subjects Manager */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-headline-sm text-on-surface">Active Subjects & Courses</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant mt-0.5">Courses actively tracked in your AI study algorithm</p>
          </div>
          <button
            onClick={() => setIsAddingSub(!isAddingSub)}
            className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Subject</span>
          </button>
        </div>

        {isAddingSub && (
          <div className="flex gap-2.5 p-4 bg-surface-container-low rounded-2xl border border-outline-variant/30 animate-fadeIn">
            <input
              type="text"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              placeholder="Course name (e.g. Organic Chemistry)"
              className="flex-1 px-4 py-2.5 rounded-xl bg-surface border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
            <button onClick={handleAddSubject} className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold shadow-xs">Save</button>
            <button onClick={() => setIsAddingSub(false)} className="px-4 py-2.5 text-xs text-outline hover:text-on-surface">Cancel</button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl border border-outline-variant/30 bg-surface-container-low/40 flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <div className={`w-12 h-12 rounded-2xl ${sub.bg} ${sub.color} flex items-center justify-center shrink-0`}>
                  <span className="material-symbols-outlined text-[24px]">{sub.icon || 'menu_book'}</span>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">{sub.name}</h4>
                  <span className="text-xs text-on-surface-variant font-medium">Mastery: {sub.progress}%</span>
                </div>
              </div>

              {isEditing && (
                <button
                  onClick={() => handleRemoveSubject(sub.id)}
                  className="w-8 h-8 rounded-full text-rose-500 hover:bg-rose-100 flex items-center justify-center transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Database & System Infrastructure Card */}
      <div className="bg-surface rounded-3xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">database</span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold font-headline-sm text-on-surface">Database & Backend Engine</h3>
              <p className="text-xs text-on-surface-variant">Python FastAPI 0.115 + Motor Async MongoDB Engine</p>
            </div>
          </div>
          <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 text-xs font-bold rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Active Sync
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">Backend Framework</span>
            <span className="text-xs sm:text-sm font-bold text-on-surface mt-1 block">FastAPI (Python 3.13)</span>
          </div>
          <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">Database Cluster</span>
            <span className="text-xs sm:text-sm font-bold text-on-surface mt-1 block">MongoDB Atlas Cluster0</span>
          </div>
          <div className="p-3.5 bg-surface-container-low rounded-2xl border border-outline-variant/30">
            <span className="text-[11px] font-semibold text-on-surface-variant uppercase tracking-wider block">Configuration File</span>
            <span className="text-xs sm:text-sm font-bold text-primary mt-1 block font-mono">.tmb</span>
          </div>
        </div>
      </div>

    </div>
  );
}
