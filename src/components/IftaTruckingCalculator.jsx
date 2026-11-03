import React, { useState, useMemo } from 'react';
import { 
  Truck, 
  Plus, 
  Trash2, 
  Download, 
  DollarSign, 
  Fuel, 
  FileSpreadsheet, 
  ShieldCheck,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/formatters';

const DEFAULT_IFTA_RATES = {
  'Texas (TX)': { rate: 0.20, code: 'TX' },
  'California (CA)': { rate: 0.68, code: 'CA' },
  'Pennsylvania (PA)': { rate: 0.785, code: 'PA' },
  'Illinois (IL)': { rate: 0.454, code: 'IL' },
  'Ohio (OH)': { rate: 0.47, code: 'OH' },
  'Indiana (IN)': { rate: 0.57, code: 'IN' },
  'New York (NY)': { rate: 0.38, code: 'NY' },
  'Florida (FL)': { rate: 0.35, code: 'FL' },
  'Georgia (GA)': { rate: 0.36, code: 'GA' },
  'North Carolina (NC)': { rate: 0.404, code: 'NC' },
  'Tennessee (TN)': { rate: 0.27, code: 'TN' },
  'Missouri (MO)': { rate: 0.245, code: 'MO' },
  'Michigan (MI)': { rate: 0.48, code: 'MI' },
  'Arizona (AZ)': { rate: 0.26, code: 'AZ' },
  'Colorado (CO)': { rate: 0.22, code: 'CO' },
};

const INITIAL_TRUCK_STATES = [
  { id: 1, state: 'Texas (TX)', miles: 520, gallonsBought: 90, taxRate: 0.20 },
  { id: 2, state: 'Missouri (MO)', miles: 380, gallonsBought: 40, taxRate: 0.245 },
  { id: 3, state: 'Illinois (IL)', miles: 410, gallonsBought: 60, taxRate: 0.454 },
  { id: 4, state: 'Indiana (IN)', miles: 290, gallonsBought: 50, taxRate: 0.57 },
];

export default function IftaTruckingCalculator({ currency = 'USD' }) {
  const [truckStates, setTruckStates] = useState(INITIAL_TRUCK_STATES);
  const [fleetMpg, setFleetMpg] = useState(6.5); // Standard Class 8 diesel tractor MPG

  // State add row
  const [newState, setNewState] = useState('Ohio (OH)');
  const [newMiles, setNewMiles] = useState('');
  const [newGallons, setNewGallons] = useState('');

  // Computations
  const summary = useMemo(() => {
    let totalMiles = 0;
    let totalGallonsBought = 0;
    let totalTaxDue = 0;

    const rows = truckStates.map((row) => {
      const miles = parseFloat(row.miles) || 0;
      const bought = parseFloat(row.gallonsBought) || 0;
      const rate = parseFloat(row.taxRate) || 0;

      totalMiles += miles;
      totalGallonsBought += bought;

      // Gallons burned in state = Miles / Fleet MPG
      const gallonsBurned = fleetMpg > 0 ? miles / fleetMpg : 0;
      const netTaxableGallons = gallonsBurned - bought;
      const taxDue = netTaxableGallons * rate;

      totalTaxDue += taxDue;

      return {
        ...row,
        gallonsBurned,
        netTaxableGallons,
        taxDue,
      };
    });

    const overallActualMpg = totalGallonsBought > 0 ? totalMiles / totalGallonsBought : fleetMpg;

    return {
      rows,
      totalMiles,
      totalGallonsBought,
      totalTaxDue,
      overallActualMpg,
    };
  }, [truckStates, fleetMpg]);

  const handleAddState = (e) => {
    e.preventDefault();
    if (!newMiles || parseFloat(newMiles) <= 0) return;

    const rate = DEFAULT_IFTA_RATES[newState]?.rate || 0.30;
    const entry = {
      id: Date.now(),
      state: newState,
      miles: parseFloat(newMiles),
      gallonsBought: parseFloat(newGallons) || 0,
      taxRate: rate,
    };

    setTruckStates([...truckStates, entry]);
    setNewMiles('');
    setNewGallons('');
  };

  const handleDeleteState = (id) => {
    setTruckStates(truckStates.filter((s) => s.id !== id));
  };

  const handleExportCsv = () => {
    const headers = [
      'State / Jurisdiction',
      'Tax Rate ($/gal)',
      'Total Miles',
      'Gallons Purchased',
      'Taxable Gallons Consumed',
      'Net Taxable Gallons',
      'Tax Owed / (Credit)',
    ];

    const dataRows = summary.rows.map((r) => [
      `"${r.state}"`,
      r.taxRate.toFixed(3),
      r.miles,
      r.gallonsBought,
      r.gallonsBurned.toFixed(2),
      r.netTaxableGallons.toFixed(2),
      r.taxDue.toFixed(2),
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...dataRows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `IFTA_Quarterly_Report_${new Date().toISOString().split('T')[0]}.csv`);
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 text-xs font-bold mb-2">
              <Truck className="w-3.5 h-3.5" />
              Commercial Trucking & Freight Distance Management
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              IFTA State Mileage & Fuel Tax Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Track state-by-state miles traveled, fuel gallons purchased, and calculate net International Fuel Tax Agreement (IFTA) quarterly liability or tax credits for motor carriers and owner-operators.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              Export IFTA Report
            </button>
          </div>
        </div>

        {/* Global Fleet Parameter Bar */}
        <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1 flex items-center justify-between">
              <span>Fleet Overall Average MPG</span>
              <span className="text-amber-600 dark:text-amber-400 font-extrabold">{fleetMpg} MPG</span>
            </label>
            <input
              type="range"
              min="4.5"
              max="9.0"
              step="0.1"
              value={fleetMpg}
              onChange={(e) => setFleetMpg(parseFloat(e.target.value) || 6.5)}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Class 8 tractors typically average 6.0 – 7.2 MPG
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
            <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Total Interstate Miles Logged
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white mt-1">
              {formatNumber(summary.totalMiles, 1)}{' '}
              <span className="text-xs font-semibold text-slate-400">miles</span>
            </div>
            <span className="text-[10px] text-slate-400 block mt-1">
              Across {truckStates.length} reporting jurisdictions
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-md shadow-amber-500/20">
            <span className="block text-xs font-extrabold uppercase tracking-wider text-amber-100">
              Net IFTA Quarterly Balance
            </span>
            <div className="text-3xl font-black mt-1">
              {summary.totalTaxDue >= 0
                ? formatCurrency(summary.totalTaxDue, currency)
                : `(${formatCurrency(Math.abs(summary.totalTaxDue), currency)})`}
            </div>
            <span className="text-xs text-amber-100 mt-1 block font-medium">
              {summary.totalTaxDue >= 0 ? 'Tax Due to Jurisdiction' : 'Tax Credit / Refund Expected'}
            </span>
          </div>
        </div>

        {/* State Breakdown Table */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-600" />
              State-by-State IFTA Mileage & Fuel Audit Table
            </h3>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Jurisdiction</th>
                  <th className="px-4 py-3 text-right">State Miles</th>
                  <th className="px-4 py-3 text-right">Gallons Bought</th>
                  <th className="px-4 py-3 text-right">Gallons Consumed</th>
                  <th className="px-4 py-3 text-right">Net Gallons</th>
                  <th className="px-4 py-3 text-right">Tax Rate</th>
                  <th className="px-4 py-3 text-right">Net Tax Due</th>
                  <th className="px-4 py-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 bg-white dark:bg-slate-800">
                {summary.rows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-750 transition">
                    <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{row.state}</td>
                    <td className="px-4 py-3 text-right font-extrabold text-slate-800 dark:text-slate-200">
                      {formatNumber(row.miles, 0)} mi
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-slate-700 dark:text-slate-300">
                      {formatNumber(row.gallonsBought, 1)} gal
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">
                      {formatNumber(row.gallonsBurned, 1)} gal
                    </td>
                    <td className="px-4 py-3 text-right font-bold text-slate-700 dark:text-slate-300">
                      {row.netTaxableGallons > 0 ? `+${row.netTaxableGallons.toFixed(1)}` : row.netTaxableGallons.toFixed(1)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500 dark:text-slate-400">
                      ${row.taxRate.toFixed(3)}/gal
                    </td>
                    <td
                      className={`px-4 py-3 text-right font-extrabold ${
                        row.taxDue > 0
                          ? 'text-rose-600 dark:text-rose-400'
                          : row.taxDue < 0
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-slate-600'
                      }`}
                    >
                      {row.taxDue >= 0
                        ? formatCurrency(row.taxDue, currency)
                        : `(${formatCurrency(Math.abs(row.taxDue), currency)})`}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteState(row.id)}
                        className="p-1 text-slate-400 hover:text-rose-500 rounded transition"
                        title="Delete state"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add State Row */}
          <form
            onSubmit={handleAddState}
            className="mt-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700"
          >
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              + Log Additional State / Jurisdiction
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <select
                value={newState}
                onChange={(e) => setNewState(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
              >
                {Object.keys(DEFAULT_IFTA_RATES).map((st) => (
                  <option key={st} value={st}>
                    {st} (${DEFAULT_IFTA_RATES[st].rate}/gal)
                  </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Miles driven in state"
                value={newMiles}
                onChange={(e) => setNewMiles(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
                required
              />

              <input
                type="number"
                placeholder="Fuel purchased (gallons)"
                value={newGallons}
                onChange={(e) => setNewGallons(e.target.value)}
                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold"
              />

              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add State
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

