import React, { useState } from 'react';

export default function HomePage({ setCurrentTab, onOpenNewPlanModal }) {
  const [demoExam, setDemoExam] = useState('Biology Finals');
  const [demoDays, setDemoDays] = useState(35);
  const [demoHours, setDemoHours] = useState(3);

  return (
    <div className="flex flex-col w-full pb-20">
      
      {/* Hero Section */}
      <section className="relative w-full px-4 sm:px-8 xl:px-12 pt-8 pb-16 sm:pb-24 flex flex-col items-center justify-center text-center">
        
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-surface-container-high border border-outline-variant/30 rounded-full mb-6 shadow-sm">
            <span className="material-symbols-outlined text-primary text-[18px]">auto_awesome</span>
            <span className="text-xs font-bold font-label-bold text-on-surface-variant">
              StudySync AI 2.0 Engine is live
            </span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display-lg text-on-surface tracking-tight leading-tight mb-6">
            Study smarter.<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-container to-secondary">
              Stay on track.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl font-body-lg text-on-surface-variant mb-8 max-w-3xl leading-relaxed">
            Stop guessing what to study next. Our AI analyzes your goals, syllabus, and deadlines to craft the perfect, adaptable study roadmap that flexes with real life.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 w-full sm:w-auto">
            <button
              onClick={() => onOpenNewPlanModal ? onOpenNewPlanModal() : setCurrentTab('study_plan')}
              className="px-8 py-3.5 bg-primary text-on-primary rounded-full text-xs font-bold font-label-bold shadow-lg shadow-primary/25 hover:bg-primary-container transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Create My Study Plan</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="px-8 py-3.5 bg-secondary-fixed text-on-secondary-fixed rounded-full text-xs font-bold font-label-bold hover:bg-secondary-fixed-dim transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">dashboard</span>
              <span>Open Planner Dashboard</span>
            </button>
          </div>

          {/* University Credibility */}
          <div className="mt-14 text-center w-full">
            <p className="text-xs font-semibold font-label-md text-outline uppercase tracking-wider mb-4">
              Trusted by top students from
            </p>
            <div className="flex flex-wrap justify-center gap-6 sm:gap-12 items-center text-on-surface-variant">
              <span className="font-display-lg text-lg sm:text-xl font-extrabold tracking-tighter">STANFORD</span>
              <span className="font-display-lg text-lg sm:text-xl font-extrabold tracking-tight">MIT</span>
              <span className="font-display-lg text-lg sm:text-xl font-extrabold tracking-widest">OXFORD</span>
              <span className="font-display-lg text-lg sm:text-xl font-extrabold tracking-wider">HARVARD</span>
              <span className="font-display-lg text-lg sm:text-xl font-extrabold tracking-tight">UC BERKELEY</span>
            </div>
          </div>

        </div>
      </section>

      {/* Interactive Demo Generator Preview */}
      <section className="px-4 sm:px-8 xl:px-12 py-6 max-w-7xl mx-auto w-full">
        <div className="bg-surface rounded-3xl shadow-xl border border-outline-variant/30 p-6 sm:p-10 relative overflow-hidden transition-all">
          <div className="flex flex-col lg:flex-row gap-8 items-center">
            
            {/* Input / Config Box */}
            <div className="flex-1 w-full space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-bold font-headline-sm text-on-surface">
                  Your Next Big Exam
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-primary/10 text-primary font-bold">
                  Interactive Simulator
                </span>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">calendar_clock</span>
                  </div>
                  <div>
                    <input 
                      type="text" 
                      value={demoExam}
                      onChange={(e) => setDemoExam(e.target.value)}
                      className="text-xs sm:text-sm font-bold text-on-surface bg-transparent focus:outline-none"
                    />
                    <p className="text-[11px] text-on-surface-variant">Starts in {demoDays} days</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setDemoDays(Math.max(7, demoDays - 5))} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface hover:bg-surface-container-high">-</button>
                  <span className="text-xs font-bold px-2">{demoDays}d</span>
                  <button onClick={() => setDemoDays(demoDays + 5)} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface hover:bg-surface-container-high">+</button>
                </div>
              </div>

              <div className="bg-surface-container-low p-4 rounded-2xl flex items-center justify-between border border-outline-variant/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[22px]">schedule</span>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-on-surface">Daily Commitment</p>
                    <p className="text-[11px] text-on-surface-variant">{demoHours} hours scheduled daily</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setDemoHours(Math.max(1, demoHours - 1))} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface hover:bg-surface-container-high">-</button>
                  <span className="text-xs font-bold px-2">{demoHours}h</span>
                  <button onClick={() => setDemoHours(Math.min(8, demoHours + 1))} className="w-7 h-7 rounded-lg bg-surface-container flex items-center justify-center text-xs font-bold text-on-surface hover:bg-surface-container-high">+</button>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs text-on-surface-variant flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-emerald-600">verified</span>
                  AI recalculates daily pace based on target confidence score
                </p>
              </div>
            </div>

            {/* Connecting Arrow */}
            <div className="hidden lg:flex flex-col items-center justify-center px-2">
              <div className="w-12 h-12 rounded-full bg-primary-fixed flex items-center justify-center shadow-md">
                <span className="material-symbols-outlined text-primary text-[24px]">arrow_forward</span>
              </div>
            </div>

            {/* Output AI Card */}
            <div className="flex-1 w-full relative">
              <div className="bg-gradient-to-br from-primary via-primary-container to-secondary p-6 sm:p-8 rounded-2xl text-white shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-tertiary-fixed text-[20px]">auto_awesome</span>
                  <h4 className="text-base font-bold font-headline-sm">Personalized Plan Generated</h4>
                </div>

                <div className="space-y-3">
                  <div className="bg-white/15 p-3.5 rounded-xl flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-tertiary-fixed shrink-0"></span>
                      <span className="text-xs font-semibold">Cell Division & Mitosis Review</span>
                    </div>
                    <span className="text-xs font-bold opacity-90">45m</span>
                  </div>

                  <div className="bg-white/15 p-3.5 rounded-xl flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-secondary-fixed shrink-0"></span>
                      <span className="text-xs font-semibold">Genetics & Pedigree Practice</span>
                    </div>
                    <span className="text-xs font-bold opacity-90">1h 15m</span>
                  </div>

                  <div className="bg-white/15 p-3.5 rounded-xl flex items-center justify-between backdrop-blur-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 shrink-0"></span>
                      <span className="text-xs font-semibold">Active Recall Mini-Quiz</span>
                    </div>
                    <span className="text-xs font-bold opacity-90">20m</span>
                  </div>
                </div>

                <button 
                  onClick={() => setCurrentTab('study_plan')}
                  className="w-full mt-5 py-3 bg-white text-primary rounded-xl text-xs font-bold font-label-bold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Explore Full Curriculum View</span>
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section className="px-4 sm:px-8 xl:px-12 py-12 max-w-7xl mx-auto w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold font-headline-md text-on-surface mb-3">
            Everything you need to ace your semester
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-2xl mx-auto leading-relaxed">
            Traditional calendars are static. StudySync AI is alive, adapting to missed days, tough chapters, and changing priorities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              title: "Personalized AI Plans",
              desc: "Upload or type your syllabus to create daily breakdown milestones customized to your learning speed.",
              icon: "psychology",
              color: "text-primary",
              bg: "bg-primary/10"
            },
            {
              title: "Smart Prioritization",
              desc: "Identifies heavy exam weightages and prioritizes difficult topics during your peak morning focus hours.",
              icon: "trending_up",
              color: "text-secondary",
              bg: "bg-secondary/10"
            },
            {
              title: "Auto-Rescheduling",
              desc: "Missed a session? StudySync recalculates remaining slots without judgment or stressful cramming.",
              icon: "calendar_clock",
              color: "text-tertiary",
              bg: "bg-tertiary/10"
            },
            {
              title: "Intelligent Revision",
              desc: "Spaced repetition intervals and AI quizzes scheduled automatically before forgetting curves set in.",
              icon: "refresh",
              color: "text-emerald-600",
              bg: "bg-emerald-50"
            }
          ].map((feat, idx) => (
            <div 
              key={idx}
              className="bg-surface rounded-2xl p-6 border border-outline-variant/30 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className={`w-12 h-12 rounded-xl ${feat.bg} ${feat.color} flex items-center justify-center mb-4 shrink-0`}>
                  <span className="material-symbols-outlined text-[24px]">{feat.icon}</span>
                </div>
                <h3 className="text-base font-bold font-headline-sm text-on-surface mb-2">
                  {feat.title}
                </h3>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3-Step Journey */}
      <section className="px-4 sm:px-8 xl:px-12 py-12 max-w-7xl mx-auto w-full">
        <div className="bg-surface-container-low/60 rounded-3xl p-6 sm:p-10 border border-outline-variant/20">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary uppercase tracking-wider">How it works</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold font-headline-md text-on-surface mt-1">
              From chaos to clarity in 3 steps
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: "01",
                title: "Tell Us Your Needs",
                desc: "Input your syllabus chapters, upcoming exam deadlines, and daily hours available.",
                icon: "upload_file"
              },
              {
                step: "02",
                title: "AI Creates Your Roadmap",
                desc: "Our engine optimizes theory vs practice distribution based on cognitive retention curves.",
                icon: "auto_fix_high"
              },
              {
                step: "03",
                title: "Study & Adapt Freely",
                desc: "Track completed items, chat with the 24/7 AI tutor, and watch your grades soar.",
                icon: "verified_user"
              }
            ].map((item, i) => (
              <div key={i} className="bg-surface p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary-container text-white flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-surface-container-high text-xs font-bold font-display-lg text-primary">
                      Step {item.step}
                    </span>
                  </div>
                  <h4 className="text-base font-bold font-headline-sm text-on-surface mb-2">{item.title}</h4>
                  <p className="text-xs text-on-surface-variant leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="px-4 sm:px-8 xl:px-12 pt-8 max-w-7xl mx-auto w-full">
        <div className="bg-gradient-to-r from-primary to-secondary p-8 sm:p-12 rounded-3xl text-white text-center shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-4xl font-extrabold font-display-lg">
              Ready to ace your semester?
            </h2>
            <p className="text-xs sm:text-sm text-white/90">
              Join thousands of top learners building calm, consistent study habits with StudySync AI.
            </p>
            <div className="pt-2 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setCurrentTab('dashboard')}
                className="px-8 py-3.5 bg-white text-primary rounded-full text-xs font-bold font-label-bold hover:bg-slate-100 shadow-md transition-all active:scale-95"
              >
                Go to Planner Dashboard
              </button>
              <button
                onClick={() => setCurrentTab('testimonials')}
                className="px-8 py-3.5 bg-white/20 text-white rounded-full text-xs font-bold font-label-bold hover:bg-white/30 backdrop-blur-sm transition-all"
              >
                Read Student Reviews
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
