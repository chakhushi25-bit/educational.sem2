import React, { useState } from 'react';

export default function Header({ 
  currentTab, 
  setCurrentTab, 
  user, 
  streakDays, 
  openTimer, 
  notifications, 
  onNotificationClick,
  onLogout,
  onOpenLogin,
  isLoggedIn = true,
}) {
  const [showNotificationsMenu, setShowNotificationsMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const unreadCount = (notifications || []).filter(n => !n.read).length;

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-40 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 shadow-[0_1px_12px_rgba(0,0,0,0.03)] transition-all">
      <div className="w-full px-4 sm:px-8 xl:px-12 h-16 flex items-center justify-between">
        
        {/* Brand Logo & Name */}
        <div 
          onClick={() => setCurrentTab('home')}
          className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform shrink-0">
            <span className="material-symbols-outlined text-white text-[22px]">auto_awesome</span>
          </div>
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5 leading-none">
              <span className="text-on-surface font-display-lg text-lg font-bold tracking-tight">
                StudySync <span className="text-primary">AI</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed">
                2.0
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant font-medium hidden sm:block mt-0.5">
              Intelligent Academic Planner
            </span>
          </div>
        </div>

        {/* Center Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 bg-surface-container/70 px-2 py-1 rounded-full border border-outline-variant/30 shadow-inner">
          {[
            { id: 'home', label: 'Home', icon: 'home' },
            { id: 'dashboard', label: 'Planner', icon: 'event_note' },
            { id: 'study_plan', label: 'Study Plans', icon: 'map' },
            { id: 'assistant', label: 'AI Tutor', icon: 'smart_toy' },
            { id: 'documents', label: 'Subject Vault (RAG)', icon: 'folder_open' },
            { id: 'analytics', label: 'Analytics', icon: 'insights' },
            { id: 'history', label: 'History', icon: 'history' },
            { id: 'about', label: 'About', icon: 'info' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                currentTab === item.id 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          
          {/* Streak Counter */}
          <div 
            onClick={() => setCurrentTab('analytics')}
            title={`${streakDays} Day Study Streak`}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-600 rounded-full cursor-pointer hover:bg-amber-500/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px] text-amber-500">local_fire_department</span>
            <span className="text-xs font-bold font-label-bold">{streakDays}d</span>
          </div>

          {/* Focus Timer Button */}
          <button
            onClick={openTimer}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface rounded-full text-xs font-semibold border border-outline-variant/30 transition-all active:scale-95"
            title="Open Pomodoro / Focus Timer"
          >
            <span className="material-symbols-outlined text-primary text-[16px]">timer</span>
            <span>Focus Mode</span>
          </button>

          {/* Pro Pill */}
          {!user.isPremium && (
            <button
              onClick={() => setCurrentTab('premium')}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-primary text-white rounded-full text-xs font-bold shadow-sm hover:opacity-95 transition-all"
            >
              <span className="material-symbols-outlined text-[15px]">workspace_premium</span>
              <span>Pro</span>
            </button>
          )}

          {/* Notifications Trigger */}
          <div className="relative">
            <button 
              onClick={() => setShowNotificationsMenu(!showNotificationsMenu)}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container text-on-surface-variant transition-colors relative"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-[22px]">notifications</span>
              {unreadCount > 0 && (
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-surface animate-pulse" />
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 p-3 z-50 animate-fadeIn">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-outline-variant/20 px-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-on-surface font-headline-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <span className="px-2 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-on-surface-variant cursor-pointer hover:text-primary">
                    Mark all read
                  </span>
                </div>

                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {(notifications || []).map((notif) => (
                    <div 
                      key={notif.id}
                      onClick={() => {
                        onNotificationClick(notif.id);
                        if (notif.actionTab) setCurrentTab(notif.actionTab);
                        setShowNotificationsMenu(false);
                      }}
                      className={`p-2.5 rounded-xl cursor-pointer transition-colors flex items-start gap-3 ${
                        notif.read ? 'hover:bg-surface-container-low' : 'bg-primary-fixed/30 hover:bg-primary-fixed/50'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">{notif.icon || 'notifications'}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-on-surface">{notif.title}</p>
                        <p className="text-[11px] text-on-surface-variant line-clamp-2 mt-0.5">{notif.body}</p>
                        <span className="text-[10px] text-outline mt-1 block">{notif.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile / Auth Menu */}
          {isLoggedIn ? (
            <div className="relative">
              <div 
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 cursor-pointer group pl-1"
                title="Account Menu"
              >
                <div className="w-9 h-9 rounded-full ring-2 ring-primary/20 group-hover:ring-primary overflow-hidden transition-all shrink-0">
                  <img 
                    src={user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"} 
                    alt={user.displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-surface rounded-2xl shadow-2xl border border-outline-variant/30 p-2 z-50 animate-fadeIn space-y-1 text-xs">
                  <div className="px-3 py-2 border-b border-outline-variant/20 mb-1">
                    <p className="font-bold text-on-surface text-sm">{user.displayName}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{user.email || 'khushi@studysync.ai'}</p>
                  </div>

                  <button
                    onClick={() => {
                      setCurrentTab('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-primary">person</span>
                    <span>Profile & Preferences</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab('documents');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-secondary">folder_open</span>
                    <span>Subject Vault (RAG)</span>
                  </button>

                  <button
                    onClick={() => {
                      setCurrentTab('premium');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px] text-amber-500">workspace_premium</span>
                    <span>Upgrade Plan</span>
                  </button>

                  <div className="border-t border-outline-variant/20 my-1 pt-1" />

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-error hover:bg-error/10 transition-colors font-medium"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={onOpenLogin}
              className="px-4 py-2 rounded-full bg-primary text-white text-xs font-bold shadow-md hover:bg-primary-container transition-all"
            >
              Sign In
            </button>
          )}

        </div>
      </div>
    </header>
  );
}
