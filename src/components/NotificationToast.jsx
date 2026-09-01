import React from 'react';

export default function NotificationToast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 animate-slideUp">
      <div className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border backdrop-blur-lg ${
        toast.type === 'success'
          ? 'bg-emerald-950/90 text-white border-emerald-500/30'
          : toast.type === 'error'
          ? 'bg-rose-950/90 text-white border-rose-500/30'
          : 'bg-surface-container-highest/95 text-on-surface border-outline-variant/40'
      }`}>
        <span className="material-symbols-outlined text-[20px] text-primary-fixed">
          {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
        </span>
        <p className="text-xs font-medium">{toast.message}</p>
        <button onClick={onClose} className="opacity-70 hover:opacity-100 ml-2">
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
}
