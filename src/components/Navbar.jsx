import React, { useState, useRef, useEffect } from 'react';
import { 
  Compass, 
  Fuel, 
  MapPin, 
  FileText, 
  Zap, 
  Sun, 
  Moon, 
  Printer, 
  RotateCcw,
  Ruler,
  Truck,
  Car,
  Plane,
  Repeat,
  HelpCircle,
  Globe2,
  ChevronDown,
  Check,
  Atom
} from 'lucide-react';
import { LANGUAGES, TRANSLATIONS } from '../i18n/translations';

export default function Navbar({
  currentLang = 'en',
  onSelectLang,
  activeTab,
  setActiveTab,
  isDark,
  setIsDark,
  unitSystem,
  setUnitSystem,
  currency,
  setCurrency,
  onReset,
}) {
  const [isLangOpen, setIsLangOpen] = useState(false);
  const langDropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  const tabs = [
    { id: 'route', label: t.tabs?.route || 'Driving Route', icon: MapPin, badge: 'GPS' },
    { id: 'measure', label: t.tabs?.measure || 'Measure Map', icon: Ruler, badge: 'Direct' },
    { id: 'mileage', label: t.tabs?.mileage || 'Gas Mileage', icon: Fuel, badge: 'MPG' },
    { id: 'trip', label: t.tabs?.trip || 'Trip Cost Splitter', icon: Compass, badge: 'Budget' },
    { id: 'irs', label: t.tabs?.irs || 'IRS Business Log', icon: FileText, badge: '2019-2026' },
    { id: 'ifta', label: t.tabs?.ifta || 'IFTA Trucking', icon: Truck, badge: 'State Tax' },
    { id: 'lease', label: t.tabs?.lease || 'Lease & PCP', icon: Car, badge: 'Excess' },
    { id: 'air', label: t.tabs?.air || 'Air Miles', icon: Plane, badge: 'Flight NM' },
    { id: 'ev', label: t.tabs?.ev || 'EV vs Gas', icon: Zap, badge: 'Savings' },
    { id: 'convert', label: t.tabs?.convert || 'Unit Converter', icon: Repeat, badge: 'Mi ↔ Km' },
    { id: 'faqs', label: t.tabs?.faqs || 'FAQs & Guide', icon: HelpCircle, badge: 'SEO' },
    { id: 'authority', label: t.tabs?.authority || 'Knowledge Hub', icon: Atom, badge: 'Pillars' },
    { id: 'sitemap', label: t.tabs?.sitemap || 'Language Index', icon: Globe2, badge: '11 Langs' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top brand & control row */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  {t.appName || 'Mileage'}<span className="text-emerald-600 dark:text-emerald-400">{t.appSuffix || 'Calculator'}</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  PRO
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 dark:text-slate-400">
                {t.tagline || 'Advanced Driving Distance, Fuel MPG, IRS 2019–2026 & IFTA State Suite'}
              </p>
            </div>
          </div>

          {/* Controls: Language Selector, Units, Currency, Dark Mode, Print */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* 🌐 Language Converter Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-800 dark:text-slate-100 transition shadow-sm"
                title="Change Language (Cambiar Idioma / Changer de Langue / Sprache wählen)"
              >
                <span className="text-sm">{currentLangObj.flag}</span>
                <span className="font-extrabold hidden sm:inline">{currentLangObj.native}</span>
                <span className="font-extrabold sm:hidden uppercase">{currentLangObj.code}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Language Menu Dropdown */}
              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-[600] animate-fadeIn max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    Select Language ({LANGUAGES.length} Languages)
                  </div>
                  {LANGUAGES.map((lang) => {
                    const isSelected = lang.code === currentLang;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          onSelectLang(lang.code);
                          setIsLangOpen(false);
                        }}
                        className={`w-full px-3.5 py-2 text-left flex items-center justify-between text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-700 transition ${
                          isSelected ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/20' : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-base">{lang.flag}</span>
                          <div>
                            <div>{lang.native}</div>
                            <div className="text-[10px] text-slate-400">{lang.name}</div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Units Toggle */}
            <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUnitSystem('us')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  unitSystem === 'us'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Miles, Gallons, MPG"
              >
                US (mi)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`px-2 py-1 rounded-lg transition-all ${
                  unitSystem === 'metric'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
                title="Kilometers, Liters, L/100km"
              >
                Metric (km)
              </button>
            </div>

            {/* Currency Selector */}
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              aria-label="Currency"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="CAD">CA$ CAD</option>
              <option value="AUD">A$ AUD</option>
            </select>

            {/* Print Button */}
            <button
              type="button"
              onClick={() => window.print()}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Print Calculation Summary"
            >
              <Printer className="w-4 h-4" />
            </button>

            {/* Reset Defaults */}
            <button
              type="button"
              onClick={onReset}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title="Reset all inputs to defaults"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Dark Mode Toggle */}
            <button
              type="button"
              onClick={() => setIsDark(!isDark)}
              className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-amber-500 dark:hover:text-amber-400 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="flex space-x-1 overflow-x-auto pb-2 sm:pb-0 scrollbar-none pt-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  window.location.hash = `/${currentLang}/${tab.id}`;
                }}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-xs font-semibold whitespace-nowrap rounded-t-xl transition-all border-b-2 ${
                  isActive
                    ? 'border-emerald-600 text-emerald-700 dark:text-emerald-400 bg-emerald-50/70 dark:bg-emerald-950/30'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive
                      ? 'bg-emerald-200/70 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200'
                      : 'bg-slate-200/70 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}
