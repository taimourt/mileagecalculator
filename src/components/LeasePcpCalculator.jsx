import React, { useState, useMemo } from 'react';
import { 
  Car, 
  AlertTriangle, 
  CheckCircle, 
  DollarSign, 
  Clock, 
  Calendar, 
  Gauge,
  TrendingDown,
  ShieldAlert
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function LeasePcpCalculator({ currency = 'USD' }) {
  // Inputs
  const [leaseMonths, setLeaseMonths] = useState(36); // 3-year standard lease
  const [annualAllowance, setAnnualAllowance] = useState(10000); // 10,000 miles/year
  const [monthsElapsed, setMonthsElapsed] = useState(18); // halfway through
  const [currentOdometer, setCurrentOdometer] = useState(18500); // current miles
  const [overageRate, setOverageRate] = useState(0.20); // $0.20 per excess mile

  const metrics = useMemo(() => {
    const totalAllowed = (leaseMonths / 12) * annualAllowance;
    const allowedToDate = (monthsElapsed / 12) * annualAllowance;
    const currentDifference = currentOdometer - allowedToDate;

    // Monthly average pace
    const actualMonthlyPace = monthsElapsed > 0 ? currentOdometer / monthsElapsed : 0;
    const allowedMonthlyPace = annualAllowance / 12;

    // Projected final mileage at return
    const projectedFinalMileage = actualMonthlyPace * leaseMonths;
    const projectedExcessMiles = Math.max(0, projectedFinalMileage - totalAllowed);
    const projectedPenalty = projectedExcessMiles * overageRate;

    // Pace adjustment: how many miles per month remaining to hit target
    const remainingMonths = Math.max(1, leaseMonths - monthsElapsed);
    const remainingAllowedMiles = Math.max(0, totalAllowed - currentOdometer);
    const targetMonthlyPace = remainingAllowedMiles / remainingMonths;
    const targetDailyPace = targetMonthlyPace / 30.4;

    // Status
    let status = {
      level: 'good',
      label: 'On Track (Under Allowance)',
      color: 'text-emerald-700 bg-emerald-50 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300',
    };

    if (currentDifference > 2000) {
      status = {
        level: 'danger',
        label: 'Critical: Significant Penalty Expected',
        color: 'text-rose-700 bg-rose-50 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300',
      };
    } else if (currentDifference > 0) {
      status = {
        level: 'warning',
        label: 'Warning: Slightly Ahead of Allowance Pace',
        color: 'text-amber-700 bg-amber-50 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300',
      };
    }

    return {
      totalAllowed,
      allowedToDate,
      currentDifference,
      actualMonthlyPace,
      allowedMonthlyPace,
      projectedFinalMileage,
      projectedExcessMiles,
      projectedPenalty,
      remainingMonths,
      remainingAllowedMiles,
      targetMonthlyPace,
      targetDailyPace,
      status,
    };
  }, [leaseMonths, annualAllowance, monthsElapsed, currentOdometer, overageRate]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 text-xs font-bold mb-2">
              <Car className="w-3.5 h-3.5" />
              Contract Hire & PCP Overage Risk Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Car Lease & PCP Excess Mileage Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Track your contract driving pace, predict lease return odometer readings, calculate excess mileage penalty charges, and get personalized daily driving targets.
            </p>
          </div>
        </div>

        {/* Form and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Input Side (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Total Lease Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Lease Contract Term (Months)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[24, 36, 48, 60].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setLeaseMonths(m)}
                    className={`py-2 text-xs font-bold rounded-xl border transition ${
                      leaseMonths === m
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {m} mos
                  </button>
                ))}
              </div>
            </div>

            {/* Annual Mileage Allowance */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Annual Mileage Allowance (Miles/Year)
              </label>
              <input
                type="number"
                step="500"
                value={annualAllowance}
                onChange={(e) => setAnnualAllowance(parseFloat(e.target.value) || 0)}
                placeholder="10000"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              />
              <span className="text-[10px] text-slate-400 block mt-1">
                Total contract limit: {formatNumber(metrics.totalAllowed, 0)} miles
              </span>
            </div>

            {/* Current Lease Progress in 2 cols */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Months Elapsed
                </label>
                <input
                  type="number"
                  min="1"
                  max={leaseMonths}
                  value={monthsElapsed}
                  onChange={(e) => setMonthsElapsed(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Current Odometer
                </label>
                <input
                  type="number"
                  step="100"
                  value={currentOdometer}
                  onChange={(e) => setCurrentOdometer(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Excess Charge Rate */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Excess Mileage Charge Rate ({currency}/mile)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.05"
                  value={overageRate}
                  onChange={(e) => setOverageRate(parseFloat(e.target.value) || 0.15)}
                  placeholder="0.20"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">
                Typically ranges between $0.15 and $0.35/mile (or 8p–20p in UK PCP contracts)
              </span>
            </div>
          </div>

          {/* Results Side (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Status & Penalty Banner */}
            <div
              className={`p-6 rounded-3xl border shadow-sm ${
                metrics.projectedPenalty > 0
                  ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-rose-500/20'
                  : 'bg-gradient-to-br from-purple-600 to-indigo-700 text-white shadow-purple-600/20'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-white/20">
                <span className="text-xs uppercase font-extrabold tracking-wider opacity-90">
                  Projected End-of-Lease Penalty Charge
                </span>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-sm">
                  {metrics.projectedPenalty > 0 ? 'Overage Warning' : 'Safe Margin'}
                </span>
              </div>

              <div className="text-4xl sm:text-5xl font-black mt-3">
                {formatCurrency(metrics.projectedPenalty, currency)}
              </div>
              <div className="text-xs opacity-90 mt-2 font-medium">
                {metrics.projectedPenalty > 0
                  ? `Based on ${formatNumber(metrics.projectedExcessMiles, 0)} projected excess miles at maturity.`
                  : 'You are currently on track to return the vehicle within your contractual mileage limit.'}
              </div>
            </div>

            {/* Head-to-Head Statistics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Allowed to Date</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {formatNumber(metrics.allowedToDate, 0)} mi
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Current Pace Status</span>
                <span
                  className={`text-lg font-extrabold ${
                    metrics.currentDifference > 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}
                >
                  {metrics.currentDifference > 0
                    ? `+${formatNumber(metrics.currentDifference, 0)} mi ahead`
                    : `${formatNumber(Math.abs(metrics.currentDifference), 0)} mi buffer`}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Projected Return Odo</span>
                <span className="text-lg font-extrabold text-purple-600 dark:text-purple-400">
                  {formatNumber(metrics.projectedFinalMileage, 0)} mi
                </span>
              </div>
            </div>

            {/* Target Re-balancing Recommendation */}
            <div className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs space-y-2">
              <div className="font-bold text-purple-900 dark:text-purple-200 flex items-center gap-1.5 text-sm">
                <TrendingDown className="w-4 h-4 text-purple-600" />
                Recommended Pace to Avoid All Excess Penalties:
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-slate-400 block">Daily Driving Target:</span>
                  <strong className="text-base text-purple-700 dark:text-purple-300 font-extrabold">
                    {formatNumber(metrics.targetDailyPace, 1)} miles / day
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Monthly Driving Target:</span>
                  <strong className="text-base text-purple-700 dark:text-purple-300 font-extrabold">
                    {formatNumber(metrics.targetMonthlyPace, 0)} miles / month
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

