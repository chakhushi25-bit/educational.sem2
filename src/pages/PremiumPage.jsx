import React, { useState } from 'react';

export default function PremiumPage({ user, onOpenCheckout }) {
  const [billingCycle, setBillingCycle] = useState('yearly');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-10 space-y-10 pb-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold font-label-bold">
          <span className="material-symbols-outlined text-[16px]">workspace_premium</span>
          <span>StudySync Pro Tier</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display-lg text-on-surface tracking-tight">
          Upgrade your study experience.
        </h1>
        <p className="text-xs sm:text-base text-on-surface-variant font-body-lg max-w-2xl mx-auto leading-relaxed">
          Unlock adaptive AI-powered scheduling, unlimited practice quizzes, and cognitive retention tracking to master your subjects faster.
        </p>

        {/* Monthly / Yearly Switcher */}
        <div className="pt-4 flex justify-center">
          <div className="bg-surface-container-high p-1.5 rounded-full border border-outline-variant/30 flex items-center gap-1.5 shadow-inner">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold font-label-bold transition-all ${
                billingCycle === 'monthly'
                  ? 'bg-surface text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full text-xs font-bold font-label-bold flex items-center gap-1.5 transition-all ${
                billingCycle === 'yearly'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <span>Yearly</span>
              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-extrabold">
                Save 35%
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch">
        
        {/* Basic Tier */}
        <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-outline-variant/30 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold font-headline-sm text-on-surface">Basic</h3>
              <span className="text-xs font-bold text-on-surface-variant bg-surface-container px-3 py-1 rounded-full">
                Free Forever
              </span>
            </div>
            
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold font-display-lg text-on-surface">$0</span>
              <span className="text-xs text-on-surface-variant font-medium ml-1">/ month</span>
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Essential timetable tracking and standard daily study sessions.
            </p>

            <div className="space-y-3.5 pt-6 border-t border-outline-variant/20 text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                <span>1 Active AI Study Roadmap</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                <span>Basic Pomodoro Focus Timer</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface">
                <span className="material-symbols-outlined text-[20px] text-emerald-600">check_circle</span>
                <span>Up to 10 AI Assistant queries / day</span>
              </div>
              <div className="flex items-center gap-3 text-outline">
                <span className="material-symbols-outlined text-[20px] text-outline">block</span>
                <span>Smart dynamic auto-rescheduling</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              disabled={true}
              className="w-full py-3.5 rounded-full bg-surface-container text-on-surface-variant text-xs font-bold font-label-bold cursor-default"
            >
              {user.isPremium ? 'Standard Plan' : 'Current Plan'}
            </button>
          </div>
        </div>

        {/* Premium Pro Tier */}
        <div className="bg-surface rounded-3xl p-6 sm:p-10 border-2 border-primary shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 bg-primary text-white text-[10px] uppercase font-bold tracking-wider px-4 py-1.5 rounded-bl-2xl">
            Recommended
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-amber-500 text-[26px]">stars</span>
              <h3 className="text-xl font-bold font-headline-sm text-on-surface">StudySync Pro</h3>
            </div>

            <div>
              <span className="text-4xl sm:text-5xl font-extrabold font-display-lg text-primary">
                {billingCycle === 'yearly' ? '$9.99' : '$14.99'}
              </span>
              <span className="text-xs text-on-surface-variant font-medium ml-1">/ month</span>
              {billingCycle === 'yearly' && (
                <p className="text-xs text-emerald-600 font-bold mt-1">Billed annually ($119.88 / yr)</p>
              )}
            </div>

            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Designed for serious learners aiming for top 1% percentiles and high GPAs.
            </p>

            <div className="space-y-3.5 pt-6 border-t border-outline-variant/20 text-xs sm:text-sm">
              <div className="flex items-center gap-3 text-on-surface font-medium">
                <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
                <span>Unlimited AI Quizzes & Spaced Recall Decks</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface font-medium">
                <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
                <span>Autonomous Real-Time Dynamic Rescheduling</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface font-medium">
                <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
                <span>24/7 Unlimited Priority AI Tutor & Step Solver</span>
              </div>
              <div className="flex items-center gap-3 text-on-surface font-medium">
                <span className="material-symbols-outlined text-[20px] text-primary">check_circle</span>
                <span>Deep Cognitive Retention & Diagnostic Analytics</span>
              </div>
            </div>
          </div>

          <div className="pt-8">
            <button
              onClick={() => onOpenCheckout(billingCycle)}
              className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-white text-xs font-bold font-label-bold shadow-lg shadow-primary/25 hover:opacity-95 transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{user.isPremium ? 'Plan Active (Modify)' : 'Upgrade to Pro'}</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
