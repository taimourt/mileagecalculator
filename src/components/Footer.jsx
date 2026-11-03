import React from 'react';
import { Compass, Heart, Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-slate-800 dark:text-slate-200">
                Mileage Calculator Pro
              </p>
              <p className="text-[11px] text-slate-400">
                Next-generation driving route, gas mileage, fuel economy & IRS reimbursement suite.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
              <Shield className="w-3.5 h-3.5" /> 100% Private & Client-side
            </span>
            <span>•</span>
            <span>No Ads</span>
            <span>•</span>
            <span>OSRM Road Routing</span>
            <span>•</span>
            <span>IRS 2024-2026 Compatible</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-[11px] text-slate-400 text-center">
          <p>
            Disclaimer: Mileage distances, travel times, and fuel calculations are estimates based on standard driving routes and average engine parameters. Actual fuel consumption varies by vehicle condition, cargo weight, driving style, weather, and terrain. Always consult your accountant or tax professional regarding IRS Form 2106 / Schedule C deductions.
          </p>
          <p className="mt-2 font-medium">
            &copy; {new Date().getFullYear()} Mileage Calculator Pro. Better, faster, and more detailed than standard calculators.
          </p>
        </div>
      </div>
    </footer>
  );
}

