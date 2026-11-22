import React from 'react';
import { FileText, AlertTriangle, Scale, ShieldCheck, CheckCircle2, HelpCircle } from 'lucide-react';

export default function TermsOfService({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold mb-3">
          <Scale className="w-3.5 h-3.5" />
          User Agreement & Legal Terms
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Terms of Service
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          Effective Date: November 1, 2026 &bull; Last Revised: November 22, 2026
        </p>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
          Welcome to <strong>Mileage Calculator Pro</strong>. By accessing or using our website, computational tools, distance APIs, or mobile interfaces, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, please discontinue use of the website.
        </p>
      </div>

      {/* Main Content Sections */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors space-y-8 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            1. Nature of the Service
          </h2>
          <p>
            Mileage Calculator Pro provides free informational and computational utilities designed to estimate automotive fuel economy (MPG, L/100km), GPS driving distances, road trip fuel costs, IRS business mileage deductions, IFTA trucking fuel tax summaries, car lease overage penalties, and aeronautical air miles.
          </p>
          <p>
            The services are offered free of charge for personal, commercial, and educational use. We reserve the right to modify, suspend, or enhance any tool or feature at any time without prior notice.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            2. Tax, Financial & Accounting Disclaimer
          </h2>
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-2">
            <p className="font-bold">IMPORTANT NOTICE REGARDING TAX DEDUCTIONS:</p>
            <p>
              Calculations provided in the IRS Business Mileage Logbook and IFTA Trucking calculators are mathematical estimates based on published Internal Revenue Service standard rates (Rev. Proc. 2019-46, Notice 2024-08, and related announcements) and state fuel tax tables.
            </p>
            <p>
              Mileage Calculator Pro does not provide certified financial, legal, tax, or accounting advice. Actual tax deductibility depends on your individual taxpayer status, accurate recordkeeping under IRC § 274(d), vehicle ownership records, and specific state regulations. Always consult a licensed Certified Public Accountant (CPA) or tax attorney before filing tax returns.
            </p>
          </div>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-600" />
            3. Driving Route & Geospatial Accuracy
          </h2>
          <p>
            Driving distances, travel durations, and turn polylines are generated via algorithmic queries against public road graph datasets (OpenStreetMap and OSRM). 
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Actual driving conditions vary due to road construction, traffic congestion, weather events, detours, and vehicle speed limits.</li>
            <li>Calculated fuel consumption is an estimate based on EPA ratings and user inputs; actual fuel use depends on vehicle mechanical condition, tire pressure, cargo weight, and driving habits.</li>
            <li>Users must always prioritize live traffic signage, road safety regulations, and personal judgment when operating a motor vehicle.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            4. Intellectual Property & Acceptable Use
          </h2>
          <p>
            The software, design interface, proprietary formula implementations, text guides, and branding on Mileage Calculator Pro are the property of the website operators and are protected by applicable intellectual property laws.
          </p>
          <p>
            You agree not to:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Engage in automated scraping, denial of service (DoS), or excessive programmatic API abuse that degrades server performance for other users.</li>
            <li>Attempt to reverse engineer, decompile, or copy the website source code for unlawful commercial duplication.</li>
            <li>Transmit malware, viruses, or harmful automated code through form inputs.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            5. Limitation of Liability & Warranty Disclaimer
          </h2>
          <p>
            THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT PERMITTED BY LAW, MILEAGE CALCULATOR PRO DISCLAIMS ALL WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
          </p>
          <p>
            IN NO EVENT SHALL THE OPERATORS OF MILEAGE CALCULATOR PRO BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, OR CONSEQUENTIAL DAMAGES (INCLUDING LOSS OF PROFITS, TAX PENALTIES, OR TRAVEL DELAYS) ARISING FROM OR RELATED TO YOUR USE OF THE WEBSITE.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-emerald-600" />
            6. Contact & Dispute Resolution
          </h2>
          <p>
            If you have questions about these Terms of Service or wish to report a legal inquiry, please contact our team via email at <a href="mailto:support@mileagecalculatorpro.com" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">support@mileagecalculatorpro.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
