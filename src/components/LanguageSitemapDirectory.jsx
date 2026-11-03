import React from 'react';
import { Globe2, ExternalLink, Compass, ShieldCheck } from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../i18n/translations';

export default function LanguageSitemapDirectory({ onNavigate }) {
  const pages = [
    { id: 'route', name: 'Driving Route Calculator' },
    { id: 'measure', name: 'Map Distance Measurement' },
    { id: 'mileage', name: 'Gas Mileage & MPG' },
    { id: 'trip', name: 'Trip Cost Splitter' },
    { id: 'irs', name: 'IRS Business Reimbursement' },
    { id: 'ifta', name: 'IFTA Trucking State Mileage' },
    { id: 'lease', name: 'Car Lease & PCP Overage' },
    { id: 'air', name: 'Air Flight Miles' },
    { id: 'ev', name: 'EV vs Gas Savings' },
    { id: 'convert', name: 'Mileage Unit Converter' },
    { id: 'faqs', name: 'FAQs & Mileage Guide' },
  ];

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mileagecalculator.pro';

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
              <Globe2 className="w-3.5 h-3.5" />
              Search Engine Indexable Language Directory (121 Separate URLs)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Multilingual Sitemap & Indexable Page Directory
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Every tool and language is uniquely indexed with distinct URLs, canonical tags, and <code>hreflang</code> annotations across 11 world languages.
            </p>
          </div>
        </div>

        {/* Directory Matrix by Language */}
        <div className="pt-6 space-y-8">
          {LANGUAGES.map((lang) => {
            const t = TRANSLATIONS[lang.code] || TRANSLATIONS.en;
            return (
              <div key={lang.code} className="space-y-3">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-xl">{lang.flag}</span>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    {lang.name} ({lang.native})
                  </h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-mono">
                    hreflang="{lang.code}"
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5">
                  {pages.map((p) => {
                    const localizedTabName = t.tabs?.[p.id] || p.name;
                    const pathUrl = `/#/${lang.code}/${p.id}`;
                    const fullCanonicalUrl = `${baseUrl}/#/${lang.code}/${p.id}`;

                    return (
                      <a
                        key={p.id}
                        href={pathUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          onNavigate(lang.code, p.id);
                        }}
                        className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-emerald-50 hover:border-emerald-200 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 transition group flex flex-col justify-between"
                      >
                        <div className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                          {localizedTabName}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-1 truncate">
                          /{lang.code}/{p.id}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

