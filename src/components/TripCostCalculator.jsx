import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  Users, 
  DollarSign, 
  Car, 
  Fuel, 
  Receipt, 
  PieChart, 
  Sparkles,
  Bookmark,
  Share2
} from 'lucide-react';
import { VEHICLE_PRESETS } from '../data/vehiclePresets';
import { calculateTripCost } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';

export default function TripCostCalculator({
  unitSystem = 'us',
  currency = 'USD',
  initialDistance = 250,
  initialMpg = 28,
  initialFuelPrice = 3.50,
  onSaveHistory,
}) {
  const [distance, setDistance] = useState(initialDistance);
  const [mpg, setMpg] = useState(initialMpg);
  const [fuelPrice, setFuelPrice] = useState(initialFuelPrice);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengers, setPassengers] = useState(1);
  const [selectedPreset, setSelectedPreset] = useState('');

  // Extra expenses
  const [tolls, setTolls] = useState(15);
  const [parking, setParking] = useState(20);
  const [lodging, setLodging] = useState(0);
  const [food, setFood] = useState(40);
  const [other, setOther] = useState(0);

  const handleApplyPreset = (presetName) => {
    setSelectedPreset(presetName);
    const found = VEHICLE_PRESETS.find(p => p.name === presetName);
    if (found) {
      setMpg(found.mpg);
    }
  };

  const tripData = useMemo(() => {
    return calculateTripCost({
      distanceMiles: parseFloat(distance) || 0,
      mpg: parseFloat(mpg) || 1,
      fuelPrice: parseFloat(fuelPrice) || 0,
      isRoundTrip,
      passengers: parseInt(passengers) || 1,
      tolls: parseFloat(tolls) || 0,
      parking: parseFloat(parking) || 0,
      lodging: parseFloat(lodging) || 0,
      food: parseFloat(food) || 0,
      other: parseFloat(other) || 0,
    });
  }, [distance, mpg, fuelPrice, isRoundTrip, passengers, tolls, parking, lodging, food, other]);

  const handleSave = () => {
    if (!onSaveHistory) return;
    onSaveHistory({
      type: 'Road Trip Budget',
      date: new Date().toLocaleDateString(),
      details: `${formatNumber(tripData.effectiveDistance, 0)} miles (${passengers} passengers)`,
      distance: `${formatNumber(tripData.effectiveDistance, 0)} mi`,
      cost: formatCurrency(tripData.totalCost, currency),
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
              <Compass className="w-3.5 h-3.5" />
              Road Trip Budget & Cost Sharing Planner
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fuel Cost & Road Trip Expense Planner
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Forecast total road trip costs, fuel consumption, toll fees, hotel, food, and divide fairly among travel companions.
            </p>
          </div>

          {/* Quick Vehicle Presets Dropdown */}
          <div className="w-full sm:w-auto">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Vehicle Preset
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handleApplyPreset(e.target.value)}
              className="w-full sm:w-64 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Select a vehicle profile...</option>
              {VEHICLE_PRESETS.map((v, i) => (
                <option key={i} value={v.name}>
                  {v.name} ({v.mpg} MPG)
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Inputs & Cost Visuals */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Distance */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Trip Distance (one-way, {unitSystem === 'us' ? 'miles' : 'km'})
              </label>
              <input
                type="number"
                min="0"
                value={distance}
                onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                placeholder="250"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* MPG & Gas Price in 2 cols */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Fuel Efficiency ({unitSystem === 'us' ? 'MPG' : 'km/L'})
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  value={mpg}
                  onChange={(e) => setMpg(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Fuel Price ({unitSystem === 'us' ? `${currency}/gal` : `${currency}/L`})
                </label>
                <input
                  type="number"
                  step="0.05"
                  min="0"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            {/* Round trip & Passengers */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Round Trip (x2 Distance)
                </span>
                <button
                  type="button"
                  onClick={() => setIsRoundTrip(!isRoundTrip)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    isRoundTrip ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      isRoundTrip ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-500" />
                    Number of Passengers (Split Costs)
                  </span>
                  <span className="font-extrabold text-blue-600 dark:text-blue-400">
                    {passengers} {passengers === 1 ? 'person' : 'people'}
                  </span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={passengers}
                  onChange={(e) => setPassengers(parseInt(e.target.value) || 1)}
                  className="w-full accent-blue-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Additional Trip Expenses */}
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5" />
                Additional Travel Expenses (Optional)
              </label>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block mb-0.5">Highway Tolls</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={tolls}
                      onChange={(e) => setTolls(parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                    />
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">$</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Parking Fees</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={parking}
                      onChange={(e) => setParking(parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                    />
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">$</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Hotel / Lodging</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={lodging}
                      onChange={(e) => setLodging(parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                    />
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">$</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 block mb-0.5">Food & Incidentals</span>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      value={food}
                      onChange={(e) => setFood(parseFloat(e.target.value) || 0)}
                      className="w-full pl-6 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg font-bold"
                    />
                    <span className="absolute left-2.5 top-1.5 text-slate-400 font-bold">$</span>
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-1.5"
            >
              <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
              Save Budget to History
            </button>
          </div>

          {/* Results Side (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Grand Total Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Total Trip Cost */}
              <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
                <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-100">
                  Total Trip Expense
                </span>
                <div className="text-4xl sm:text-5xl font-black mt-1">
                  {formatCurrency(tripData.totalCost, currency)}
                </div>
                <div className="text-xs text-emerald-100 mt-2 font-medium">
                  {formatNumber(tripData.effectiveDistance, 0)} total {unitSystem === 'us' ? 'miles' : 'km'} • {formatCurrency(tripData.costPerMile, currency)}/mi
                </div>
              </div>

              {/* Per-Person Split */}
              <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-lg shadow-slate-900/20 border border-slate-800">
                <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                  Split Cost Per Person
                </span>
                <div className="text-4xl sm:text-5xl font-black text-emerald-400 mt-1">
                  {formatCurrency(tripData.costPerPerson, currency)}
                </div>
                <div className="text-xs text-slate-400 mt-2 font-medium">
                  Divided equally across {passengers} {passengers === 1 ? 'traveler' : 'travelers'}
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Fuel Needed</span>
                <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                  {formatNumber(tripData.gallonsNeeded, 1)} {unitSystem === 'us' ? 'gal' : 'L'}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Fuel Only Cost</span>
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  {formatCurrency(tripData.fuelCost, currency)}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80">
                <span className="text-[11px] font-bold uppercase text-slate-400 block">Non-Fuel Extras</span>
                <span className="text-lg font-extrabold text-blue-600 dark:text-blue-400">
                  {formatCurrency(tripData.extraExpenses, currency)}
                </span>
              </div>
            </div>

            {/* Visual Budget Progress Distribution */}
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-emerald-600" />
                  Trip Cost Breakdown Distribution
                </h4>
                <span className="text-xs font-bold text-slate-400">
                  100% of Total Budget
                </span>
              </div>

              {/* Multi-segment Progress Bar */}
              <div className="w-full h-4 rounded-full overflow-hidden flex bg-slate-100 dark:bg-slate-700">
                {tripData.breakdown.map((item, idx) => {
                  const pct = tripData.totalCost > 0 ? (item.amount / tripData.totalCost) * 100 : 0;
                  return (
                    <div
                      key={idx}
                      style={{ width: `${pct}%`, backgroundColor: item.color }}
                      className="h-full transition-all duration-300"
                      title={`${item.name}: ${formatCurrency(item.amount, currency)} (${Math.round(pct)}%)`}
                    />
                  );
                })}
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {tripData.breakdown.map((item, idx) => {
                  const pct = tripData.totalCost > 0 ? (item.amount / tripData.totalCost) * 100 : 0;
                  return (
                    <div key={idx} className="flex items-center gap-2 text-xs">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                      <div className="truncate">
                        <span className="font-semibold text-slate-600 dark:text-slate-400">{item.name}</span>
                        <div className="font-extrabold text-slate-900 dark:text-white">
                          {formatCurrency(item.amount, currency)} ({Math.round(pct)}%)
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

