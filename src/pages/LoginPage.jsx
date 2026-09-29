import React, { useState } from 'react';
import { api, authStorage } from '../api';

export default function LoginPage({ onLoginSuccess, onSwitchToSignup, onNavigateHome }) {
  const [email, setEmail] = useState('khushi@studysync.ai');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await api.login({ email, password });
      if (res.token) {
        authStorage.setToken(res.token);
      }
      onLoginSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
    setIsLoading(true);

    api.login({ email: demoEmail, password: demoPass })
      .then((res) => {
        if (res.token) authStorage.setToken(res.token);
        onLoginSuccess(res.user);
      })
      .catch((err) => {
        setError(err.message || 'Login failed.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-primary/15 via-secondary/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-tertiary/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-surface/85 backdrop-blur-2xl border border-outline-variant/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        
        {/* Top Header Badge */}
        <div className="flex flex-col items-center text-center mb-8">
          <div 
            onClick={onNavigateHome}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform mb-4"
          >
            <span className="material-symbols-outlined text-white text-[32px]">auto_awesome</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-headline-sm text-on-surface tracking-tight">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1.5 max-w-xs">
            Sign in to sync your adaptive study plans, AI tutor notes, and subject vault.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-2.5 text-error text-xs sm:text-sm animate-fadeIn">
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Email Address
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                mail
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-11 pr-4 py-3 bg-surface-container/60 hover:bg-surface-container border border-outline-variant/40 focus:border-primary focus:bg-surface rounded-2xl text-xs sm:text-sm text-on-surface transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert("Password reset link sent to your registered email.")}
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[20px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-11 pr-11 py-3 bg-surface-container/60 hover:bg-surface-container border border-outline-variant/40 focus:border-primary focus:bg-surface rounded-2xl text-xs sm:text-sm text-on-surface transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 mt-2 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <>
                <span>Sign In to StudySync</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Logins */}
        <div className="mt-8 pt-6 border-t border-outline-variant/30">
          <span className="text-[11px] font-bold uppercase tracking-wider text-on-surface-variant block mb-3 text-center">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('khushi@studysync.ai', 'password123')}
              className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Alex Chen (Demo)</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('student@studysync.ai', 'password123')}
              className="px-3 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-xs font-semibold text-on-surface flex items-center justify-center gap-1.5 transition-colors active:scale-95"
            >
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Pre-Med Scholar</span>
            </button>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="mt-6 text-center text-xs text-on-surface-variant">
          Don't have an account yet?{' '}
          <button
            onClick={onSwitchToSignup}
            className="font-bold text-primary hover:underline ml-1"
          >
            Create an Account
          </button>
        </div>

      </div>
    </div>
  );
}
