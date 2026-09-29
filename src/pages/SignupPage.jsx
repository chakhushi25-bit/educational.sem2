import React, { useState } from 'react';
import { api, authStorage } from '../api';

export default function SignupPage({ onSignupSuccess, onSwitchToLogin, onNavigateHome }) {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [university, setUniversity] = useState('Stanford University');
  const [primaryGoal, setPrimaryGoal] = useState('Maintain 3.9+ GPA for Graduate School');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const calculateStrength = (pwd) => {
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 6) score += 25;
    if (pwd.length >= 10) score += 25;
    if (/[A-Z]/.test(pwd)) score += 25;
    if (/[0-9!@#$%^&*]/.test(pwd)) score += 25;
    return score;
  };

  const strength = calculateStrength(password);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!displayName || !email || !password) {
      setError('Please complete all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const res = await api.signup({
        displayName,
        email,
        password,
        university,
        primaryGoal,
        role: 'Undergraduate Scholar',
      });

      if (res.token) {
        authStorage.setToken(res.token);
      }
      onSignupSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Ambient background blur */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 via-tertiary/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />
      <div className="absolute -top-10 -right-10 w-72 h-72 bg-secondary/10 rounded-full blur-2xl pointer-events-none -z-10" />

      <div className="w-full max-w-lg bg-surface/85 backdrop-blur-2xl border border-outline-variant/40 rounded-3xl p-8 sm:p-10 shadow-2xl relative">
        
        {/* Top Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div 
            onClick={onNavigateHome}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary via-primary-container to-secondary flex items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform mb-3"
          >
            <span className="material-symbols-outlined text-white text-[32px]">school</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-headline-sm text-on-surface tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-1 max-w-sm">
            Join thousands of scholars automating study schedules, syllabus digestion, and exam prep.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-5 p-3.5 rounded-2xl bg-error/10 border border-error/20 flex items-start gap-2.5 text-error text-xs sm:text-sm animate-fadeIn">
            <span className="material-symbols-outlined text-[20px] shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Full Name *
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                  person
                </span>
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Khushi Sharma"
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-container/60 hover:bg-surface-container border border-outline-variant/40 focus:border-primary focus:bg-surface rounded-2xl text-xs sm:text-sm text-on-surface transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Email Address *
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                  mail
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@university.edu"
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-container/60 hover:bg-surface-container border border-outline-variant/40 focus:border-primary focus:bg-surface rounded-2xl text-xs sm:text-sm text-on-surface transition-all outline-none"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
              Password *
            </label>
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                lock
              </span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-10 py-2.5 bg-surface-container/60 hover:bg-surface-container border border-outline-variant/40 focus:border-primary focus:bg-surface rounded-2xl text-xs sm:text-sm text-on-surface transition-all outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-outline hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div className="mt-2 space-y-1">
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      strength < 50 ? 'bg-error w-1/3' : strength < 80 ? 'bg-amber-500 w-2/3' : 'bg-emerald-500 w-full'
                    }`}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-on-surface-variant">
                  <span>Strength</span>
                  <span className="font-bold">
                    {strength < 50 ? 'Weak' : strength < 80 ? 'Moderate' : 'Strong 🛡️'}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                University / School
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                  account_balance
                </span>
                <input
                  type="text"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  placeholder="e.g. Stanford University"
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-container/60 hover:bg-surface-container border border-outline-variant/40 focus:border-primary focus:bg-surface rounded-2xl text-xs sm:text-sm text-on-surface transition-all outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-1.5">
                Primary Goal
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3.5 text-outline text-[18px]">
                  flag
                </span>
                <select
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 bg-surface-container/60 hover:bg-surface-container border border-outline-variant/40 focus:border-primary focus:bg-surface rounded-2xl text-xs sm:text-sm text-on-surface transition-all outline-none"
                >
                  <option value="Maintain 3.9+ GPA for Graduate School">Maintain 3.9+ GPA</option>
                  <option value="Ace Final Semester Examinations">Ace Semester Finals</option>
                  <option value="Pre-Med & Medical Entrance Prep">Pre-Med & MCAT Prep</option>
                  <option value="STEM & Competitive Coding Mastery">STEM & Coding Mastery</option>
                </select>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 mt-4 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-white font-bold text-sm shadow-md hover:shadow-lg hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Get Started Free</span>
                <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
              </>
            )}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-6 text-center text-xs text-on-surface-variant">
          Already have an account?{' '}
          <button
            onClick={onSwitchToLogin}
            className="font-bold text-primary hover:underline ml-1"
          >
            Log In here
          </button>
        </div>

      </div>
    </div>
  );
}
