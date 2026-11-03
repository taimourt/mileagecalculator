import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export default function SemanticBreadcrumbs({ currentLang = 'en', activeTab = 'route', onNavigate }) {
  const tabNames = {
    route: 'Driving Route & Road Distance',
    measure: 'Measure Map Distance',
    mileage: 'Gas Mileage & Odometer',
    trip: 'Road Trip Cost Splitter',
    irs: 'IRS Business Mileage Reimbursement',
    ifta: 'IFTA Commercial Trucking',
    lease: 'Car Lease & PCP Overage',
    air: 'Air Miles & Flight Distance',
    ev: 'Electric Vehicle vs Gas Savings',
    convert: 'Mileage Unit Converter',
    faqs: 'Frequently Asked Questions',
    sitemap: 'Multilingual Sitemap Directory',
    authority: 'Topical Authority & Knowledge Hub',
  };

  const currentTabName = tabNames[activeTab] || activeTab;

  return (
    <nav
      aria-label="Breadcrumb"
      itemScope
      itemType="https://schema.org/BreadcrumbList"
      className="mb-4 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap scrollbar-none"
    >
      {/* Home */}
      <span
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
        className="flex items-center"
      >
        <button
          type="button"
          onClick={() => onNavigate(currentLang, 'route')}
          itemProp="item"
          className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          <Home className="w-3.5 h-3.5" />
          <span itemProp="name">Home</span>
        </button>
        <meta itemProp="position" content="1" />
      </span>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

      {/* Category */}
      <span
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
        className="flex items-center"
      >
        <button
          type="button"
          onClick={() => onNavigate(currentLang, 'authority')}
          itemProp="item"
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          <span itemProp="name">Knowledge Pillars</span>
        </button>
        <meta itemProp="position" content="2" />
      </span>

      <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />

      {/* Active Page */}
      <span
        itemProp="itemListElement"
        itemScope
        itemType="https://schema.org/ListItem"
        className="flex items-center text-slate-900 dark:text-white font-extrabold"
      >
        <span itemProp="name">{currentTabName}</span>
        <meta itemProp="position" content="3" />
      </span>
    </nav>
  );
}

