import React from 'react';

export default function BottomNav({ currentTab, setCurrentTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Planner', icon: 'event_note' },
    { id: 'study_plan', label: 'Plans', icon: 'map' },
    { id: 'assistant', label: 'AI Tutor', icon: 'smart_toy', isSpecial: true },
    { id: 'documents', label: 'Vault', icon: 'folder_open' },
    { id: 'profile', label: 'Profile', icon: 'person' }
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl border-t border-outline-variant/30 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] lg:hidden">
      <div className="flex justify-between items-center h-16 px-3 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;

          if (item.isSpecial) {
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className="flex-1 flex flex-col items-center justify-center -mt-5 group"
                aria-label="AI Assistant"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-90 ${
                  isActive 
                    ? 'bg-primary-container ring-4 ring-primary/20 scale-105' 
                    : 'bg-primary text-white hover:scale-105'
                }`}>
                  <span className="material-symbols-outlined text-white text-[24px]">smart_toy</span>
                </div>
                <span className={`text-[11px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-on-surface-variant'
                }`}>
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-1 transition-all ${
                isActive 
                  ? 'text-primary font-bold scale-105' 
                  : 'text-on-surface-variant hover:text-primary opacity-80'
              }`}
            >
              <span className={`material-symbols-outlined text-[20px] ${isActive ? 'filled' : ''}`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium font-label-md">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
