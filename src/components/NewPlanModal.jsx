import React, { useState } from 'react';

export default function NewPlanModal({ isOpen, onClose, onPlanCreated }) {
  const [subject, setSubject] = useState('Organic Chemistry');
  const [examName, setExamName] = useState('Midterm Examination');
  const [targetDate, setTargetDate] = useState('2026-10-15');
  const [dailyHours, setDailyHours] = useState('3');
  const [difficulty, setDifficulty] = useState('Advanced');
  const [syllabusTopics, setSyllabusTopics] = useState(
    'Alkanes & Cycloalkanes, Stereochemistry, Nucleophilic Substitution (SN1/SN2), Elimination Reactions (E1/E2), Infrared Spectroscopy'
  );
  const [isGenerating, setIsGenerating] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = (e) => {
    e.preventDefault();
    setIsGenerating(true);

    setTimeout(() => {
      setIsGenerating(false);
      const newPlan = {
        goalTitle: `${subject} - ${examName}`,
        targetExam: `Exam scheduled in 30 Days`,
        daysRemaining: 30,
        totalTopics: syllabusTopics.split(',').length * 4,
        completedTopics: 0,
        quizzesScheduled: 12,
        dailyCommitmentHours: parseFloat(dailyHours),
        weeks: [
          {
            weekNumber: 1,
            isCurrent: true,
            title: "Core Mechanics & Molecular Foundations",
            days: [
              {
                dayName: "Day 1 (Tomorrow)",
                items: [
                  { id: `gen-${Date.now()}-1`, time: "9:00 AM - 10:30 AM", title: "Molecular Orbitals & Resonance", type: "Theory", subject: subject, duration: "60m", description: "Lewis structures, formal charge distribution, and stability.", completed: false },
                  { id: `gen-${Date.now()}-2`, time: "11:00 AM - 12:00 PM", title: "Stereocenter Configurations (R/S)", type: "Practice", subject: subject, duration: "45m", description: "15 practice problems with Fischer projections.", completed: false }
                ]
              },
              {
                dayName: "Day 2",
                items: [
                  { id: `gen-${Date.now()}-3`, time: "9:00 AM - 10:30 AM", title: "SN1 vs SN2 Reaction Mechanisms", type: "Theory", subject: subject, duration: "60m", description: "Substrate steric hindrance, nucleophile strength, and solvent effects.", completed: false }
                ]
              }
            ]
          }
        ]
      };
      onPlanCreated(newPlan);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/40 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-outline-variant/30 relative overflow-hidden max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[26px]">auto_awesome</span>
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline-md text-on-surface">
              Generate AI Study Plan
            </h2>
            <p className="text-xs text-on-surface-variant">
              StudySync AI synthesizes your syllabus into an adaptive mastery roadmap.
            </p>
          </div>
        </div>

        <form onSubmit={handleGenerate} className="space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
                Subject / Course Name
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
                placeholder="e.g. Organic Chemistry"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
                Target Milestone
              </label>
              <input
                type="text"
                required
                value={examName}
                onChange={(e) => setExamName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
                placeholder="e.g. Finals or Midterms"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
                Exam Date
              </label>
              <input
                type="date"
                required
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
                Hours / Day
              </label>
              <select
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="1.5">1.5 hrs</option>
                <option value="2.5">2.5 hrs</option>
                <option value="3">3.0 hrs</option>
                <option value="4">4.0 hrs</option>
                <option value="5">5.0 hrs</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
                Target Rigor
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
              >
                <option value="Standard">Standard Pass</option>
                <option value="Advanced">High Distinction (A)</option>
                <option value="Mastery">Top 1% Percentile</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold font-label-bold text-on-surface">
                Syllabus Topics or Chapters
              </label>
              <span className="text-[11px] text-primary cursor-pointer hover:underline">
                Paste syllabus text
              </span>
            </div>
            <textarea
              rows={3}
              required
              value={syllabusTopics}
              onChange={(e) => setSyllabusTopics(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary resize-none"
              placeholder="Enter topics separated by commas..."
            />
          </div>

          {/* AI Features Checklist */}
          <div className="bg-primary-fixed/40 p-3.5 rounded-2xl border border-primary/20 space-y-2">
            <div className="flex items-center gap-2 text-xs text-on-primary-fixed font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              <span>Spaced repetition algorithm calibrated to target exam date</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-primary-fixed font-medium">
              <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
              <span>Automatic rest day balancing & catch-up buffer blocks</span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isGenerating}
            className="w-full py-3 px-6 rounded-full bg-primary hover:bg-primary-container text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/25 transition-all active:scale-98 disabled:opacity-75"
          >
            {isGenerating ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Synthesizing AI Roadmap...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">bolt</span>
                <span>Generate Adaptive Study Plan</span>
              </>
            )}
          </button>

        </form>
      </div>
    </div>
  );
}
