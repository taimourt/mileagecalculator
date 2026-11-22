import React from 'react';
import { Compass, ShieldCheck, Heart, ExternalLink, Lock, FileText, HelpCircle, Mail, Award } from 'lucide-react';

export default function Footer({ onNavigateTab }) {
  const handleNav = (tabId) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md pt-12 pb-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-slate-100 dark:border-slate-800/80">
          
          {/* Brand & Mission (2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
                <Compass className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
                Mileage<span className="text-emerald-600 dark:text-emerald-400">Calculator</span> <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">PRO</span>
              </span>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm">
              Next-generation high-precision driving distance, gas mileage MPG, IRS reimbursement logbook, and IFTA trucking tax calculations. 100% client-side privacy with mathematical accuracy.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800/50">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Client-Side Privacy
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                Verified Free Utility
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                IRS 2019–2026 Compatible
              </span>
            </div>
          </div>

          {/* Col 1: Calculators */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Mileage Calculators
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button type="button" onClick={() => handleNav('route')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  Driving Route & Distance
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('mileage')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  Gas Mileage (MPG)
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('irs')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  IRS Business Mileage Log
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('ifta')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  IFTA Trucking State Tax
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('lease')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  Car Lease & PCP Overage
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('trip')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  Road Trip Cost Splitter
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Specialty & Knowledge */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Knowledge & Guides
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button type="button" onClick={() => handleNav('resources')} className="hover:text-emerald-600 dark:hover:text-emerald-400 font-bold text-emerald-600 dark:text-emerald-400 transition text-left flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Educational Guides (14 Articles)</span>
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('faqs')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  FAQs & Mileage Guide
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('authority')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  Knowledge Hub & Pillars
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('ev')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  EV vs Gas Cost Comparison
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('air')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  Aeronautical Air Miles
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('convert')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  Unit & Ratio Converter
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('sitemap')} className="hover:text-emerald-600 dark:hover:text-emerald-400 transition text-left">
                  11 Language Directory
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Trust & Legal (Crucial for AdSense) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Trust & Legal
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button type="button" onClick={() => handleNav('privacy')} className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition text-left flex items-center gap-1.5">
                  <Lock className="w-3 h-3 text-emerald-600" /> Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('terms')} className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition text-left flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-blue-600" /> Terms of Service
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('about')} className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition text-left flex items-center gap-1.5">
                  <Award className="w-3 h-3 text-amber-500" /> About Our Mission
                </button>
              </li>
              <li>
                <button type="button" onClick={() => handleNav('contact')} className="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition text-left flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-purple-600" /> Contact Us
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer & Copyright */}
        <div className="mt-8 text-[11px] text-slate-400 space-y-2 text-center max-w-4xl mx-auto">
          <p>
            Disclaimer: Mileage distances, travel durations, and fuel calculations are estimates derived from standard open highway networks and published mathematical formulas. Actual fuel economy varies by vehicle maintenance, cargo weight, driving habits, and atmospheric conditions. Tax calculations reflect published IRS standard mileage rates (Rev. Proc. 2019-46 / Notice 2024-08); always consult your Certified Public Accountant or tax advisor for formal Schedule C / Form 2106 filings.
          </p>
          <p className="font-medium text-slate-500 dark:text-slate-400 pt-1">
            &copy; {new Date().getFullYear()} Mileage Calculator Pro (<a href="https://www.mileagecalculatorpro.com" className="hover:underline">www.mileagecalculatorpro.com</a>). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
