import React from 'react';
import { Compass, ShieldCheck, Award, Users, BookOpen, HeartHandshake, CheckCircle2 } from 'lucide-react';

export default function AboutUs({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 py-4">
      {/* Header */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-3">
          <Compass className="w-3.5 h-3.5" />
          Our Mission & Standards
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          About Mileage Calculator Pro
        </h1>
        <p className="text-base text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
          <strong>Mileage Calculator Pro</strong> is an independent web utility built to provide drivers, commercial truckers, business travelers, fleet managers, and car owners with high-precision, privacy-first mileage and fuel economy calculations.
        </p>
      </div>

      {/* Main Sections */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors space-y-8 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
        
        {/* Core Values */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            Why We Built Mileage Calculator Pro
          </h2>
          <p>
            Standard online calculators are often cluttered with invasive ads, outdated IRS tax tables, and inaccurate straight-line approximations that ignore real road geometry. We built Mileage Calculator Pro to deliver an engineered, transparent alternative that prioritizes:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Mathematical Rigor
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Full adherence to geodesic formulas (Haversine & Vincenty WGS-84), EPA energetics cycles, and published IRS revenue procedures.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                100% Client-Side Privacy
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Zero tracking of your travel logs or personal tax data on private servers. Calculations happen securely in your browser.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                Comprehensive Tool Suite
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                10 dedicated tools covering road routes, map measuring, IRS deductions, IFTA fuel taxes, lease excess, EV vs gas, and unit conversions.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
              <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
                <Users className="w-4 h-4 text-emerald-600" />
                Global & Multilingual
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Universal support for US customary (miles/gal), UK imperial, and Metric (km/L, L/100km) across 11 world languages.
              </p>
            </div>
          </div>
        </section>

        {/* Data Sources & Editorial Integrity */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-600" />
            Data Sources & Verification Standards
          </h2>
          <p>
            To ensure the highest standard of accuracy, our tools integrate verified authoritative public data:
          </p>
          <ul className="list-disc list-inside space-y-2 pl-2">
            <li>
              <strong>Internal Revenue Service (IRS):</strong> Annual standard mileage rates derived from official IRS announcements, including 2019 through 2026 guidelines for business, charitable, and medical travel.
            </li>
            <li>
              <strong>OpenStreetMap (OSM) & Project OSRM:</strong> Live open-source road network graphs powering turn-by-turn routing and highway circuity measurements.
            </li>
            <li>
              <strong>US Environmental Protection Agency (EPA):</strong> Fuel economy conversion factors, including the official 33.705 kWh per gasoline-gallon equivalent (MPGe) benchmark for electric vehicles.
            </li>
            <li>
              <strong>International Fuel Tax Agreement (IFTA):</strong> Multi-jurisdiction commercial carrier accounting formulas for fleet fuel tax reporting.
            </li>
          </ul>
        </section>

        {/* Who We Are */}
        <section className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-emerald-600" />
            Independent & User-Supported
          </h2>
          <p>
            Mileage Calculator Pro is maintained by a dedicated team of web engineers, automotive data enthusiasts, and software developers. We keep the platform completely free for all users worldwide through non-intrusive, transparent digital advertising via Google AdSense.
          </p>
          <p>
            Have ideas for new features, found a bug, or want to suggest an improvement? We would love to hear from you. Visit our <button onClick={() => onNavigate && onNavigate('contact')} className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">Contact Us</button> page to send us a direct message.
          </p>
        </section>
      </div>
    </div>
  );
}
