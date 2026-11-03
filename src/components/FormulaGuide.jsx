import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Gauge, 
  DollarSign, 
  ShieldCheck, 
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function FormulaGuide() {
  const [openSection, setOpenSection] = useState('mpg');

  const toggleSection = (id) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors mt-8">
      <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-700/60">
        <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 flex items-center justify-center">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Formulas, Calculation Methodology & Mileage Guide
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Full mathematical derivations and government standards powering this calculator
          </p>
        </div>
      </div>

      <div className="space-y-3 pt-6">
        {/* Section 1: Gas Mileage & Odometer Formulas */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('mpg')}
            className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-left transition"
          >
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-600" />
              1. Gas Mileage (MPG) & Fuel Economy Formulas
            </span>
            {openSection === 'mpg' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'mpg' && (
            <div className="p-5 text-xs text-slate-600 dark:text-slate-400 space-y-3 bg-white dark:bg-slate-800">
              <p>
                The standard full-tank method is the most reliable way to calculate real-world vehicle gas mileage:
              </p>
              
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl font-mono text-slate-800 dark:text-slate-200 space-y-1">
                <div>Distance Traveled = Current Odometer − Previous Odometer</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Miles Per Gallon (US MPG) = Distance Traveled (miles) ÷ Gallons Added
                </div>
                <div>L/100 km = (Liters Used ÷ Kilometers Traveled) × 100</div>
                <div>Kilometers per Liter (km/L) = Kilometers Traveled ÷ Liters Used</div>
              </div>

              <div className="pt-1">
                <span className="font-bold text-slate-700 dark:text-slate-300">Conversion between MPG and L/100km:</span>
                <p className="mt-0.5">
                  Because US MPG represents distance per volume while L/100km represents volume per distance, their relationship is inverse:
                </p>
                <div className="p-2 bg-slate-100 dark:bg-slate-900 rounded-lg font-mono text-[11px] mt-1 text-slate-700 dark:text-slate-300">
                  L/100 km = 235.214 ÷ US MPG &nbsp;|&nbsp; US MPG = 235.214 ÷ (L/100 km)
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Section 2: Unit Fuel Cost & Trip Cost */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('cost')}
            className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-left transition"
          >
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              2. Unit Fuel Cost & Cost-Per-Mile Calculations
            </span>
            {openSection === 'cost' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'cost' && (
            <div className="p-5 text-xs text-slate-600 dark:text-slate-400 space-y-3 bg-white dark:bg-slate-800">
              <p>
                To know how much money you spend per mile or kilometer driven:
              </p>
              <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl font-mono text-slate-800 dark:text-slate-200 space-y-1">
                <div>Cost Per Mile ($/mi) = Fuel Price per Gallon ÷ Vehicle MPG</div>
                <div>Miles Per Dollar ($1) = Vehicle MPG ÷ Fuel Price per Gallon</div>
                <div className="text-emerald-600 dark:text-emerald-400 font-bold">
                  Total Trip Cost = (Distance ÷ MPG × Gas Price) + Tolls + Parking + Lodging + Food
                </div>
                <div>Per Person Share = Total Trip Cost ÷ Number of Passengers</div>
              </div>
            </div>
          )}
        </div>

        {/* Section 3: IRS Rules & Deduction Rates */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('irs')}
            className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-left transition"
          >
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Official IRS Mileage Standard Rates (2024 - 2026)
            </span>
            {openSection === 'irs' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'irs' && (
            <div className="p-5 text-xs text-slate-600 dark:text-slate-400 space-y-3 bg-white dark:bg-slate-800">
              <p>
                The Internal Revenue Service (IRS) establishes standard mileage rates annually to calculate deductible costs of operating an automobile for business, charitable, or medical purposes:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">2026 Standard</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">$0.70 / mile</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Projected cost-of-fuel inflation adjustment</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">2025 Standard</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">$0.685 / mile</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Official IRS baseline rate</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                  <span className="font-bold text-slate-900 dark:text-white block">2024 Standard</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-black text-base">$0.67 / mile</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">Official IRS Notice 2024-08</p>
                </div>
              </div>

              <div className="text-slate-500 text-[11px] pt-1">
                <strong>IRS Recordkeeping Tip:</strong> To qualify for mileage deductions, maintain a timely written log containing the trip date, destination, business purpose, and total miles driven.
              </div>
            </div>
          )}
        </div>

        {/* Section 4: Practical Tips to Improve MPG */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
          <button
            type="button"
            onClick={() => toggleSection('tips')}
            className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 text-left transition"
          >
            <span className="font-bold text-sm text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Zap className="w-4 h-4 text-emerald-600" />
              4. Proven Strategies to Increase Vehicle Fuel Economy
            </span>
            {openSection === 'tips' ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {openSection === 'tips' && (
            <div className="p-5 text-xs text-slate-600 dark:text-slate-400 space-y-2.5 bg-white dark:bg-slate-800">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Maintain Proper Tire Pressure:</strong> Under-inflated tires increase rolling resistance, reducing fuel economy by up to 3%.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Moderate Highway Speeds:</strong> Driving at 65 mph rather than 75-80 mph can save 10% to 15% on gasoline due to exponential aerodynamic drag.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Avoid Aggressive Acceleration & Braking:</strong> Smooth driving can improve highway gas mileage by 15% to 30%.
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 dark:text-slate-200">Remove Excess Cargo & Roof Racks:</strong> An extra 100 pounds of weight reduces fuel economy by roughly 1%.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

