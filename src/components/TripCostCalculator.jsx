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
  Share2,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Zap,
  Repeat
} from 'lucide-react';
import { VEHICLE_PRESETS } from '../data/vehiclePresets';
import { calculateTripCost } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';
import CalculatorEducationalSection from './common/CalculatorEducationalSection';

export default function TripCostCalculator({
  unitSystem = 'us',
  currency = 'USD',
  initialDistance = 250,
  initialMpg = 28,
  initialFuelPrice = 3.50,
  onSaveHistory,
  onNavigateTab,
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

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  const handleApplyPreset = (presetName) => {
    setSelectedPreset(presetName);
    const found = VEHICLE_PRESETS.find(p => p.name === presetName);
    if (found) {
      setMpg(found.mpg);
    }
  };

  const handleReset = () => {
    setDistance(250);
    setMpg(28);
    setFuelPrice(3.50);
    setIsRoundTrip(false);
    setPassengers(1);
    setSelectedPreset('');
    setTolls(15);
    setParking(20);
    setLodging(0);
    setFood(40);
    setOther(0);
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

  const handleCopySummary = () => {
    if (!tripData) return;
    const summary = `Road Trip Cost Summary:\nDistance: ${formatNumber(tripData.effectiveDistance, 0)} ${unitSystem === 'us' ? 'miles' : 'km'} (${isRoundTrip ? 'Round Trip' : 'One Way'})\nPassengers: ${tripData.passengers}\nTotal Trip Expense: ${formatCurrency(tripData.totalCost, currency)}\nCost Per Person: ${formatCurrency(tripData.costPerPerson, currency)}\nFuel Required: ${formatNumber(tripData.gallonsNeeded, 1)} gal (${formatCurrency(tripData.fuelCost, currency)})\nCalculated on MileageCalculatorPro.com`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

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
    <div className="space-y-8">
      {/* Primary Calculator Card */}
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
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
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
          
          {/* Inputs Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Distance */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Trip Distance (one-way, {unitSystem === 'us' ? 'miles' : 'km'}) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                placeholder="e.g. 250"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Round Trip Checkbox */}
            <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <input
                type="checkbox"
                id="tripRoundTrip"
                checked={isRoundTrip}
                onChange={(e) => setIsRoundTrip(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="tripRoundTrip" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                Round Trip (doubles distance to {formatNumber(tripData.effectiveDistance, 0)} {unitSystem === 'us' ? 'mi' : 'km'})
              </label>
            </div>

            {/* MPG and Fuel Price */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Fuel Economy (MPG) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="any"
                  value={mpg}
                  onChange={(e) => setMpg(e.target.value)}
                  placeholder="e.g. 28"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Gas Price ({currency}/gal) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(e.target.value)}
                  placeholder="e.g. 3.50"
                  className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Passengers */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Number of Passengers (Split With)
                </label>
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                  {passengers} {passengers === 1 ? 'person' : 'people'}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="8"
                value={passengers}
                onChange={(e) => setPassengers(e.target.value)}
                className="w-full accent-emerald-600 cursor-pointer"
              />
            </div>

            {/* Extra Trip Expenses Collapsible / Inputs */}
            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Additional Incidentals & Travel Costs
              </span>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block text-slate-500 mb-1">Tolls ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={tolls}
                    onChange={(e) => setTolls(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Parking ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={parking}
                    onChange={(e) => setParking(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Lodging/Hotel ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={lodging}
                    onChange={(e) => setLodging(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-500 mb-1">Food & Drinks ({currency})</label>
                  <input
                    type="number"
                    min="0"
                    value={food}
                    onChange={(e) => setFood(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Reset Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset to Standard Defaults</span>
              </button>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Split Price Big Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-600/5 to-transparent border border-emerald-500/20 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                  Cost Per Passenger (Fair Split)
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {tripData.passengers} {tripData.passengers === 1 ? 'Driver' : 'Passengers'}
                </span>
              </div>

              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
                  {formatCurrency(tripData.costPerPerson, currency)}
                </div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-1">
                  Per person &bull; Grand total {formatCurrency(tripData.totalCost, currency)}
                </div>
              </div>

              {/* Key numbers summary */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-700 text-xs font-medium">
                <div>
                  <span className="text-slate-400 block">Total Distance</span>
                  <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {formatNumber(tripData.effectiveDistance, 0)} {unitSystem === 'us' ? 'mi' : 'km'}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Fuel Required</span>
                  <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {formatNumber(tripData.gallonsNeeded, 1)} gal ({formatCurrency(tripData.fuelCost, currency)})
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Cost Per Mile</span>
                  <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                    {formatCurrency(tripData.costPerMile, currency)} / mi
                  </strong>
                </div>
              </div>

              {/* Action Buttons: Copy & Save */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied to Clipboard!' : 'Copy Summary'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-sm"
                >
                  <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Save Trip Budget</span>
                </button>
              </div>
            </div>

            {/* Expense Breakdown List */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>Expense Category Breakdown</span>
                <span>Amount</span>
              </div>
              <div className="space-y-2 text-xs">
                {tripData.breakdown.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/60 dark:border-slate-800 last:border-none">
                    <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(item.amount, currency)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Guide Section */}
      <CalculatorEducationalSection
        title="Fuel Cost & Road Trip Expense Planner"
        whatIsIt="The Road Trip Fuel Cost & Expense Splitter estimates the total expenditure required for vehicle road travel, factoring in fuel consumption, highway tolls, parking, lodging, and meals. It accurately divides the grand total among travel companions, providing a transparent breakdown of cost per person and cost per mile."
        howToUse={[
          'Input the one-way driving distance (or toggle Round Trip to automatically double the mileage).',
          'Specify your vehicle fuel economy (MPG) or select a profile from the vehicle preset dropdown.',
          'Enter current gasoline or diesel prices and optional incidental costs (tolls, parking, hotel, food).',
          'Adjust the passenger slider to calculate fair per-person shares for carpools, vacations, and group road trips.',
        ]}
        formula={
`// 1. Total Trip Distance
Effective Distance = isRoundTrip ? (OneWayDistance × 2) : OneWayDistance

// 2. Fuel Consumed & Fuel Cost
Fuel Required (Gallons) = Effective Distance ÷ Vehicle MPG
Total Fuel Cost = Fuel Required × Fuel Price per Gallon

// 3. Grand Total Expense
Grand Total Cost = Total Fuel Cost + Tolls + Parking + Lodging + Food + Other

// 4. Per Passenger Share
Cost Per Person = Grand Total Cost ÷ Passenger Count`
        }
        example={{
          scenario: 'Four friends plan a 300-mile weekend road trip (600 miles round-trip) in an SUV averaging 24 MPG, with gas at $3.50/gal, $20 tolls, and $40 parking.',
          inputs: ['Distance: 300 miles (Round Trip = 600 miles)', 'Vehicle Fuel Economy: 24.0 MPG', 'Gasoline Price: $3.50 / gallon', 'Passengers: 4', 'Tolls + Parking: $60.00'],
          results: ['Fuel Required: 25.0 gallons', 'Fuel Expense: $87.50', 'Total Incidentals: $60.00', 'Grand Total Cost: $147.50', 'Fair Share Per Person: $36.88']
        }}
        understandingResults={[
          { term: 'Cost Per Person', definition: 'The fair individual contribution when dividing total road trip expenses equally among all passengers.' },
          { term: 'Fuel Required', definition: 'The total volume of gasoline or diesel required to complete the specified driving distance.' },
          { term: 'Cost Per Mile', definition: 'The blended travel expense per mile of travel, including fuel, tolls, and parking fees.' },
          { term: 'Effective Distance', definition: 'The total accumulated travel distance, accounting for one-way or round-trip journeys.' },
        ]}
        factors={[
          'Speed & Cruise Control: Maintaining steady speeds between 60–65 mph improves highway fuel economy by up to 15% compared to speeding at 75–80 mph.',
          'Elevation & Mountain Passes: Driving uphill requires significantly higher engine torque, decreasing temporary fuel economy by 20% to 35%.',
          'Passenger & Luggage Payload: Every additional 100 lbs (45 kg) of passenger weight or luggage reduces vehicle MPG by approximately 1%.',
          'Fuel Price Volatility: Interstate rest stops and remote highway exits often charge 20 to 50 cents more per gallon than metropolitan stations.',
        ]}
        faqs={[
          {
            q: 'How should carpoolers divide gas costs when only one person provides the vehicle?',
            a: 'Standard road trip etiquette divides fuel, tolls, and parking equally among passengers. Often, the driver is excluded from extra costs or passengers pay a small depreciation buffer (5 to 10 cents per mile) to compensate the vehicle owner for tire wear, oil degradation, and routine maintenance.'
          },
          {
            q: 'Can I transfer calculated route distances directly into this trip planner?',
            a: 'Yes! When you calculate driving routes in our Driving Route & Distance Calculator, clicking "Open in Trip Cost Splitter" automatically pre-fills your exact driving mileage and MPG into this planner.'
          },
          {
            q: 'How do highway tolls affect the total cost of a road trip?',
            a: 'Turnpikes and bridge tolls (such as across the Northeast corridor or Florida turnpikes) can add $30 to $100+ to a single road trip. Always verify toll transponder rates (E-ZPass, SunPass, FasTrak) which are typically 25% to 50% cheaper than pay-by-mail toll rates.'
          },
          {
            q: 'Does this calculator support international metric units and currencies?',
            a: 'Yes. You can switch between US Customary ($ USD, miles, gallons) and Metric (€ EUR, £ GBP, CA$, A$, kilometers, liters) using the unit and currency controls in the top navigation bar.'
          }
        ]}
        relatedCalculators={[
          { id: 'route', title: 'Driving Route & Distance', description: 'Calculate exact GPS driving distance, route polyline, and multi-stop waypoints.', icon: MapPin },
          { id: 'mileage', title: 'Gas Mileage & Odometer', description: 'Determine vehicle fuel economy (MPG) from full-tank odometer readings.', icon: Fuel },
          { id: 'ev', title: 'EV vs Gas Comparison', description: 'Compare travel costs between traditional gas cars and electric vehicles.', icon: Zap },
        ]}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
}
