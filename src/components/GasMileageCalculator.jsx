import React, { useState, useMemo } from 'react';
import { 
  Fuel, 
  Gauge, 
  DollarSign, 
  CheckCircle, 
  HelpCircle, 
  Bookmark, 
  RotateCcw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { calculateGasMileage } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function GasMileageCalculator({
  unitSystem = 'us',
  setUnitSystem,
  currency = 'USD',
  onSaveHistory,
}) {
  // Input mode: 'odometer' vs 'distance'
  const [calcMode, setCalcMode] = useState('odometer');

  // Odometer values
  const [currentOdo, setCurrentOdo] = useState(12360);
  const [previousOdo, setPreviousOdo] = useState(12000);
  
  // Direct trip distance
  const [directDistance, setDirectDistance] = useState(360);

  // Gas added & price
  const [gasAdded, setGasAdded] = useState(15);
  const [gasPrice, setGasPrice] = useState(3.50);

  // Metric unit defaults helper
  const handleUnitSwitch = (newUnit) => {
    setUnitSystem(newUnit);
    if (newUnit === 'metric') {
      setCurrentOdo(18900);
      setPreviousOdo(18300);
      setDirectDistance(600);
      setGasAdded(50);
      setGasPrice(1.65);
    } else {
      setCurrentOdo(12360);
      setPreviousOdo(12000);
      setDirectDistance(360);
      setGasAdded(15);
      setGasPrice(3.50);
    }
  };

  const calculation = useMemo(() => {
    return calculateGasMileage({
      isOdometerMode: calcMode === 'odometer',
      currentOdo: parseFloat(currentOdo) || 0,
      previousOdo: parseFloat(previousOdo) || 0,
      directDistance: parseFloat(directDistance) || 0,
      fuelAmount: parseFloat(gasAdded) || 0,
      fuelPrice: parseFloat(gasPrice) || 0,
      unitSystem,
    });
  }, [calcMode, currentOdo, previousOdo, directDistance, gasAdded, gasPrice, unitSystem]);

  const handleClear = () => {
    setCurrentOdo('');
    setPreviousOdo('');
    setDirectDistance('');
    setGasAdded('');
    setGasPrice('');
  };

  const handleSaveToHistory = () => {
    if (!calculation || !onSaveHistory) return;
    onSaveHistory({
      type: 'Gas Mileage',
      date: new Date().toLocaleDateString(),
      details: `${formatNumber(calculation.mpgUS, 1)} MPG (${formatNumber(calculation.lPer100km, 1)} L/100km)`,
      distance: `${formatNumber(calculation.distanceTraveled, 0)} ${unitSystem === 'us' ? 'mi' : 'km'}`,
      cost: formatCurrency(calculation.totalFuelCost, currency),
    });
  };

  const distanceUnit = unitSystem === 'us' ? 'miles' : 'km';
  const volumeUnit = unitSystem === 'us' ? 'gallons' : 'liters';

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
              <Fuel className="w-3.5 h-3.5" />
              Full-Tank Odometer & Economy Method
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Gas Mileage & Fuel Economy Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Accurately determine vehicle gas mileage (MPG, L/100km, km/L), fuel unit cost, and cost per mile from odometer readings or distance traveled.
            </p>
          </div>

          {/* Unit selector buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleUnitSwitch('us')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                unitSystem === 'us'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              US Units (MPG)
            </button>
            <button
              type="button"
              onClick={() => handleUnitSwitch('metric')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                unitSystem === 'metric'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              Metric Units (L/100km)
            </button>
            <button
              type="button"
              onClick={() => handleUnitSwitch('imperial')}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                unitSystem === 'imperial'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              UK Imperial (MPG)
            </button>
          </div>
        </div>

        {/* Calculation Modes: Odometer vs Trip Distance */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Form Side (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="inline-flex p-1 w-full rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
              <button
                type="button"
                onClick={() => setCalcMode('odometer')}
                className={`flex-1 py-2 text-center rounded-xl transition-all ${
                  calcMode === 'odometer'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Odometer Readings
              </button>
              <button
                type="button"
                onClick={() => setCalcMode('distance')}
                className={`flex-1 py-2 text-center rounded-xl transition-all ${
                  calcMode === 'distance'
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Trip Meter / Distance
              </button>
            </div>

            {/* Inputs depending on mode */}
            {calcMode === 'odometer' ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Current Odometer Reading ({distanceUnit})
                  </label>
                  <input
                    type="number"
                    value={currentOdo}
                    onChange={(e) => setCurrentOdo(e.target.value)}
                    placeholder="e.g. 12360"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Reading at this fill-up</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Previous Odometer Reading ({distanceUnit})
                  </label>
                  <input
                    type="number"
                    value={previousOdo}
                    onChange={(e) => setPreviousOdo(e.target.value)}
                    placeholder="e.g. 12000"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Reading at last full-tank fill-up</p>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Trip Distance Traveled ({distanceUnit})
                </label>
                <input
                  type="number"
                  value={directDistance}
                  onChange={(e) => setDirectDistance(e.target.value)}
                  placeholder="e.g. 360"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Mileage since previous fill-up</p>
              </div>
            )}

            {/* Fuel Added */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Gas Added to Tank ({volumeUnit})
              </label>
              <input
                type="number"
                step="0.01"
                value={gasAdded}
                onChange={(e) => setGasAdded(e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Amount pumped until tank clicked full</p>
            </div>

            {/* Gas Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Gas Price (per {unitSystem === 'us' ? 'gallon' : 'liter'})
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value)}
                  placeholder="e.g. 3.50"
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 font-bold">$</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                Clear
              </button>
              {calculation && (
                <button
                  type="button"
                  onClick={handleSaveToHistory}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                  Save to History
                </button>
              )}
            </div>
          </div>

          {/* Results Side (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            {calculation ? (
              <div className="space-y-6">
                {/* Primary Hero Result */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-2 border-emerald-500/30 dark:border-emerald-500/40 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between pb-3 border-b border-emerald-100 dark:border-slate-700">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                      Calculated Fuel Efficiency
                    </span>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${calculation.rating.color}`}>
                      {calculation.rating.label}
                    </span>
                  </div>

                  <div className="my-4 flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
                    <div className="text-4xl sm:text-5xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                      {formatNumber(calculation.mpgUS, 2)}{' '}
                      <span className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                        MPG
                      </span>
                    </div>
                    <div className="text-slate-500 dark:text-slate-400 text-sm font-semibold">
                      ({formatNumber(calculation.lPer100km, 2)} L/100 km &nbsp;•&nbsp; {formatNumber(calculation.kmPerLiter, 2)} km/L)
                    </div>
                  </div>

                  {/* Summary row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200/80 dark:border-slate-700 text-xs font-medium">
                    <div>
                      <span className="text-slate-400 block">Distance Accrued</span>
                      <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        {formatNumber(calculation.distanceTraveled, 1)} {distanceUnit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Fill Expense</span>
                      <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        {formatCurrency(calculation.totalFuelCost, currency)}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Cost Per Mile</span>
                      <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        {formatCurrency(calculation.costPerMile, currency)} / mi
                      </strong>
                    </div>
                  </div>
                </div>

                {/* International Conversion Matrix */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Comprehensive Units Comparison Matrix
                  </div>
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2.5 font-medium text-slate-500">US Miles Per Gallon</td>
                        <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white text-right">
                          {formatNumber(calculation.mpgUS, 2)} mpg
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2.5 font-medium text-slate-500">UK Imperial MPG</td>
                        <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white text-right">
                          {formatNumber(calculation.mpgUK, 2)} mpg (imp)
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2.5 font-medium text-slate-500">Liters per 100 Kilometers</td>
                        <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white text-right">
                          {formatNumber(calculation.lPer100km, 2)} L/100km
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2.5 font-medium text-slate-500">Kilometers per Liter</td>
                        <td className="px-4 py-2.5 font-bold text-slate-900 dark:text-white text-right">
                          {formatNumber(calculation.kmPerLiter, 2)} km/L
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2.5 font-medium text-slate-500">Distance Per $1 Currency</td>
                        <td className="px-4 py-2.5 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                          {formatNumber(calculation.milesPerDollar, 2)} miles / $ ({formatNumber(calculation.kmPerDollar, 2)} km / $)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Step-by-Step Mathematical Trace */}
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-2">
                  <div className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    How this was calculated (Step-by-Step):
                  </div>
                  <div className="text-slate-600 dark:text-slate-400 font-mono text-[11px] space-y-1">
                    {calcMode === 'odometer' && (
                      <p>
                        1. Distance = Current ({currentOdo}) - Previous ({previousOdo}) = <strong>{calculation.distanceTraveled} {distanceUnit}</strong>
                      </p>
                    )}
                    <p>
                      2. Gas Mileage = Distance ({calculation.distanceTraveled}) ÷ Fuel Added ({gasAdded}) = <strong>{formatNumber(calculation.mpgUS, 2)} {unitSystem === 'us' ? 'MPG' : 'km/L'}</strong>
                    </p>
                    {gasPrice > 0 && (
                      <p>
                        3. Fill Cost = Fuel ({gasAdded}) × Price ({gasPrice}) = <strong>{formatCurrency(calculation.totalFuelCost, currency)}</strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Gauge className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  Enter Your Odometer or Trip Distance
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Fill in your previous & current odometer values or distance driven, plus the fuel added to instantly calculate MPG.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

