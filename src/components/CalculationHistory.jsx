import React from 'react';
import { History, Trash2, ArrowUpRight } from 'lucide-react';

export default function CalculationHistory({ history = [], onClearHistory }) {
  if (!history || history.length === 0) return null;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors mt-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700/60">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Saved Calculation History ({history.length})
          </h3>
        </div>
        <button
          type="button"
          onClick={onClearHistory}
          className="text-xs text-rose-500 hover:text-rose-600 font-semibold flex items-center gap-1 transition"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear All
        </button>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800 mt-2">
        {history.map((item, idx) => (
          <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200">{item.type}</span>
              <span className="text-slate-400 ml-2">({item.date})</span>
              <div className="text-slate-500 dark:text-slate-400 mt-0.5">{item.details}</div>
            </div>
            <div className="text-right">
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{item.cost}</span>
              <div className="text-slate-400 text-[11px]">{item.distance}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

