import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Search, 
  Clock, 
  Calendar, 
  ArrowRight, 
  Fuel, 
  FileText, 
  MapPin, 
  Compass, 
  Car, 
  Zap, 
  ShieldCheck, 
  Calculator, 
  Sparkles,
  ExternalLink,
  Tag
} from 'lucide-react';
import { ARTICLES, ARTICLE_CATEGORIES } from '../../data/articles';

const CATEGORY_ICONS = {
  'mileage-distance': MapPin,
  'fuel-economy': Fuel,
  'fuel-expenses': Compass,
  'business-mileage': FileText,
  'trip-planning': Car,
  'vehicle-efficiency': Zap,
};

const CATEGORY_COLORS = {
  'mileage-distance': 'text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
  'fuel-economy': 'text-blue-700 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
  'fuel-expenses': 'text-amber-700 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  'business-mileage': 'text-purple-700 bg-purple-50 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800',
  'trip-planning': 'text-indigo-700 bg-indigo-50 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
  'vehicle-efficiency': 'text-cyan-700 bg-cyan-50 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
};

const CALCULATOR_NAMES = {
  route: 'Driving Route Distance',
  mileage: 'Gas Mileage & MPG',
  irs: 'IRS Business Reimbursement',
  trip: 'Road Trip Cost Splitter',
  ifta: 'IFTA Trucking Fuel Tax',
  lease: 'Lease & PCP Excess Mileage',
  ev: 'EV vs Gas Savings',
  measure: 'Map Distance Tool',
  air: 'Air Miles & Flight Distance',
  convert: 'Mileage Unit Converter',
};

export default function ResourceHub({ onSelectArticle, onNavigateTab }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter articles based on category and search query
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((article) => {
      const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      if (!query) return matchesCategory;

      const matchesSearch = 
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.sections.some((s) => s.heading.toLowerCase().includes(query) || s.content.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Featured flagship article
  const featuredArticle = ARTICLES[0]; // Cost Per Mile guide

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* =========================================================================
          HERO BANNER
          ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white p-6 sm:p-10 shadow-xl border border-slate-700/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Authoritative Educational Content Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Mileage, Fuel Economy & Tax Deduction Guides
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Free, mathematically verified educational resources. Learn how to calculate operating expenses, maximize IRS business mileage tax deductions, diagnose fuel efficiency drops, and budget road trips accurately.
          </p>

          {/* Quick Metrics Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 sm:gap-6 text-xs text-slate-300 font-semibold">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>14 Verified Articles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>10 Interactive Tools</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Updated for 2026 Standards</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-8 relative max-w-2xl">
          <div className="relative flex items-center">
            <Search className="w-5 h-5 absolute left-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides (e.g. IRS standard rate, cost per mile, MPG illusion, road trip gas)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 text-xs text-slate-400 hover:text-white px-2 py-1 rounded-md bg-white/10"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* =========================================================================
          CATEGORY FILTER TABS
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Browse by Topic Category
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Showing {filteredArticles.length} of {ARTICLES.length} articles
          </span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>All Guides ({ARTICLES.length})</span>
          </button>

          {ARTICLE_CATEGORIES.map((cat) => {
            const Icon = CATEGORY_ICONS[cat.id] || BookOpen;
            const count = ARTICLES.filter((a) => a.category === cat.id).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          FEATURED FLAGSHIP ARTICLE (Shown when category is 'all' and no active search)
          ========================================================================= */}
      {selectedCategory === 'all' && !searchQuery && featuredArticle && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-800 border-2 border-emerald-500/30 dark:border-emerald-500/20 shadow-md transition hover:shadow-lg">
          <div className="flex flex-col lg:flex-row gap-6 lg:items-center justify-between">
            <div className="space-y-3 max-w-3xl">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300">
                  Featured Master Guide
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {featuredArticle.readTime}
                </span>
                <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Updated {featuredArticle.lastUpdated}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                {featuredArticle.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {featuredArticle.excerpt}
              </p>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row lg:flex-col gap-2.5">
              <button
                type="button"
                onClick={() => onSelectArticle(featuredArticle.slug)}
                className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <span>Read Full Guide</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateTab('trip')}
                className="px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs transition flex items-center justify-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Open Cost Calculator</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          ARTICLES GRID
          ========================================================================= */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
          <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No articles found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            We couldn't find any guides matching "{searchQuery}". Try searching for terms like "IRS", "MPG", "odometer", or "cost per mile".
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => {
            const cat = ARTICLE_CATEGORIES.find((c) => c.id === article.category) || ARTICLE_CATEGORIES[0];
            const colorClass = CATEGORY_COLORS[article.category] || CATEGORY_COLORS['mileage-distance'];
            const primaryCalc = article.relatedCalculators?.[0];
            const primaryCalcName = CALCULATOR_NAMES[primaryCalc];

            return (
              <article
                key={article.slug}
                className="flex flex-col justify-between rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition group"
              >
                <div className="space-y-3">
                  {/* Category Pill & Read Time */}
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className={`px-2.5 py-1 rounded-full border ${colorClass}`}>
                      {cat.name}
                    </span>
                    <span className="text-slate-400 font-semibold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {article.readTime}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
                    <button
                      type="button"
                      onClick={() => onSelectArticle(article.slug)}
                      className="text-left"
                    >
                      {article.title}
                    </button>
                  </h3>

                  {/* Excerpt */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
                  {/* Primary Calculator Shortcut */}
                  {primaryCalc && primaryCalcName && (
                    <button
                      type="button"
                      onClick={() => onNavigateTab(primaryCalc)}
                      className="w-full text-left px-2.5 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-semibold flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <Calculator className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>Interactive Tool: {primaryCalcName}</span>
                      </span>
                      <ExternalLink className="w-3 h-3 text-slate-400 shrink-0 ml-1" />
                    </button>
                  )}

                  {/* Read Article CTA */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-slate-400 font-medium">
                      Updated {article.lastUpdated}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectArticle(article.slug)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* =========================================================================
          EDITORIAL QUALITY STANDARDS & POLICY TRANSPARENCY
          ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-slate-900 dark:text-white font-extrabold text-sm sm:text-base">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Mileage Calculator Pro Editorial & Mathematical Integrity Standards</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">Official Primary Sources</span>
            <p>
              All mileage deduction rates and tax rules are directly verified against IRS Revenue Procedures (e.g. Notice 2024-08 and Rev. Proc. 2019-46). Fuel economy ratings cite EPA and Department of Energy laboratory testing data.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">Peer-Reviewed Mathematics</span>
            <p>
              Formulas for geodesic Haversine distance, road circuity factors (1.20–1.30), Gallons Per Mile (GPM), and MPGe electric energy equivalents (33.705 kWh/gal) are fully verified and accompanied by transparent worked examples.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 space-y-1.5">
            <span className="font-bold text-slate-900 dark:text-white block">Zero AI Filler or Sponsored Content</span>
            <p>
              We do not publish superficial AI-generated filler or accept paid placements from automotive lenders or fuel companies. Every article is written for real drivers, gig workers, and commercial fleet operators.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
