import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  Fuel, 
  Leaf, 
  TrendingUp, 
  DollarSign, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { calculateEvVsGas } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function EvVsGasCalculator({
  currency = 'USD',
}) {
  const [annualMiles, setAnnualMiles] = useState(12000);
  const [gasMpg, setGasMpg] = useState(28);
  const [gasPrice, setGasPrice] = useState(3.60);
  const [evKwhPer100m, setEvKwhPer100m] = useState(28); // Tesla Model 3 / Ioniq 6 average
  const [elecPrice, setElecPrice] = useState(0.16); // $0.16 per kWh
  const [horizonYears, setHorizonYears] = useState(5);

  const results = useMemo(() => {
    return calculateEvVsGas({
      annualMiles: parseFloat(annualMiles) || 0,
      gasMpg: parseFloat(gasMpg) || 1,
      gasPricePerGallon: parseFloat(gasPrice) || 0,
      evKwhPer100Miles: parseFloat(evKwhPer100m) || 1,
      electricityPricePerKwh: parseFloat(elecPrice) || 0,
      years: parseInt(horizonYears) || 5,
    });
  }, [annualMiles, gasMpg, gasPrice, evKwhPer100m, elecPrice, horizonYears]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
              <Zap className="w-3.5 h-3.5" />
              Green Energy & Fuel Cost Comparison
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Electric Vehicle (EV) vs Gas Mileage Comparison
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Compare fuel cost per mile, annual expenditure, 5-year savings, and carbon emissions reduction between traditional gas cars and electric vehicles.
            </p>
          </div>
        </div>

        {/* Form and Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Inputs Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Annual Driving Distance Slider */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Annual Mileage Driven
                </label>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatNumber(annualMiles, 0)} miles/yr
                </span>
              </div>
              <input
                type="range"
                min="3000"
                max="30000"
                step="500"
                value={annualMiles}
                onChange={(e) => setAnnualMiles(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                <span>3,000 mi (Low)</span>
                <span>12,000 mi (US Avg)</span>
                <span>30,000 mi (Heavy)</span>
              </div>
            </div>

            {/* Gas Car Settings */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-amber-500" />
                Gasoline Vehicle Parameters
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Gas Mileage (MPG)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={gasMpg}
                    onChange={(e) => setGasMpg(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Gas Price ($/gal)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={gasPrice}
                    onChange={(e) => setGasPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* EV Settings */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-emerald-500" />
                Electric Vehicle (EV) Parameters
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Efficiency (kWh/100mi)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="1"
                    value={evKwhPer100m}
                    onChange={(e) => setEvKwhPer100m(parseFloat(e.target.value) || 1)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Electricity ($/kWh)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={elecPrice}
                    onChange={(e) => setElecPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Horizon Years */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Forecast Horizon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 8].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => setHorizonYears(yr)}
                    className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                      horizonYears === yr
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {yr} {yr === 1 ? 'Year' : 'Years'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Comparison Side (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Savings Banner */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-xl shadow-emerald-600/20">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-200">
                {horizonYears}-Year Net Fuel Savings with EV
              </span>
              <div className="text-4xl sm:text-5xl font-black mt-1">
                {formatCurrency(results.multiYearSavings, currency)}
              </div>
              <div className="text-xs text-emerald-100 mt-2 font-medium">
                Saves approximately {formatCurrency(results.annualSavings, currency)} each year on fuel costs alone!
              </div>
            </div>

            {/* Side-by-Side Head-to-Head Table */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="px-4 py-3 text-left">Metric</th>
                    <th className="px-4 py-3 text-center text-amber-600 dark:text-amber-400">Gas Vehicle</th>
                    <th className="px-4 py-3 text-center text-emerald-600 dark:text-emerald-400">Electric Vehicle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Cost per Mile</td>
                    <td className="px-4 py-3 font-bold text-center text-slate-900 dark:text-white">
                      {formatCurrency(results.gas.costPerMile, currency)}/mi
                    </td>
                    <td className="px-4 py-3 font-bold text-center text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(results.ev.costPerMile, currency)}/mi
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Cost to Travel 100 Miles</td>
                    <td className="px-4 py-3 font-bold text-center text-slate-900 dark:text-white">
                      {formatCurrency(results.gas.costPer100Miles, currency)}
                    </td>
                    <td className="px-4 py-3 font-bold text-center text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(results.ev.costPer100Miles, currency)}
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Annual Fuel Cost</td>
                    <td className="px-4 py-3 font-bold text-center text-rose-600 dark:text-rose-400">
                      {formatCurrency(results.gas.annualCost, currency)}/yr
                    </td>
                    <td className="px-4 py-3 font-bold text-center text-emerald-600 dark:text-emerald-400">
                      {formatCurrency(results.ev.annualCost, currency)}/yr
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-semibold text-slate-600 dark:text-slate-400">Annual CO₂ Emissions</td>
                    <td className="px-4 py-3 font-bold text-center text-slate-900 dark:text-white">
                      {formatNumber(results.gas.annualCo2Lbs, 0)} lbs
                    </td>
                    <td className="px-4 py-3 font-bold text-center text-emerald-600 dark:text-emerald-400">
                      {formatNumber(results.ev.annualCo2Lbs, 0)} lbs
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Environmental Impact Card */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500 text-white shrink-0">
                <Leaf className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <div className="font-bold text-emerald-900 dark:text-emerald-200">
                  Annual Carbon Offset: ~{formatNumber(results.annualCo2SavedLbs, 0)} lbs CO₂ ({formatNumber(results.annualCo2SavedKg, 0)} kg)
                </div>
                <div className="text-emerald-700 dark:text-emerald-400 mt-0.5">
                  Equivalent to planting approximately {Math.round(results.annualCo2SavedKg / 22)} mature trees every year.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

