import React, { useState } from 'react';
import { 
  ArrowRightLeft, 
  Repeat, 
  Gauge, 
  DollarSign, 
  Flame, 
  Compass,
  CheckCircle2
} from 'lucide-react';
import { formatNumber } from '../utils/formatters';

export default function MileageConverter() {
  // 1. Distance Converter
  const [milesVal, setMilesVal] = useState(100);
  const kmFromMiles = milesVal * 1.609344;
  const nmFromMiles = milesVal * 0.868976;
  const ftFromMiles = milesVal * 5280;

  // 2. Fuel Economy Converter
  const [mpgVal, setMpgVal] = useState(30);
  const l100kmFromMpg = mpgVal > 0 ? 235.214583 / mpgVal : 0;
  const kmplFromMpg = mpgVal * 0.425144;
  const ukMpgFromMpg = mpgVal * 1.20095;

  // 3. Unit Cost Converter
  const [costPerMileVal, setCostPerMileVal] = useState(0.18);
  const costPerKmVal = costPerMileVal / 1.609344;
  const milesPerDollarVal = costPerMileVal > 0 ? 1 / costPerMileVal : 0;
  const kmPerDollarVal = costPerKmVal > 0 ? 1 / costPerKmVal : 0;

  // 4. Two-Stroke Fuel Ratio (50:1, 40:1, 32:1)
  const [gasGallons, setGasGallons] = useState(2);
  const [mixRatio, setMixRatio] = useState(50); // 50:1 standard
  // 1 gallon = 128 fluid ounces
  const oilOuncesNeeded = (gasGallons * 128) / mixRatio;
  const oilMlNeeded = oilOuncesNeeded * 29.5735;

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 dark:bg-teal-950/60 dark:text-teal-300 text-xs font-bold mb-2">
              <Repeat className="w-3.5 h-3.5" />
              Universal Mileage, Distance & Fuel Economy Conversion Suite
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Mileage & Fuel Economy Converter
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Instant two-way conversions between Miles and Kilometers, US MPG, UK Imperial MPG, Liters per 100km (L/100km), KMPL, cost per mile, and 50:1 two-stroke fuel ratios.
            </p>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
          {/* Card 1: Distance Converter */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Compass className="w-4 h-4 text-teal-600" />
              Miles ↔ Kilometers ↔ Nautical Miles
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Enter Distance in Miles
              </label>
              <input
                type="number"
                value={milesVal}
                onChange={(e) => setMilesVal(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">Kilometers (km):</span>
                <span className="font-extrabold text-teal-600 dark:text-teal-400">
                  {formatNumber(kmFromMiles, 3)} km
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">Nautical Miles (NM):</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {formatNumber(nmFromMiles, 3)} NM
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">Feet:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {formatNumber(ftFromMiles, 0)} ft
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Fuel Economy Converter */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-600" />
              US MPG ↔ L/100km ↔ km/L ↔ UK MPG
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Enter US Fuel Economy (MPG)
              </label>
              <input
                type="number"
                step="0.5"
                value={mpgVal}
                onChange={(e) => setMpgVal(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">Metric Consumption (L/100 km):</span>
                <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatNumber(l100kmFromMpg, 2)} L/100 km
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">Kilometers per Liter (km/L):</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {formatNumber(kmplFromMpg, 2)} km/L
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">UK Imperial MPG:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {formatNumber(ukMpgFromMpg, 2)} mpg (imp)
                </span>
              </div>
            </div>
          </div>

          {/* Card 3: Unit Cost & Mileage Value */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Cost per Mile ↔ Cost per Kilometer
            </h3>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Enter Cost per Mile ($/mile)
              </label>
              <input
                type="number"
                step="0.01"
                value={costPerMileVal}
                onChange={(e) => setCostPerMileVal(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">Cost per Kilometer:</span>
                <span className="font-extrabold text-blue-600 dark:text-blue-400">
                  ${formatNumber(costPerKmVal, 3)} / km
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">Miles per $1.00:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {formatNumber(milesPerDollarVal, 2)} miles
                </span>
              </div>
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">Kilometers per $1.00:</span>
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {formatNumber(kmPerDollarVal, 2)} km
                </span>
              </div>
            </div>
          </div>

          {/* Card 4: 50 to 1 Fuel Ratio Mix */}
          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-600" />
              Two-Stroke Gas & Oil Ratio Calculator (50:1, 40:1)
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Gasoline (Gallons)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={gasGallons}
                  onChange={(e) => setGasGallons(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Ratio (e.g. 50:1)
                </label>
                <select
                  value={mixRatio}
                  onChange={(e) => setMixRatio(parseInt(e.target.value) || 50)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                >
                  <option value="50">50:1 (2.6 oz / gal)</option>
                  <option value="40">40:1 (3.2 oz / gal)</option>
                  <option value="32">32:1 (4.0 oz / gal)</option>
                  <option value="25">25:1 (5.1 oz / gal)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold">
                <span className="text-slate-500">2-Cycle Oil Required:</span>
                <span className="font-extrabold text-amber-600 dark:text-amber-400">
                  {formatNumber(oilOuncesNeeded, 1)} fl. oz ({formatNumber(oilMlNeeded, 0)} ml)
                </span>
              </div>
              <div className="text-[11px] text-slate-400">
                Ideal for 2-stroke dirt bikes, outboards, chainsaws, and lawn weed trimmers.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

