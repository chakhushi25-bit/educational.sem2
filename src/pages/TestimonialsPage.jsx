import React, { useState } from 'react';
import { testimonialsList } from '../data/mockData';

export default function TestimonialsPage({ setCurrentTab }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredReviews = activeFilter === 'All' 
    ? testimonialsList 
    : testimonialsList.filter(t => t.major.toLowerCase().includes(activeFilter.toLowerCase()));

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-8 space-y-10 pb-24">
      
      {/* Header & Metrics */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-bold font-label-bold">
          <span className="material-symbols-outlined text-[16px]">sentiment_satisfied</span>
          <span>Success Stories</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display-lg text-on-surface tracking-tight">
          Loved by learners who study smarter.
        </h1>
        <p className="text-xs sm:text-base text-on-surface-variant font-body-lg max-w-2xl mx-auto">
          Join thousands of university and high school students who have conquered exam stress and reclaimed their free time with StudySync AI.
        </p>

        {/* Top 3 Impact Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-xs">
            <span className="text-3xl sm:text-4xl font-extrabold font-display-lg text-primary block">10K+</span>
            <span className="text-xs text-on-surface-variant font-medium mt-1">Study Plans Generated</span>
          </div>
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-xs">
            <span className="text-3xl sm:text-4xl font-extrabold font-display-lg text-emerald-600 block">85%</span>
            <span className="text-xs text-on-surface-variant font-medium mt-1">Higher Consistency</span>
          </div>
          <div className="bg-surface rounded-3xl p-6 border border-outline-variant/30 shadow-xs">
            <span className="text-3xl sm:text-4xl font-extrabold font-display-lg text-amber-500 flex items-center justify-center gap-1">
              4.8 <span className="material-symbols-outlined text-[24px]">star</span>
            </span>
            <span className="text-xs text-on-surface-variant font-medium mt-1">Student Rating</span>
          </div>
        </div>
      </div>

      {/* Testimonials List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredReviews.map((t) => (
          <div
            key={t.id}
            className="bg-surface rounded-3xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col justify-between space-y-4 hover:border-primary/40 transition-all"
          >
            <div className="space-y-3.5">
              
              {/* Stars & Metric Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-400">
                  {[...Array(t.rating)].map((_, idx) => (
                    <span key={idx} className="material-symbols-outlined text-[18px]">star</span>
                  ))}
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span> {t.metric}
                </span>
              </div>

              {/* Quote */}
              <p className="text-xs sm:text-sm text-on-surface leading-relaxed italic">
                "{t.text}"
              </p>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-3.5 pt-4 border-t border-outline-variant/20">
              <img src={t.avatar} alt={t.name} className="w-11 h-11 rounded-full object-cover ring-2 ring-primary/20" />
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-on-surface">{t.name}</h4>
                <p className="text-xs text-primary font-medium">{t.major}</p>
                <p className="text-[11px] text-outline">{t.university}</p>
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* CTA Box */}
      <div className="bg-surface-container rounded-3xl p-8 text-center border border-outline-variant/30 space-y-3">
        <h3 className="text-xl font-bold font-headline-sm text-on-surface">
          Ready to experience stress-free learning?
        </h3>
        <p className="text-xs sm:text-sm text-on-surface-variant max-w-lg mx-auto">
          Create your personalized study plan in under 60 seconds with StudySync AI.
        </p>
        <div className="pt-2">
          <button
            onClick={() => setCurrentTab('study_plan')}
            className="px-8 py-3 bg-primary text-white rounded-full text-xs font-bold font-label-bold hover:bg-primary-container transition-all active:scale-95 shadow-sm"
          >
            Start Free Plan
          </button>
        </div>
      </div>

    </div>
  );
}
