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
  Atom,
  Menu,
  X,
  Award,
  Mail,
  BookOpen,
  ArrowRight,
  ShieldCheck
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
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isResourceOpen, setIsResourceOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const langDropdownRef = useRef(null);
  const calcDropdownRef = useRef(null);
  const resourceDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
      if (calcDropdownRef.current && !calcDropdownRef.current.contains(event.target)) {
        setIsCalcOpen(false);
      }
      if (resourceDropdownRef.current && !resourceDropdownRef.current.contains(event.target)) {
        setIsResourceOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
  const currentLangObj = LANGUAGES.find((l) => l.code === currentLang) || LANGUAGES[0];

  // All 10 existing, working calculators
  const calculatorList = [
    { id: 'route', label: 'Driving Route & Distance', icon: MapPin, desc: 'GPS route, waypoints, turn polylines' },
    { id: 'mileage', label: 'Gas Mileage & Odometer', icon: Fuel, desc: 'MPG, L/100km, fuel cost per mile' },
    { id: 'irs', label: 'IRS Business Mileage Log', icon: FileText, desc: '2019-2026 rates, Schedule C tax deduction' },
    { id: 'trip', label: 'Road Trip Cost Splitter', icon: Compass, desc: 'Fuel & tolls budget split per person' },
    { id: 'ifta', label: 'Commercial Trucking (IFTA)', icon: Truck, desc: 'State-by-state quarterly fuel tax reporting' },
    { id: 'lease', label: 'Car Lease & PCP Excess', icon: Car, desc: 'Overage pace forecasting & return fines' },
    { id: 'ev', label: 'EV vs Gas Comparison', icon: Zap, desc: '5-year savings & emissions reduction' },
    { id: 'measure', label: 'Map Distance Measurement', icon: Ruler, desc: 'Straight-line air miles & walking paths' },
    { id: 'air', label: 'Aeronautical Air Miles', icon: Plane, desc: 'Flight distance & frequent flyer miles' },
    { id: 'convert', label: 'Unit & Ratio Converter', icon: Repeat, desc: 'Miles/km, MPG/L100km, 50:1 2-stroke mix' },
  ];

  // Resources
  const resourceList = [
    { id: 'resources', label: 'Educational Guides & Articles', icon: BookOpen, desc: '14 verified guides on mileage, fuel economy, IRS rates, and road trips' },
    { id: 'faqs', label: 'FAQs & Mileage Guide', icon: HelpCircle, desc: 'Frequently asked questions & usage tutorials' },
    { id: 'authority', label: 'Topical Knowledge Hub', icon: Atom, desc: 'In-depth engineering & tax pillars' },
    { id: 'sitemap', label: 'Multilingual Directory', icon: Globe2, desc: '11 language indexable page matrix' },
  ];

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    window.location.hash = `/${currentLang}/${tabId}`;
    setIsCalcOpen(false);
    setIsResourceOpen(false);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header Row */}
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* 1. Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => handleTabClick('route')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
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
                <p className="hidden xl:block text-[10px] text-slate-400 font-medium">
                  High-Precision Distance & Fuel Suite
                </p>
              </div>
            </button>
          </div>

          {/* 2. Desktop Main Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-slate-700 dark:text-slate-200">
            {/* Home Link */}
            <button
              type="button"
              onClick={() => handleTabClick('route')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'route'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Home
            </button>

            {/* Calculators Dropdown */}
            <div className="relative" ref={calcDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsCalcOpen(!isCalcOpen);
                  setIsResourceOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                  calculatorList.some(c => c.id === activeTab)
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
                aria-expanded={isCalcOpen}
              >
                <span>Calculators</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isCalcOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCalcOpen && (
                <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-[600] animate-fadeIn max-h-[85vh] overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    All 10 Working Calculators
                  </div>
                  <div className="py-1 space-y-0.5">
                    {calculatorList.map((calc) => {
                      const Icon = calc.icon;
                      const isSelected = activeTab === calc.id;
                      return (
                        <button
                          key={calc.id}
                          type="button"
                          onClick={() => handleTabClick(calc.id)}
                          className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">{calc.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">{calc.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Resources Dropdown */}
            <div className="relative" ref={resourceDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setIsResourceOpen(!isResourceOpen);
                  setIsCalcOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition ${
                  resourceList.some(r => r.id === activeTab)
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-extrabold'
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
                aria-expanded={isResourceOpen}
              >
                <span>Resources</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isResourceOpen ? 'rotate-180' : ''}`} />
              </button>

              {isResourceOpen && (
                <div className="absolute left-0 mt-2 w-72 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl p-2 z-[600] animate-fadeIn">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    Guides & Knowledge
                  </div>
                  <div className="py-1 space-y-0.5">
                    {resourceList.map((res) => {
                      const Icon = res.icon;
                      const isSelected = activeTab === res.id;
                      return (
                        <button
                          key={res.id}
                          type="button"
                          onClick={() => handleTabClick(res.id)}
                          className={`w-full p-2.5 rounded-xl text-left flex items-start gap-3 transition ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200'
                          }`}
                        >
                          <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'
                          }`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold leading-tight">{res.label}</div>
                            <div className="text-[10px] text-slate-400 font-normal leading-tight mt-0.5">{res.desc}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* About Us Link */}
            <button
              type="button"
              onClick={() => handleTabClick('about')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'about'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              About
            </button>

            {/* Contact Link */}
            <button
              type="button"
              onClick={() => handleTabClick('contact')}
              className={`px-3 py-2 rounded-xl transition ${
                activeTab === 'contact'
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              Contact
            </button>
          </nav>

          {/* 3. Controls Bar: Language, Units, Currency, Dark Mode, Print, Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            
            {/* 🌐 Language Converter Dropdown */}
            <div className="relative" ref={langDropdownRef}>
              <button
                type="button"
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-bold text-slate-800 dark:text-slate-100 transition shadow-sm"
                title="Change Language (11 Languages)"
              >
                <span>{currentLangObj.flag}</span>
                <span className="hidden md:inline text-[11px] font-extrabold">{currentLangObj.native}</span>
                <span className="md:hidden uppercase text-[10px] font-extrabold">{currentLangObj.code}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isLangOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xl py-2 z-[600] animate-fadeIn max-h-96 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
                    Select Language ({LANGUAGES.length})
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
            <div className="hidden sm:inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUnitSystem('us')}
                className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
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
                className={`px-2 py-1 rounded-lg transition-all text-[11px] ${
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
              className="hidden sm:block bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
              title="Print Summary"
            >
              <Printer className="w-4 h-4" />
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

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* 4. Quick Access Tab Pill Bar (Clean, Fast 1-Click Access) */}
        <div className="flex space-x-1.5 overflow-x-auto pb-2 scrollbar-none pt-1 border-t border-slate-100 dark:border-slate-800/80">
          {calculatorList.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold whitespace-nowrap rounded-xl transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/20 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Mobile Navigation Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-2xl max-h-[85vh] overflow-y-auto p-4 z-50 animate-fadeIn space-y-4">
          
          {/* Mobile Quick Controls */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="inline-flex p-0.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setUnitSystem('us')}
                className={`px-3 py-1 rounded-lg ${unitSystem === 'us' ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                US (mi)
              </button>
              <button
                type="button"
                onClick={() => setUnitSystem('metric')}
                className={`px-3 py-1 rounded-lg ${unitSystem === 'metric' ? 'bg-white dark:bg-slate-700 font-bold text-slate-900 dark:text-white shadow-sm' : 'text-slate-500'}`}
              >
                Metric (km)
              </button>
            </div>

            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2 py-1 text-xs font-semibold text-slate-700 dark:text-slate-200"
            >
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="CAD">CA$ CAD</option>
              <option value="AUD">A$ AUD</option>
            </select>
          </div>

          {/* Calculators List */}
          <div className="space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
              Calculators
            </div>
            {calculatorList.map((calc) => {
              const Icon = calc.icon;
              const isSelected = activeTab === calc.id;
              return (
                <button
                  key={calc.id}
                  type="button"
                  onClick={() => handleTabClick(calc.id)}
                  className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition ${
                    isSelected ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-xs font-bold">{calc.label}</span>
                  </div>
                  {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Resources & Trust */}
          <div className="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 pb-1">
              Resources & About
            </div>
            <button
              type="button"
              onClick={() => handleTabClick('resources')}
              className="w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40"
            >
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Educational Guides (14 Articles)</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('faqs')}
              className="w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>FAQs & Mileage Guide</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('authority')}
              className="w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Atom className="w-4 h-4 text-purple-600" />
              <span>Knowledge Hub & Pillars</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('about')}
              className="w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Award className="w-4 h-4 text-amber-500" />
              <span>About Us</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('contact')}
              className="w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <Mail className="w-4 h-4 text-emerald-600" />
              <span>Contact Us</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabClick('privacy')}
              className="w-full p-2.5 rounded-xl text-left flex items-center gap-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <ShieldCheck className="w-4 h-4 text-slate-500" />
              <span>Privacy Policy</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
