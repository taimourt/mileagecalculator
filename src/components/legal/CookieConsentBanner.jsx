import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X } from 'lucide-react';

export default function CookieConsentBanner({ onNavigate }) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('mileage_cookie_consent');
    if (!consent) {
      // Delay showing banner slightly for smooth UX
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('mileage_cookie_consent', 'accepted');
    setShowBanner(false);
  };

  const handleDecline = () => {
    localStorage.setItem('mileage_cookie_consent', 'essential_only');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 animate-fadeIn">
      <div className="p-4 sm:p-5 rounded-3xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Cookie className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Cookie & Privacy Notice</span>
          </div>
          <button
            type="button"
            onClick={handleDecline}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          We use cookies and Google AdSense to personalize content and ads, analyze traffic, and ensure calculations work properly. You can review our full policies in our{' '}
          <button
            type="button"
            onClick={() => onNavigate && onNavigate('privacy')}
            className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
          >
            Privacy Policy
          </button>.
        </p>

        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleAcceptAll}
            className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm"
          >
            Accept All
          </button>
          <button
            type="button"
            onClick={handleDecline}
            className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
