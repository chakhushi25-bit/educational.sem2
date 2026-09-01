import React from 'react';

export default function AboutPage({ setCurrentTab }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-8 space-y-12 pb-24">
      
      {/* Hero / Mission */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 px-4 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold font-label-bold">
          <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
          <span>Our Story & Mission</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold font-display-lg text-on-surface tracking-tight">
          Making studying deeply personal.
        </h1>
        <p className="text-xs sm:text-base text-on-surface-variant font-body-lg leading-relaxed">
          We believe education should never be one-size-fits-all. Every learner has a unique biological rhythm, retention speed, and lifestyle. StudySync AI was born to bring sanity, science, and structure back to academia.
        </p>
      </div>

      {/* The Student Dilemma vs StudySync Solution */}
      <div className="bg-surface rounded-3xl p-6 sm:p-10 border border-outline-variant/30 shadow-sm space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold font-headline-sm text-on-surface">
            From chaos to clarity
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Why traditional calendars fail modern university and high school students.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { title: "Piling Subjects", icon: "menu_book", desc: "Multiple conflicting deadlines", color: "text-amber-500 bg-amber-50" },
            { title: "Time Crunch", icon: "schedule", desc: "Clashing lectures & commitments", color: "text-blue-500 bg-blue-50" },
            { title: "Looming Exams", icon: "assignment_late", desc: "Anxiety from unstructured cramming", color: "text-rose-500 bg-rose-50" },
            { title: "Academic Burnout", icon: "sentiment_very_dissatisfied", desc: "Guilt from unrealistic study plans", color: "text-purple-500 bg-purple-50" }
          ].map((item, i) => (
            <div key={i} className="p-5 rounded-2xl bg-surface-container-low border border-outline-variant/20 text-center space-y-2.5">
              <div className={`w-12 h-12 mx-auto rounded-xl ${item.color} flex items-center justify-center shrink-0`}>
                <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
              </div>
              <h4 className="text-sm font-bold text-on-surface">{item.title}</h4>
              <p className="text-xs text-on-surface-variant">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* AI Transformation Banner */}
        <div className="bg-gradient-to-r from-primary to-primary-container p-8 rounded-2xl text-white text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-[24px]">psychology</span>
          </div>
          <h3 className="text-lg font-bold font-headline-sm">StudySync AI Synthesis</h3>
          <p className="text-xs sm:text-sm text-white/95 max-w-xl mx-auto leading-relaxed">
            Our neural planner continuously digests syllabus weightages, spaced recall intervals, and active study feedback to craft a realistic, self-healing study path.
          </p>
        </div>
      </div>

      {/* How the AI Works 3-Tier Architecture */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold font-headline-sm text-on-surface">
            How the AI Engine Works
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Three interconnected layers powering your academic success.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              step: "01",
              title: "Data Ingestion",
              desc: "Parses course syllabi, exam milestones, lecture notes, and student target grades into atomic concept nodes.",
              icon: "data_object",
              accent: "border-primary"
            },
            {
              step: "02",
              title: "Pattern Recognition",
              desc: "Models individual forgetting curves using Ebbinghaus retention mathematics to schedule quizzes at optimal recall windows.",
              icon: "hub",
              accent: "border-secondary"
            },
            {
              step: "03",
              title: "Dynamic Scheduling",
              desc: "Instantly reallocates remaining days when unexpected events occur, maintaining your target exam confidence score.",
              icon: "sync_alt",
              accent: "border-tertiary"
            }
          ].map((layer, idx) => (
            <div key={idx} className={`bg-surface p-6 sm:p-8 rounded-3xl border ${layer.accent} shadow-sm space-y-4`}>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-primary shrink-0">
                  <span className="material-symbols-outlined text-[24px]">{layer.icon}</span>
                </div>
                <span className="px-3 py-1 rounded-lg bg-surface-container-high text-xs font-bold text-primary font-display-lg">
                  Phase {layer.step}
                </span>
              </div>
              <h4 className="text-base font-bold font-headline-sm text-on-surface">{layer.title}</h4>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">{layer.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action CTA */}
      <div className="text-center pt-4">
        <button
          onClick={() => setCurrentTab('dashboard')}
          className="px-8 py-3.5 bg-primary text-white rounded-full text-xs font-bold font-label-bold shadow-lg shadow-primary/25 hover:bg-primary-container transition-all active:scale-95"
        >
          Explore Your Planner
        </button>
      </div>

    </div>
  );
}
