import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import RouteDistanceCalculator from './components/RouteDistanceCalculator';
import MapMeasureTool from './components/MapMeasureTool';
import GasMileageCalculator from './components/GasMileageCalculator';
import TripCostCalculator from './components/TripCostCalculator';
import BusinessReimbursementCalculator from './components/BusinessReimbursementCalculator';
import IftaTruckingCalculator from './components/IftaTruckingCalculator';
import LeasePcpCalculator from './components/LeasePcpCalculator';
import AirMilesCalculator from './components/AirMilesCalculator';
import EvVsGasCalculator from './components/EvVsGasCalculator';
import MileageConverter from './components/MileageConverter';
import FaqKnowledgeBase from './components/FaqKnowledgeBase';
import LanguageSitemapDirectory from './components/LanguageSitemapDirectory';
import TopicalAuthorityHub from './components/TopicalAuthorityHub';
import SemanticBreadcrumbs from './components/SemanticBreadcrumbs';
import FormulaGuide from './components/FormulaGuide';
import CalculationHistory from './components/CalculationHistory';
import Footer from './components/Footer';
import { LANGUAGES, TRANSLATIONS } from './i18n/translations';
import { injectSemanticJsonLd } from './utils/semanticSchema';

// Parser to extract language and page from URL path or hash
function parseUrlRoute() {
  const validLangs = LANGUAGES.map((l) => l.code);
  const validTabs = ['route', 'measure', 'mileage', 'trip', 'irs', 'ifta', 'lease', 'air', 'ev', 'convert', 'faqs', 'sitemap', 'authority'];

  // 1. Check Hash: e.g. #/es/mileage or #/mileage or #es/mileage
  const rawHash = window.location.hash.replace(/^#\/?/, '');
  const hashSegments = rawHash.split('/').filter(Boolean);

  let lang = 'en';
  let tab = 'route';

  if (hashSegments.length >= 2) {
    if (validLangs.includes(hashSegments[0])) lang = hashSegments[0];
    if (validTabs.includes(hashSegments[1])) tab = hashSegments[1];
  } else if (hashSegments.length === 1) {
    if (validLangs.includes(hashSegments[0])) lang = hashSegments[0];
    else if (validTabs.includes(hashSegments[0])) tab = hashSegments[0];
  }

  // 2. Check Pathname if hash was empty: e.g. /es/mileage
  if (hashSegments.length === 0) {
    const pathSegments = window.location.pathname.split('/').filter(Boolean);
    if (pathSegments.length >= 2) {
      if (validLangs.includes(pathSegments[0])) lang = pathSegments[0];
      if (validTabs.includes(pathSegments[1])) tab = pathSegments[1];
    } else if (pathSegments.length === 1) {
      if (validLangs.includes(pathSegments[0])) lang = pathSegments[0];
      else if (validTabs.includes(pathSegments[0])) tab = pathSegments[0];
    }
  }

  return { lang, tab };
}

export default function App() {
  const initialRoute = parseUrlRoute();
  const [currentLang, setCurrentLang] = useState(initialRoute.lang);
  const [activeTab, setActiveTab] = useState(initialRoute.tab);

  // Dark mode
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('mileage_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Global settings
  const [unitSystem, setUnitSystem] = useState(currentLang === 'en' ? 'us' : 'metric');
  const [currency, setCurrency] = useState(
    currentLang === 'es' || currentLang === 'fr' || currentLang === 'de' || currentLang === 'it'
      ? 'EUR'
      : currentLang === 'ja'
      ? 'JPY'
      : 'USD'
  );

  // Transfer data between Route and Trip Planner
  const [tripTransferData, setTripTransferData] = useState({
    distance: 215,
    mpg: 28,
    fuelPrice: 3.50,
  });

  // Calculation history
  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('mileage_calc_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Handle URL sync and browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const { lang, tab } = parseUrlRoute();
      setCurrentLang(lang);
      setActiveTab(tab);
    };

    window.addEventListener('hashchange', handlePopState);
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('hashchange', handlePopState);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Update URL hash when language or tab changes
  const updateRoute = (newLang, newTab) => {
    setCurrentLang(newLang);
    setActiveTab(newTab);
    const targetUrl = `/#/${newLang}/${newTab}`;
    if (window.location.hash !== targetUrl) {
      window.location.hash = targetUrl;
    }
  };

  // SEO & Head Management: Update meta tags, title, html lang, and hreflang links
  useEffect(() => {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.en;
    const tabName = t.tabs?.[activeTab] || activeTab;

    // Document Title
    document.title = `${tabName} — ${t.metaTitle || 'Mileage Calculator Pro'}`;

    // Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = `${tabName}: ${t.metaDesc || ''}`;

    // HTML lang and direction (RTL for Arabic)
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';

    // Canonical link
    const baseUrl = window.location.origin;
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.rel = 'canonical';
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.href = `${baseUrl}/#/${currentLang}/${activeTab}`;

    // Dynamic Hreflang alternates for all languages
    document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((el) => el.remove());
    LANGUAGES.forEach((l) => {
      const link = document.createElement('link');
      link.rel = 'alternate';
      link.hreflang = l.code;
      link.href = `${baseUrl}/#/${l.code}/${activeTab}`;
      document.head.appendChild(link);
    });

    // Default hreflang fallback
    const xDefault = document.createElement('link');
    xDefault.rel = 'alternate';
    xDefault.hreflang = 'x-default';
    xDefault.href = `${baseUrl}/#/en/${activeTab}`;
    // Inject Dynamic Schema.org JSON-LD Graph for Topical Authority
    injectSemanticJsonLd(currentLang, activeTab);
  }, [currentLang, activeTab]);

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('mileage_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('mileage_theme', 'light');
    }
  }, [isDark]);

  // Persist history
  useEffect(() => {
    try {
      localStorage.setItem('mileage_calc_history', JSON.stringify(history));
    } catch (e) {
      console.warn('Failed to save history:', e);
    }
  }, [history]);

  const handleSaveHistory = (entry) => {
    setHistory((prev) => [entry, ...prev.slice(0, 24)]);
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('mileage_calc_history');
  };

  const handleSendToTripCost = (distanceMiles, mpg, fuelPrice) => {
    setTripTransferData({
      distance: Math.round(distanceMiles),
      mpg: mpg || 28,
      fuelPrice: fuelPrice || 3.50,
    });
    updateRoute(currentLang, 'trip');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setUnitSystem(currentLang === 'en' ? 'us' : 'metric');
    setTripTransferData({
      distance: 215,
      mpg: 28,
      fuelPrice: 3.50,
    });
    updateRoute(currentLang, 'route');
  };

  const handleLanguageSelect = (langCode) => {
    // Automatically switch measurement defaults to Metric for non-US languages
    if (langCode !== 'en' && unitSystem === 'us') {
      setUnitSystem('metric');
    } else if (langCode === 'en' && unitSystem === 'metric') {
      setUnitSystem('us');
    }
    updateRoute(langCode, activeTab);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        currentLang={currentLang}
        onSelectLang={handleLanguageSelect}
        activeTab={activeTab}
        setActiveTab={(tab) => updateRoute(currentLang, tab)}
        isDark={isDark}
        setIsDark={setIsDark}
        unitSystem={unitSystem}
        setUnitSystem={setUnitSystem}
        currency={currency}
        setCurrency={setCurrency}
        onReset={handleReset}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-12">
        {/* Semantic Breadcrumbs with Schema.org Microdata */}
        <SemanticBreadcrumbs
          currentLang={currentLang}
          activeTab={activeTab}
          onNavigate={(lang, tab) => updateRoute(lang, tab)}
        />

        {/* Tab 1: Driving Route & Distance Calculator */}
        {activeTab === 'route' && (
          <RouteDistanceCalculator
            unitSystem={unitSystem}
            currency={currency}
            onSendToTripCost={handleSendToTripCost}
          />
        )}

        {/* Tab 2: Map Distance Measurement (Google Maps Style) */}
        {activeTab === 'measure' && (
          <MapMeasureTool
            unitSystem={unitSystem}
            currency={currency}
          />
        )}

        {/* Tab 3: Gas Mileage & Odometer Calculator */}
        {activeTab === 'mileage' && (
          <GasMileageCalculator
            unitSystem={unitSystem}
            setUnitSystem={setUnitSystem}
            currency={currency}
            onSaveHistory={handleSaveHistory}
          />
        )}

        {/* Tab 4: Road Trip Cost Splitter */}
        {activeTab === 'trip' && (
          <TripCostCalculator
            unitSystem={unitSystem}
            currency={currency}
            initialDistance={tripTransferData.distance}
            initialMpg={tripTransferData.mpg}
            initialFuelPrice={tripTransferData.fuelPrice}
            onSaveHistory={handleSaveHistory}
          />
        )}

        {/* Tab 5: IRS & Business Mileage Reimbursement */}
        {activeTab === 'irs' && (
          <BusinessReimbursementCalculator
            unitSystem={unitSystem}
            currency={currency}
            onSaveHistory={handleSaveHistory}
          />
        )}

        {/* Tab 6: Commercial Trucking & IFTA State Mileage Calculator */}
        {activeTab === 'ifta' && (
          <IftaTruckingCalculator
            currency={currency}
          />
        )}

        {/* Tab 7: Car Lease & PCP Excess Mileage */}
        {activeTab === 'lease' && (
          <LeasePcpCalculator
            currency={currency}
          />
        )}

        {/* Tab 8: Air Miles & Flight Distance */}
        {activeTab === 'air' && (
          <AirMilesCalculator />
        )}

        {/* Tab 9: EV vs Gas Savings Comparison */}
        {activeTab === 'ev' && (
          <EvVsGasCalculator
            currency={currency}
          />
        )}

        {/* Tab 10: Mileage, Fuel Economy & Ratio Unit Converter */}
        {activeTab === 'convert' && (
          <MileageConverter />
        )}

        {/* Tab 11: Dedicated FAQs & SEO Knowledge Base */}
        {activeTab === 'faqs' && (
          <FaqKnowledgeBase />
        )}

        {/* Tab 12: Topical Authority & Semantic Knowledge Hub */}
        {activeTab === 'authority' && (
          <TopicalAuthorityHub
            onNavigateTab={(tab) => updateRoute(currentLang, tab)}
          />
        )}

        {/* Tab 13: Multilingual Sitemap & Indexable Page Directory (121 URLs) */}
        {activeTab === 'sitemap' && (
          <LanguageSitemapDirectory
            onNavigate={(lang, tab) => updateRoute(lang, tab)}
          />
        )}

        {/* Saved Calculation History */}
        <CalculationHistory
          history={history}
          onClearHistory={handleClearHistory}
        />

        {/* Comprehensive Formulas, Derivations & Educational Guide */}
        <FormulaGuide />

        {/* Language Directory footer link */}
        {activeTab !== 'sitemap' && (
          <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center">
            <button
              type="button"
              onClick={() => updateRoute(currentLang, 'sitemap')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
            >
              <span>🌐 View All 121 Indexable Multilingual Page URLs</span>
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
