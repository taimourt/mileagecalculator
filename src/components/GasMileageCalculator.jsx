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
  ArrowRight,
  Copy,
  Check,
  AlertTriangle,
  Share2,
  Compass,
  Zap,
  Repeat
} from 'lucide-react';
import { calculateGasMileage } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';
import CalculatorEducationalSection from './common/CalculatorEducationalSection';

export default function GasMileageCalculator({
  unitSystem = 'us',
  setUnitSystem,
  currency = 'USD',
  onSaveHistory,
  onNavigateTab,
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

  // Copy feedback state
  const [copied, setCopied] = useState(false);

  // Metric unit defaults helper
  const handleUnitSwitch = (newUnit) => {
    if (setUnitSystem) setUnitSystem(newUnit);
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

  // Validation
  const odoError = useMemo(() => {
    if (calcMode === 'odometer' && currentOdo && previousOdo) {
      if (parseFloat(currentOdo) <= parseFloat(previousOdo)) {
        return 'Current odometer must be greater than previous odometer reading.';
      }
    }
    return null;
  }, [calcMode, currentOdo, previousOdo]);

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

  const handleReset = () => {
    if (unitSystem === 'metric') {
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

  const handleClear = () => {
    setCurrentOdo('');
    setPreviousOdo('');
    setDirectDistance('');
    setGasAdded('');
    setGasPrice('');
  };

  const handleCopySummary = () => {
    if (!calculation) return;
    const summary = `Gas Mileage Calculation Summary:\nDistance Traveled: ${formatNumber(calculation.distanceTraveled, 1)} ${unitSystem === 'us' ? 'miles' : 'km'}\nFuel Economy: ${formatNumber(calculation.mpgUS, 2)} US MPG (${formatNumber(calculation.lPer100km, 2)} L/100km)\nFuel Cost: ${formatCurrency(calculation.totalFuelCost, currency)}\nCost Per Mile: ${formatCurrency(calculation.costPerMile, currency)}/mi\nCalculated on MileageCalculatorPro.com`;
    
    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
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
    <div className="space-y-8">
      {/* Primary Calculator Interface Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        
        {/* Title & Unit Switcher Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
              <Fuel className="w-3.5 h-3.5" />
              Full-Tank Odometer & Economy Method
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Gas Mileage & Fuel Economy Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Accurately determine vehicle gas mileage (US MPG, UK MPG, L/100km, km/L), fuel unit cost, and cost per mile from full-tank odometer readings or trip distance.
            </p>
          </div>

          {/* Unit selector buttons */}
          <div className="flex items-center gap-1.5 flex-wrap">
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
              Metric (L/100km)
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
              UK Imperial
            </button>
          </div>
        </div>

        {/* Form and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          
          {/* Inputs Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Mode Switcher */}
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

            {/* Validation warning */}
            {odoError && (
              <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{odoError}</span>
              </div>
            )}

            {/* Inputs depending on mode */}
            {calcMode === 'odometer' ? (
              <>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Current Odometer Reading ({distanceUnit}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={currentOdo}
                    onChange={(e) => setCurrentOdo(e.target.value)}
                    placeholder="e.g. 12360"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Odometer reading at the recent full fill-up</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Previous Odometer Reading ({distanceUnit}) *
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={previousOdo}
                    onChange={(e) => setPreviousOdo(e.target.value)}
                    placeholder="e.g. 12000"
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">Odometer reading at previous fill-up</p>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                  Trip Distance Traveled ({distanceUnit}) *
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={directDistance}
                  onChange={(e) => setDirectDistance(e.target.value)}
                  placeholder="e.g. 360"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">Distance logged on your trip odometer</p>
              </div>
            )}

            {/* Fuel Added */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Fuel Added to Tank ({volumeUnit}) *
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={gasAdded}
                onChange={(e) => setGasAdded(e.target.value)}
                placeholder="e.g. 15"
                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">Volume from the gas pump receipt</p>
            </div>

            {/* Fuel Price */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Fuel Price Per {unitSystem === 'metric' ? 'Liter' : 'Gallon'} ({currency})
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={gasPrice}
                  onChange={(e) => setGasPrice(e.target.value)}
                  placeholder="e.g. 3.50"
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Optional: calculates total cost and cost-per-mile</p>
            </div>

            {/* Action Buttons: Reset & Clear */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs font-bold text-slate-500 dark:text-slate-400 transition"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Results Column (7 cols) */}
          <div className="lg:col-span-7">
            {calculation ? (
              <div className="space-y-4">
                
                {/* Hero Metric Banner */}
                <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                      Calculated Fuel Economy
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${calculation.rating.color}`}>
                      {calculation.rating.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                        {formatNumber(calculation.mpgUS, 2)}
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                        US Miles Per Gallon (MPG)
                      </div>
                    </div>
                    <div>
                      <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                        {formatNumber(calculation.lPer100km, 2)}
                      </div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-0.5">
                        Liters / 100 Kilometers
                      </div>
                    </div>
                  </div>

                  {/* Summary metrics row */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-200/80 dark:border-slate-700 text-xs font-medium">
                    <div>
                      <span className="text-slate-400 block">Distance Accrued</span>
                      <strong className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                        {formatNumber(calculation.distanceTraveled, 1)} {distanceUnit}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Total Fill Cost</span>
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

                  {/* Copy & Save Actions */}
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
                      onClick={handleSaveToHistory}
                      className="py-2 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-sm"
                    >
                      <Bookmark className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Save to History</span>
                    </button>
                  </div>
                </div>

                {/* International Conversion Matrix */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
                  <div className="bg-slate-50 dark:bg-slate-900 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300">
                    Comprehensive Fuel Economy Units Matrix
                  </div>
                  <table className="w-full text-xs text-left">
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2 font-medium text-slate-500">US Miles Per Gallon</td>
                        <td className="px-4 py-2 font-bold text-slate-900 dark:text-white text-right">
                          {formatNumber(calculation.mpgUS, 2)} MPG
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2 font-medium text-slate-500">UK Imperial MPG</td>
                        <td className="px-4 py-2 font-bold text-slate-900 dark:text-white text-right">
                          {formatNumber(calculation.mpgUK, 2)} MPG (UK)
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2 font-medium text-slate-500">Liters per 100 Kilometers</td>
                        <td className="px-4 py-2 font-bold text-slate-900 dark:text-white text-right">
                          {formatNumber(calculation.lPer100km, 2)} L/100km
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2 font-medium text-slate-500">Kilometers per Liter</td>
                        <td className="px-4 py-2 font-bold text-slate-900 dark:text-white text-right">
                          {formatNumber(calculation.kmPerLiter, 2)} km/L
                        </td>
                      </tr>
                      <tr className="bg-white dark:bg-slate-800">
                        <td className="px-4 py-2 font-medium text-slate-500">Distance per $1.00 Fuel</td>
                        <td className="px-4 py-2 font-bold text-emerald-600 dark:text-emerald-400 text-right">
                          {formatNumber(calculation.milesPerDollar, 2)} miles / $ ({formatNumber(calculation.kmPerDollar, 2)} km / $)
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 text-center rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                <Gauge className="w-12 h-12 text-slate-300 dark:text-slate-600 mb-3" />
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-300">
                  Enter Your Odometer or Trip Distance
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Fill in your previous & current odometer readings and fuel pumped to instantly calculate vehicle MPG and fuel expenditure.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 3: Comprehensive Educational Section */}
      <CalculatorEducationalSection
        title="Gas Mileage & Fuel Economy Calculator"
        whatIsIt="The Gas Mileage & Fuel Economy Calculator provides verified vehicle fuel consumption calculations. Using the industry-standard full-tank odometer method, it computes your vehicle's actual real-world Miles Per Gallon (US and UK Imperial), Liters per 100 Kilometers (L/100km), cost per mile, and cost per kilometer. It is ideal for drivers checking engine efficiency, tracking fuel budgets, and identifying performance drops due to tire pressure or maintenance issues."
        howToUse={[
          'Fill your vehicle tank to full at the gas station and note your starting odometer reading (or reset your trip meter).',
          'Drive normally until your next fuel stop, then fill your tank completely to full again.',
          'Input your new odometer and previous odometer numbers, plus the exact gallons or liters pumped from the receipt.',
        ]}
        formula={
`// 1. Distance Traveled
Distance (miles or km) = Current Odometer − Previous Odometer

// 2. US Miles Per Gallon
US MPG = Distance Traveled (miles) ÷ Fuel Consumed (US Gallons)

// 3. Liters per 100 Kilometers
L/100km = (Fuel Consumed in Liters ÷ Distance in Kilometers) × 100
Conversion: L/100km = 235.215 ÷ US MPG

// 4. Cost Per Mile
Cost Per Mile = Total Fuel Cost ÷ Distance Traveled (miles)`
        }
        example={{
          scenario: 'A commuter fills up their tank with 14.50 gallons of gasoline at $3.60 per gallon after driving from odometer 45,200 to 45,606 miles.',
          inputs: ['Current Odometer: 45,606 miles', 'Previous Odometer: 45,200 miles', 'Gas Added: 14.50 gallons', 'Fuel Price: $3.60 / gallon'],
          results: ['Distance Accrued: 406.0 miles', 'Gas Mileage: 28.00 US MPG', 'Metric Equivalent: 8.40 L/100km', 'Total Fill Expense: $52.20', 'Cost Per Mile: $0.129 / mile']
        }}
        understandingResults={[
          { term: 'US MPG', definition: 'The distance in miles your vehicle travels per US liquid gallon of gasoline (3.785 Liters).' },
          { term: 'L/100km', definition: 'The standard European metric representation showing fuel volume consumed per 100 kilometers traveled. Lower numbers mean higher fuel economy.' },
          { term: 'Cost Per Mile', definition: 'The direct fuel expense required to propel your vehicle one single mile at current gas prices.' },
          { term: 'Miles Per Dollar', definition: 'How many miles you can travel for every $1.00 spent on gasoline. Higher numbers represent greater financial efficiency.' },
        ]}
        factors={[
          'Tire Pressure: Underinflated tires can reduce fuel economy by up to 0.2% per 1 PSI drop across all four tires.',
          'Aerodynamic Drag: Fuel consumption increases exponentially at highway speeds above 55 mph (90 km/h).',
          'Aggressive Acceleration: Rapid starts and hard braking lower gas mileage by 15% to 30% at highway speeds.',
          'Cargo & Roof Racks: Extra weight and exterior accessories dramatically increase rolling resistance and wind drag.',
          'Air Conditioning & Heating: Running cabin climate control at full blast increases engine fuel draw by 5% to 10%.',
        ]}
        faqs={[
          {
            q: 'Why is the full-tank method more accurate than car dashboard trip computers?',
            a: 'Dashboard fuel economy displays calculate estimated MPG using fuel injector pulse widths and wheel speed sensors, which can drift by 3% to 7% over time. The full-tank receipt method measures actual physical fuel volume pumped into the fuel tank against true odometer distance, providing true real-world consumption.'
          },
          {
            q: 'What is the difference between US MPG and UK Imperial MPG?',
            a: 'One UK Imperial Gallon equals 4.546 Liters, whereas one US Gallon equals 3.785 Liters. Consequently, a UK gallon is approximately 20.1% larger than a US gallon. A car that achieves 30.0 US MPG will register as 36.03 UK MPG for the exact same physical fuel economy.'
          },
          {
            q: 'Why is a 10 MPG improvement from 15 to 25 MPG more valuable than from 35 to 45 MPG?',
            a: 'This is the well-documented "MPG Illusion". Because MPG is an inverse curve, improving from 15 to 25 MPG saves 2.67 gallons every 100 miles ($9.60 saved at $3.60/gal). In contrast, improving from 35 to 45 MPG saves only 0.63 gallons every 100 miles ($2.27 saved). The volume metric (L/100km) makes this linear relationship immediate.'
          },
          {
            q: 'How does winter weather impact fuel economy?',
            a: 'In cold temperatures, engine oil is more viscous, fuel atomizes less efficiently, tire pressure drops naturally with temperature, and winter-blend gasoline contains slightly less energy per gallon (higher butane content), reducing fuel economy by 10% to 20% in freezing weather.'
          },
          {
            q: 'Can I use this calculator for diesel, hybrid, or E85 flex-fuel vehicles?',
            a: 'Yes. The full-tank mathematical relationship (Distance ÷ Volume) applies universally across diesel, gasoline, E85, and hybrid combustion engines regardless of octane or fuel blend.'
          }
        ]}
        relatedCalculators={[
          { id: 'trip', title: 'Road Trip Cost Splitter', description: 'Estimate total fuel expenses and split budgets evenly among passengers.', icon: Compass },
          { id: 'ev', title: 'EV vs Gas Comparison', description: 'Compare cost per mile and 5-year savings between gas cars and electric vehicles.', icon: Zap },
          { id: 'convert', title: 'Unit & Ratio Converter', description: 'Instant two-way conversions between US MPG, UK Imperial, L/100km, and km/L.', icon: Repeat },
        ]}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
}
