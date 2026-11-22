import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Download, 
  DollarSign, 
  CheckCircle, 
  Calculator,
  ShieldCheck,
  Building,
  Heart,
  Briefcase,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  Compass,
  Fuel,
  Zap
} from 'lucide-react';
import { IRS_RATES, calculateReimbursement } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';
import CalculatorEducationalSection from './common/CalculatorEducationalSection';

const DEFAULT_SAMPLE_LOGS = [
  { id: 1, date: '2026-03-02', purpose: 'Client Meeting - Acme Corp', from: 'Office HQ', to: 'Downtown Plaza', miles: 28.5, category: 'Business' },
  { id: 2, date: '2026-03-05', purpose: 'Product Delivery & Setup', from: 'Warehouse', to: 'Client Site B', miles: 42.0, category: 'Business' },
  { id: 3, date: '2026-03-08', purpose: 'Regional Sales Conference', from: 'Home', to: 'Convention Center', miles: 64.0, category: 'Business' },
  { id: 4, date: '2026-03-12', purpose: 'Charity Food Drive Volunteering', from: 'Home', to: 'Community Pantry', miles: 18.0, category: 'Charitable' },
];

export default function BusinessReimbursementCalculator({
  unitSystem = 'us',
  currency = 'USD',
  onSaveHistory,
  onNavigateTab,
}) {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [rateType, setRateType] = useState('business');
  const [customRate, setCustomRate] = useState(0.67);
  const [taxBracket, setTaxBracket] = useState(24);

  // Logbook entries
  const [trips, setTrips] = useState(DEFAULT_SAMPLE_LOGS);

  // New trip row inputs
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPurpose, setNewPurpose] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newMiles, setNewMiles] = useState('');
  const [newCategory, setNewCategory] = useState('Business');

  // Copy feedback state
  const [copied, setCopied] = useState(false);
  const [tripError, setTripError] = useState('');

  // Determine active rate per mile
  const activeRate = useMemo(() => {
    if (rateType === 'custom') return parseFloat(customRate) || 0;
    const yearRates = IRS_RATES[selectedYear] || IRS_RATES['2024'];
    return yearRates[rateType] || 0.67;
  }, [selectedYear, rateType, customRate]);

  // Aggregate stats
  const totals = useMemo(() => {
    let totalMiles = 0;
    let businessMiles = 0;
    let charityMiles = 0;
    let medicalMiles = 0;

    trips.forEach(t => {
      const m = parseFloat(t.miles) || 0;
      totalMiles += m;
      if (t.category === 'Business') businessMiles += m;
      else if (t.category === 'Charitable') charityMiles += m;
      else if (t.category === 'Medical') medicalMiles += m;
    });

    const rates = IRS_RATES[selectedYear] || IRS_RATES['2024'];
    const bRate = rateType === 'custom' ? customRate : rates.business;
    const cRate = rates.charity || 0.14;
    const mRate = rates.medical || 0.21;

    const totalReimbursement = (businessMiles * bRate) + (charityMiles * cRate) + (medicalMiles * mRate);
    const taxSavings = (totalReimbursement * taxBracket) / 100;

    return {
      totalMiles,
      businessMiles,
      charityMiles,
      medicalMiles,
      totalReimbursement,
      taxSavings,
    };
  }, [trips, selectedYear, rateType, customRate, taxBracket]);

  const handleAddTrip = (e) => {
    e.preventDefault();
    const milesNum = parseFloat(newMiles);
    if (isNaN(milesNum) || milesNum <= 0) {
      setTripError('Please enter a valid positive number of miles.');
      return;
    }

    setTripError('');
    const newEntry = {
      id: Date.now(),
      date: newDate || new Date().toISOString().split('T')[0],
      purpose: newPurpose.trim() || 'Business Trip',
      from: newFrom.trim() || 'Origin',
      to: newTo.trim() || 'Destination',
      miles: milesNum,
      category: newCategory,
    };

    setTrips([...trips, newEntry]);
    setNewPurpose('');
    setNewFrom('');
    setNewTo('');
    setNewMiles('');
  };

  const handleDeleteTrip = (id) => {
    setTrips(trips.filter(t => t.id !== id));
  };

  const handleResetTrips = () => {
    setTrips(DEFAULT_SAMPLE_LOGS);
    setSelectedYear('2026');
    setRateType('business');
    setCustomRate(0.67);
    setTaxBracket(24);
  };

  const handleClearAllTrips = () => {
    setTrips([]);
  };

  const handleCopySummary = () => {
    const summary = `IRS Mileage Reimbursement Summary:\nTax Year: ${selectedYear}\nTotal Miles: ${formatNumber(totals.totalMiles, 1)} miles (${formatNumber(totals.businessMiles, 1)} Business)\nTotal Estimated Deduction: ${formatCurrency(totals.totalReimbursement, currency)}\nEstimated Tax Savings (${taxBracket}% bracket): ${formatCurrency(totals.taxSavings, currency)}\nGenerated on MileageCalculatorPro.com`;

    navigator.clipboard.writeText(summary).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  const handleExportCsv = () => {
    const headers = ['Date', 'Purpose / Client', 'From', 'To', 'Miles', 'Category', 'Reimbursement Rate', 'Total Claim ($)'];
    const rows = trips.map(t => {
      const rate = t.category === 'Business' ? activeRate : (t.category === 'Charitable' ? 0.14 : 0.21);
      const claim = (t.miles * rate).toFixed(2);
      return [
        t.date,
        `"${t.purpose}"`,
        `"${t.from}"`,
        `"${t.to}"`,
        t.miles,
        t.category,
        `$${rate.toFixed(3)}`,
        `$${claim}`
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IRS_Mileage_Log_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Primary Calculator Card */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              IRS Form 2106 / Schedule C Tax Deduction Logbook
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              IRS Business Mileage Reimbursement Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Calculate standard IRS tax write-offs, log individual trips, track deductible business mileage, and generate exportable expense sheets with official IRS rates (2019–2026).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              title="Download spreadsheet log for accounting"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV Log</span>
            </button>
          </div>
        </div>

        {/* IRS Standard Rates Selector Bar */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Rate Year */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Tax Year & IRS Period (2019 – 2026 Archive)
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="2026">2026 (Projected Standard: $0.70/mi)</option>
              <option value="2025">2025 (Official IRS Rate: $0.685/mi)</option>
              <option value="2024">2024 (Official IRS Rate: $0.67/mi)</option>
              <option value="2023">2023 (Official IRS Rate: $0.655/mi)</option>
              <option value="2022-h2">2022 Jul-Dec (Mid-year spike: $0.625/mi)</option>
              <option value="2022-h1">2022 Jan-Jun (Standard: $0.585/mi)</option>
              <option value="2021">2021 (Official IRS Rate: $0.56/mi)</option>
              <option value="2020">2020 (Official IRS Rate: $0.575/mi)</option>
              <option value="2019">2019 (Official IRS Rate: $0.58/mi)</option>
            </select>
          </div>

          {/* Rate Category */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Mileage Rate Type
            </label>
            <div className="grid grid-cols-3 gap-1">
              <button
                type="button"
                onClick={() => setRateType('business')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  rateType === 'business'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Business
              </button>
              <button
                type="button"
                onClick={() => setRateType('charity')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  rateType === 'charity'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Charity
              </button>
              <button
                type="button"
                onClick={() => setRateType('custom')}
                className={`py-1.5 text-xs font-bold rounded-lg transition ${
                  rateType === 'custom'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                Custom
              </button>
            </div>
            {rateType === 'custom' && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-slate-400">Rate:</span>
                <input
                  type="number"
                  step="0.005"
                  value={customRate}
                  onChange={(e) => setCustomRate(parseFloat(e.target.value) || 0)}
                  className="w-24 px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                />
                <span className="text-xs text-slate-400">$/mile</span>
              </div>
            )}
          </div>

          {/* Tax Bracket */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Federal Tax Bracket (Savings Est.)
            </label>
            <select
              value={taxBracket}
              onChange={(e) => setTaxBracket(parseInt(e.target.value) || 24)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="10">10% Bracket (Lower income)</option>
              <option value="12">12% Bracket</option>
              <option value="22">22% Bracket</option>
              <option value="24">24% Bracket (Typical standard)</option>
              <option value="32">32% Bracket</option>
              <option value="35">35% Bracket</option>
              <option value="37">37% Bracket (Top federal tier)</option>
            </select>
          </div>
        </div>

        {/* Hero Totals Banner */}
        <div className="mt-6 p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-purple-500/5 to-transparent border border-emerald-500/20 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Total Deductible Reimbursement
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
              {formatCurrency(totals.totalReimbursement, currency)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
              Schedule C / Form 2106 Eligible
            </div>
          </div>

          <div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Estimated Net Tax Savings
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400 mt-1">
              {formatCurrency(totals.taxSavings, currency)}
            </div>
            <div className="text-[11px] text-slate-400 font-medium mt-1">
              Based on your {taxBracket}% tax bracket
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-slate-500 flex justify-between">
              <span>Business Miles:</span>
              <strong className="text-slate-900 dark:text-white">{formatNumber(totals.businessMiles, 1)} mi</strong>
            </div>
            <div className="text-xs text-slate-500 flex justify-between">
              <span>Charity / Medical:</span>
              <strong className="text-slate-900 dark:text-white">{formatNumber(totals.charityMiles + totals.medicalMiles, 1)} mi</strong>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopySummary}
                className="py-1.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetTrips}
                className="py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 transition flex items-center gap-1"
                title="Restore default sample trips"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Trip Logbook Table */}
        <div className="mt-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Mileage Logbook Entries ({trips.length} logged)
            </h3>
            {trips.length > 0 && (
              <button
                type="button"
                onClick={handleClearAllTrips}
                className="text-xs text-rose-600 hover:underline font-semibold"
              >
                Clear All Entries
              </button>
            )}
          </div>

          {/* New Trip Input Row */}
          <form onSubmit={handleAddTrip} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
              + Add New Mileage Trip Entry
            </span>

            {tripError && (
              <p className="text-xs text-rose-600 font-bold">{tripError}</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-6 gap-2 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Date</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-slate-400 mb-1">Purpose / Client</label>
                <input
                  type="text"
                  placeholder="e.g. Client Consultation"
                  value={newPurpose}
                  onChange={(e) => setNewPurpose(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">From & To</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="From"
                    value={newFrom}
                    onChange={(e) => setNewFrom(e.target.value)}
                    className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                  />
                  <input
                    type="text"
                    placeholder="To"
                    value={newTo}
                    onChange={(e) => setNewTo(e.target.value)}
                    className="w-1/2 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Miles *</label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  placeholder="e.g. 24.5"
                  value={newMiles}
                  onChange={(e) => setNewMiles(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-semibold"
                >
                  <option value="Business">Business</option>
                  <option value="Charitable">Charitable</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>
            </div>

            <div className="pt-1 flex justify-end">
              <button
                type="submit"
                className="py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Trip to Log</span>
              </button>
            </div>
          </form>

          {/* Table */}
          <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-x-auto shadow-sm">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Business Purpose</th>
                  <th className="px-4 py-3">Route (From &rarr; To)</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Miles</th>
                  <th className="px-4 py-3 text-right">Deduction</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                {trips.map((t) => {
                  const rate = t.category === 'Business' ? activeRate : (t.category === 'Charitable' ? 0.14 : 0.21);
                  const claim = t.miles * rate;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition">
                      <td className="px-4 py-2.5 font-mono text-slate-500">{t.date}</td>
                      <td className="px-4 py-2.5 font-bold text-slate-800 dark:text-slate-200">{t.purpose}</td>
                      <td className="px-4 py-2.5 text-slate-500">{t.from} &rarr; {t.to}</td>
                      <td className="px-4 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.category === 'Business'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                            : t.category === 'Charitable'
                            ? 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300'
                        }`}>
                          {t.category}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-slate-900 dark:text-white">
                        {formatNumber(t.miles, 1)} mi
                      </td>
                      <td className="px-4 py-2.5 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {formatCurrency(claim, currency)}
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteTrip(t.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete trip entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Educational Section */}
      <CalculatorEducationalSection
        title="IRS Business Mileage Reimbursement Calculator"
        whatIsIt="The IRS Business Mileage Reimbursement Calculator simplifies tax deduction forecasting for self-employed individuals, independent contractors, 1099 freelancers, and business employees. Built around the official standard mileage rates published by the Internal Revenue Service under Revenue Procedure 2019-46, it enables users to substantiate vehicular tax write-offs on Schedule C (Line 9: Car and truck expenses) and export audit-ready CSV logs."
        howToUse={[
          'Select your tax year (2019 through 2026) to automatically apply the official IRS standard reimbursement rates.',
          'Add your driving records including trip dates, business clients or purpose, origin, destination, and miles driven.',
          'Choose your marginal federal income tax bracket to estimate true net cash tax savings.',
          'Export an audit-compliant CSV spreadsheet to furnish to your accountant or submit with your corporate expense reports.',
        ]}
        formula={
`// 1. Business Mileage Deduction
Total Deduction = Business Miles Driven × Official IRS Rate for Tax Year

// 2. Net Tax Savings Estimation
Net Tax Savings = Total Deduction × Marginal Tax Bracket Percentage

// 3. Official IRS Rate History
• 2026 (Projected): $0.700 / business mile
• 2025: $0.685 / business mile (Notice 2024-08)
• 2024: $0.670 / business mile
• 2023: $0.655 / business mile
• 2022 H2 (Jul 1 - Dec 31): $0.625 / business mile (Mid-year inflation adjustment)
• 2022 H1 (Jan 1 - Jun 30): $0.585 / business mile
• 2021: $0.560 / business mile`
        }
        example={{
          scenario: 'A freelance graphic designer logs 4,200 documented business miles in 2024 meeting clients and picking up materials. Their taxable income falls into the 24% marginal federal tax bracket.',
          inputs: ['Business Miles: 4,200 miles', 'IRS 2024 Rate: $0.67 per mile', 'Marginal Tax Bracket: 24%'],
          results: ['Total Schedule C Tax Deduction: $2,814.00', 'Net Federal Income Tax Savings: $675.36', 'Effective Deduction Rate: 67 cents/mile']
        }}
        understandingResults={[
          { term: 'Total Deductible Reimbursement', definition: 'The gross dollar amount you can write off against your self-employment income on IRS Form 1040 Schedule C.' },
          { term: 'Estimated Tax Savings', definition: 'The actual cash reduction in your federal tax bill, determined by multiplying the deduction by your marginal tax bracket.' },
          { term: 'Standard Rate vs Actual Expenses', definition: 'The IRS allows you to choose between the standard mileage rate or calculating actual expenses (gas, depreciation, insurance, repairs). The standard rate is significantly simpler to substantiate.' },
        ]}
        factors={[
          'Commuting Rule: Daily travel from your personal residence to a permanent main workplace is personal commuting and is NOT deductible.',
          'Temporary Work Locations: Driving from your home to an irregular, temporary client site is 100% tax-deductible.',
          'Substantiation Requirements: IRC § 274(d) requires contemporary records of trip date, destination, miles, and business purpose.',
          'Mid-Year Rate Adjustments: Rare economic events (such as the 2022 fuel spike) prompt mid-year IRS rate changes; always match the exact trip date to the corresponding rate period.',
        ]}
        faqs={[
          {
            q: 'Can W-2 employees claim the IRS mileage deduction on their federal tax return?',
            a: 'Under the Tax Cuts and Jobs Act (TCJA), unreimbursed employee expenses (including mileage) on Form 2106 are suspended through 2025 for most W-2 employees. However, employers can reimburse W-2 employees tax-free under an Accountable Plan, and self-employed 1099 contractors can fully claim mileage on Schedule C.'
          },
          {
            q: 'What records must I keep to survive an IRS mileage audit?',
            a: 'Under IRS Publication 463, an audit-proof mileage log must document: (1) Date of each trip, (2) Destination and starting address, (3) Specific business purpose, and (4) Odometer readings or trip mileage. Our CSV export tool is formatted to comply with these recordkeeping criteria.'
          },
          {
            q: 'Can gig economy drivers (Uber, Lyft, DoorDash) deduct miles while waiting for ride requests?',
            a: 'Yes! Driving while logged into the driver app waiting for ride requests or dispatch is legally recognized as deductible business mileage, in addition to miles driven with a passenger in the vehicle.'
          },
          {
            q: 'What is the charitable and medical mileage rate?',
            a: 'The charitable mileage rate is fixed by statutory law at 14 cents per mile. Medical and moving mileage (for active-duty military) is 21 cents per mile for 2024 and 2025.'
          }
        ]}
        relatedCalculators={[
          { id: 'route', title: 'Driving Route & Distance', description: 'Measure accurate highway miles and travel time between multiple addresses.', icon: Compass },
          { id: 'trip', title: 'Road Trip Cost Splitter', description: 'Calculate total fuel, tolls, and per-person cost shares for long trips.', icon: DollarSign },
          { id: 'ifta', title: 'Commercial Trucking (IFTA)', description: 'Multi-jurisdiction fuel tax reporting for interstate commercial motor carriers.', icon: Briefcase },
        ]}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
}
