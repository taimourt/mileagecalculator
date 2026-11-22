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
import CalculatorEducationalSection from './common/CalculatorEducationalSection';

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

      {/* Comprehensive Educational Guide */}
      <CalculatorEducationalSection
        title="Mileage, Fuel Economy & Ratio Unit Converter"
        whatIsIt="The Mileage, Fuel Economy & Ratio Unit Converter provides verified conversions between imperial, US customary, and SI metric measurement systems. It supports distance conversions (Miles, Kilometers, Nautical Miles, Feet), fuel economy transformations (US MPG, Imperial UK MPG, L/100km, km/L), and 2-stroke small-engine oil-gas premix ratios."
        howToUse={[
          'Enter any value into the Distance box to convert between Miles, km, NM, and feet.',
          'Input your vehicle’s fuel efficiency into the Fuel Economy box to see exact US MPG, Imperial MPG, and L/100km equivalents.',
          'Use the 2-Cycle Oil Premix tool by selecting gas volume and fuel ratio (e.g., 50:1 or 40:1) to get exact oil fluid ounces.'
        ]}
        formula={`\\text{Miles to Kilometers:} \\quad \\text{km} = \\text{miles} \\times 1.609344

\\text{US MPG to L/100km:} \\quad \\text{L/100km} = \\frac{235.214583}{\\text{US MPG}}

\\text{Imperial UK MPG to US MPG:} \\quad \\text{US MPG} = \\frac{\\text{UK MPG}}{1.20095}

\\text{2-Stroke Oil Fluid Ounces:} \\quad \\text{Oil (fl oz)} = \\frac{\\text{Gas Gallons} \\times 128}{\\text{Mix Ratio}}`}
        example={{
          description: 'Converting a 30.0 US MPG vehicle rating to European metric L/100km and UK Imperial MPG:',
          inputs: [
            { label: 'Input Fuel Economy', value: '30.0 US Miles Per Gallon' },
            { label: 'Conversion Factor', value: '235.214583 (constant for US Gallons to L/100km)' }
          ],
          steps: [
            'L/100km Calculation: 235.214583 ÷ 30.0 = 7.8405 L/100km.',
            'UK Imperial MPG Calculation: 30.0 × 1.20095 = 36.03 Imperial MPG.',
            'Kilometers Per Liter: 30.0 × 0.425144 = 12.75 km/L.'
          ],
          result: '30.0 US MPG = 7.84 L/100km = 36.03 UK Imperial MPG = 12.75 km/L.'
        }}
        understandingResults={[
          { label: 'US MPG vs Imperial UK MPG', desc: 'A UK Imperial Gallon is 20% larger than a US Gallon (4.546 liters vs 3.785 liters), meaning a car tested in the UK appears to get 20% higher numerical MPG for identical physical fuel efficiency.' },
          { label: 'Inverse Relationship of L/100km', desc: 'Unlike MPG where higher is better, in L/100km lower is better. An improvement from 20 to 10 L/100km cuts fuel consumption in half.' },
          { label: '2-Stroke Ratio Accuracy', desc: 'Precision oil measurements protect 2-cycle cylinder walls and piston rings from scoring while avoiding excess exhaust smoke.' }
        ]}
        factors={[
          { name: 'US vs Imperial Liquid Measures', impact: '1 US fluid ounce is 29.5735 ml, while 1 UK fluid ounce is 28.4131 ml. Using correct regional units is vital when ordering engine lubricants.' },
          { name: 'The MPG Illusion', impact: 'Replacing a 10 MPG vehicle with a 15 MPG vehicle saves 3.3 gallons every 100 miles. Replacing a 30 MPG car with a 50 MPG car saves only 1.3 gallons. L/100km reveals this directly.' },
          { name: 'Nautical vs Statute Conversions', impact: '1 Nautical Mile (1,852 m) is approximately 1.1508 statute miles. Using statute miles for marine or air navigation results in a 13% underestimation of voyage distance.' }
        ]}
        faqs={[
          {
            q: 'Why does Canada use L/100km instead of km/L?',
            a: 'Canada, Europe, Australia, and New Zealand standardized on Liters per 100 Kilometers because it measures fuel consumption (volume per distance) rather than fuel economy (distance per volume), which scales linearly with cost and greenhouse emissions.'
          },
          {
            q: 'How many fluid ounces of 2-stroke oil are needed for 5 gallons of gas at 50:1?',
            a: '5 gallons contains 640 fluid ounces (5 × 128). Dividing 640 by 50 yields exactly 12.8 fluid ounces of 2-cycle oil.'
          },
          {
            q: 'Is a British mile longer than an American mile?',
            a: 'No. Both the United States and the United Kingdom signed the 1959 International Yard and Pound Agreement, establishing that one international statute mile is exactly 1,609.344 meters in both countries.'
          }
        ]}
        relatedCalculators={[
          { id: 'mileage', name: 'Gas Mileage Calculator', desc: 'Calculate tank MPG and fuel cost per mile' },
          { id: 'trip', name: 'Road Trip Cost Splitter', desc: 'Calculate multi-stop highway expenses' },
          { id: 'measure', name: 'Map Distance Tool', desc: 'Measure distance across interactive maps' }
        ]}
        relatedGuides={[
          { id: 'miles-vs-kilometers-understanding-distance-units', title: 'Miles vs Kilometers', desc: 'Mathematical foundations and Fibonacci mental math' },
          { id: 'mpg-vs-gpm', title: 'MPG vs GPM: The MPG Illusion', desc: 'Why Gallons Per Mile fixes deceptive fuel efficiency metrics' }
        ]}
      />
    </div>
  );
}

