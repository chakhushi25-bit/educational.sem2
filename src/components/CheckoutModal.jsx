import React, { useState } from 'react';

export default function CheckoutModal({ isOpen, onClose, onUpgradeSuccess, billingCycle }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [cardName, setCardName] = useState('Alex Chen');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [expiry, setExpiry] = useState('08/29');
  const [cvc, setCvc] = useState('892');

  if (!isOpen) return null;

  const price = billingCycle === 'yearly' ? '$9.99/mo ($119.88 billed annually)' : '$14.99/month';

  const handlePay = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onUpgradeSuccess();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-on-surface/50 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-outline-variant/30 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-surface-container hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">workspace_premium</span>
          </div>
          <div>
            <h2 className="text-xl font-bold font-headline-md text-on-surface">StudySync Pro</h2>
            <p className="text-xs text-primary font-semibold">{price}</p>
          </div>
        </div>

        <form onSubmit={handlePay} className="space-y-4">
          <div>
            <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
              Name on Card
            </label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary font-mono"
              />
              <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">credit_card</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
                Expiry Date
              </label>
              <input
                type="text"
                required
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary text-center"
              />
            </div>
            <div>
              <label className="block text-xs font-bold font-label-bold text-on-surface mb-1">
                CVC / CVV
              </label>
              <input
                type="password"
                maxLength={4}
                required
                placeholder="•••"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container-low border border-outline-variant/40 text-xs text-on-surface focus:outline-none focus:border-primary text-center tracking-widest"
              />
            </div>
          </div>

          <div className="p-3 bg-surface-container rounded-2xl flex items-center justify-between text-xs">
            <span className="text-on-surface-variant">Instant Activation</span>
            <span className="font-bold text-emerald-600 flex items-center gap-1">
              <span className="material-symbols-outlined text-[15px]">verified</span> Active immediately
            </span>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-primary to-primary-container text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-primary/30 hover:opacity-95 transition-all active:scale-98"
          >
            {isProcessing ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                <span>Authenticating Payment...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">lock</span>
                <span>Confirm & Start Pro Plan</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-outline">
            Guaranteed 14-day refund policy. Cancel anytime with 1 click.
          </p>
        </form>
      </div>
    </div>
  );
}
