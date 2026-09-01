import React, { useEffect, useState } from 'react';
import { initialHistory } from '../data/mockData';

export default function HistoryPage({ onStartRevision, history }) {
  const [filter, setFilter] = useState('all'); // all, completed, missed, rescheduled, quiz
  const [searchQuery, setSearchQuery] = useState('');
  const [historyList, setHistoryList] = useState(history?.length ? history : initialHistory);

  useEffect(() => {
    if (history?.length) setHistoryList(history);
  }, [history]);

  const filteredHistory = historyList.filter(item => {
    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'quiz' ? item.category === 'quiz' :
      item.status === filter;

    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  // Group by date
  const groups = filteredHistory.reduce((acc, item) => {
    const key = item.dateGroup || 'Earlier';
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 xl:px-12 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-4xl font-extrabold font-headline-md text-on-surface">
            Learning History & Logs
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1">
            Review past study blocks, completed quizzes, and auto-rescheduled events.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-primary bg-primary/10 px-4 py-2 rounded-full">
            {filteredHistory.length} Sessions Logged
          </span>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search study history by topic, subject, or notes..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-surface border border-outline-variant/30 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary shadow-xs"
          />
          <span className="material-symbols-outlined absolute left-4 top-3.5 text-outline text-[22px]">
            search
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 hide-scrollbar">
          {[
            { id: 'all', label: 'All History' },
            { id: 'completed', label: 'Completed' },
            { id: 'missed', label: 'Missed' },
            { id: 'rescheduled', label: 'Rescheduled' },
            { id: 'quiz', label: 'Quizzes' }
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => setFilter(pill.id)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold font-label-bold shrink-0 transition-all ${
                filter === pill.id
                  ? 'bg-primary text-white shadow-xs'
                  : 'bg-surface hover:bg-surface-container text-on-surface-variant border border-outline-variant/30'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* History Items Grouped */}
      <div className="space-y-8">
        {Object.keys(groups).length === 0 ? (
          <div className="text-center py-16 bg-surface rounded-3xl border border-outline-variant/20">
            <span className="material-symbols-outlined text-[48px] text-outline mb-3">history</span>
            <p className="text-base font-semibold text-on-surface">No sessions found</p>
            <p className="text-xs text-on-surface-variant mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          Object.entries(groups).map(([dateLabel, items]) => (
            <div key={dateLabel} className="space-y-3.5">
              <h3 className="text-xs font-bold font-label-bold uppercase tracking-wider text-on-surface-variant px-1">
                {dateLabel}
              </h3>

              <div className="space-y-3.5">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-surface rounded-2xl p-5 sm:p-6 border border-outline-variant/30 shadow-xs hover:border-primary/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                        item.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'missed'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        <span className="material-symbols-outlined text-[24px]">
                          {item.category === 'quiz' ? 'quiz' : item.subject.toLowerCase().includes('chem') ? 'science' : item.subject.toLowerCase().includes('span') ? 'translate' : 'menu_book'}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-bold text-primary">
                            {item.subject}
                          </span>
                          <span className="text-xs text-outline">
                            • {item.time}
                          </span>
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            item.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : item.status === 'missed'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}>
                            {item.status}
                          </span>
                          {item.score && (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-primary-fixed text-on-primary-fixed">
                              Score: {item.score}
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-bold text-on-surface mt-1">
                          {item.title}
                        </h4>
                        {item.notes && (
                          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 leading-relaxed">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <span className="text-xs text-on-surface-variant flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[16px]">timer</span>
                        {item.duration}
                      </span>
                      {item.status === 'missed' && (
                        <button
                          onClick={() => onStartRevision ? onStartRevision(item) : null}
                          className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 transition-colors shadow-xs"
                        >
                          Catch Up
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
