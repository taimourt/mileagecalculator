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
  Briefcase
} from 'lucide-react';
import { IRS_RATES, calculateReimbursement } from '../utils/calculations';
import { formatCurrency, formatNumber } from '../utils/formatters';

const SAMPLE_LOGS = [
  { id: 1, date: '2026-03-02', purpose: 'Client Meeting - Acme Corp', from: 'Office HQ', to: 'Downtown Plaza', miles: 28.5, category: 'Business' },
  { id: 2, date: '2026-03-05', purpose: 'Product Delivery & Setup', from: 'Warehouse', to: 'Client Site B', miles: 42.0, category: 'Business' },
  { id: 3, date: '2026-03-08', purpose: 'Regional Sales Conference', from: 'Home', to: 'Convention Center', miles: 64.0, category: 'Business' },
  { id: 4, date: '2026-03-12', purpose: 'Charity Food Drive Volunteering', from: 'Home', to: 'Community Pantry', miles: 18.0, category: 'Charitable' },
];

export default function BusinessReimbursementCalculator({
  unitSystem = 'us',
  currency = 'USD',
  onSaveHistory,
}) {
  const [selectedYear, setSelectedYear] = useState('2026');
  const [rateType, setRateType] = useState('business');
  const [customRate, setCustomRate] = useState(0.67);
  const [taxBracket, setTaxBracket] = useState(24);

  // Logbook entries
  const [trips, setTrips] = useState(SAMPLE_LOGS);

  // New trip modal/row inputs
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0]);
  const [newPurpose, setNewPurpose] = useState('');
  const [newFrom, setNewFrom] = useState('');
  const [newTo, setNewTo] = useState('');
  const [newMiles, setNewMiles] = useState('');
  const [newCategory, setNewCategory] = useState('Business');

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
    const cRate = rates.charity;
    const mRate = rates.medical;

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
    if (!newMiles || parseFloat(newMiles) <= 0) return;

    const newEntry = {
      id: Date.now(),
      date: newDate || new Date().toISOString().split('T')[0],
      purpose: newPurpose || 'Business Travel',
      from: newFrom || 'Start',
      to: newTo || 'Destination',
      miles: parseFloat(newMiles),
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
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              IRS Form 2106 / Schedule C Tax Deduction
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              IRS Business Mileage Reimbursement Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Calculate standard IRS tax write-offs, log individual trips, track deductible business mileage, and generate exportable expense sheets.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV Log
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
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
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
              Mileage Category Rate
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
                  step="0.01"
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
              Marginal Tax Bracket (Savings Est.)
            </label>
            <select
              value={taxBracket}
              onChange={(e) => setTaxBracket(parseInt(e.target.value) || 24)}
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="12">12% Tax Bracket</option>
              <option value="22">22% Tax Bracket</option>
              <option value="24">24% Tax Bracket (Standard)</option>
              <option value="32">32% Tax Bracket</option>
              <option value="35">35% Tax Bracket</option>
              <option value="37">37% Highest Bracket</option>
            </select>
          </div>
        </div>

        {/* Big Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-lg shadow-emerald-500/20">
            <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-100">
              Total Mileage Reimbursement
            </span>
            <div className="text-3xl sm:text-4xl font-black mt-1">
              {formatCurrency(totals.totalReimbursement, currency)}
            </div>
            <div className="text-xs text-emerald-100 mt-2 font-medium">
              Based on {formatNumber(totals.totalMiles, 1)} total miles logged
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Estimated Tax Write-Off Savings
            </span>
            <div className="text-3xl sm:text-4xl font-black text-emerald-400 mt-1">
              {formatCurrency(totals.taxSavings, currency)}
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">
              At your {taxBracket}% tax bracket
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
              Active Rate Per Mile
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
              {formatCurrency(activeRate, currency)}
              <span className="text-sm font-semibold text-slate-400 ml-1">/ mi</span>
            </div>
            <div className="text-xs text-slate-400 mt-2 font-medium">
              {rateType.toUpperCase()} standard deduction
            </div>
          </div>
        </div>

        {/* Trip Logbook Table */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              Detailed Mileage Logbook ({trips.length} entries)
            </h3>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Purpose / Client</th>
                  <th className="px-4 py-3">From ➔ To</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3 text-right">Miles</th>
                  <th className="px-4 py-3 text-right">Reimbursement</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                {trips.map((t) => {
                  const rate = t.category === 'Business' ? activeRate : (t.category === 'Charitable' ? 0.14 : 0.21);
                  const amount = t.miles * rate;
                  return (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{t.date}</td>
                      <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{t.purpose}</td>
                      <td className="px-4 py-3 text-slate-500 dark:text-slate-400">{t.from} ➔ {t.to}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.category === 'Business'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}>
                          {t.category}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-extrabold text-slate-900 dark:text-white text-right">
                        {formatNumber(t.miles, 1)} mi
                      </td>
                      <td className="px-4 py-3 font-extrabold text-emerald-600 dark:text-emerald-400 text-right">
                        {formatCurrency(amount, currency)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteTrip(t.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
                          title="Delete entry"
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

          {/* Add Trip Form */}
          <form onSubmit={handleAddTrip} className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              + Add New Mileage Trip Entry
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-6 gap-2">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
              />
              <input
                type="text"
                placeholder="Purpose (e.g. Client Demo)"
                value={newPurpose}
                onChange={(e) => setNewPurpose(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
              />
              <input
                type="text"
                placeholder="From (e.g. Office)"
                value={newFrom}
                onChange={(e) => setNewFrom(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
              />
              <input
                type="text"
                placeholder="To (e.g. Airport)"
                value={newTo}
                onChange={(e) => setNewTo(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Miles"
                value={newMiles}
                onChange={(e) => setNewMiles(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                required
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

