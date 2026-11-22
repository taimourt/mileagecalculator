import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  CheckCircle, 
  Share2, 
  Printer, 
  BookOpen, 
  Calculator, 
  HelpCircle, 
  ExternalLink, 
  ChevronRight, 
  ShieldCheck, 
  ChevronDown,
  Sparkles,
  Info
} from 'lucide-react';
import { ARTICLES, ARTICLE_CATEGORIES } from '../../data/articles';

const CALCULATOR_DETAILS = {
  route: { name: 'Driving Route Distance Calculator', desc: 'GPS turn-by-turn road route and mileage calculation' },
  mileage: { name: 'Gas Mileage & MPG Calculator', desc: 'Tank-to-tank fuel economy and cost per mile log' },
  irs: { name: 'IRS Mileage Reimbursement Calculator', desc: 'Schedule C standard deduction & 2019–2026 rates' },
  trip: { name: 'Road Trip Cost Splitter', desc: 'Split fuel, tolls, and expenses fairly among passengers' },
  ifta: { name: 'IFTA Commercial Trucking Calculator', desc: 'Quarterly state-by-state fuel tax reporting' },
  lease: { name: 'Car Lease & PCP Excess Mileage Calculator', desc: 'Pace forecasting and end-of-lease overage fines' },
  ev: { name: 'EV vs Gas Savings Comparison', desc: 'Cost-per-mile comparison and 5-year break-even' },
  measure: { name: 'Map Distance Measurement Tool', desc: 'Geodesic straight-line and walking trail distance' },
  air: { name: 'Aeronautical Air Miles Calculator', desc: 'Great-circle flight distances and frequent flyer miles' },
  convert: { name: 'Mileage Unit & Ratio Converter', desc: 'Instant conversion between Miles, km, MPG, and L/100km' },
};

// Simple helper to format paragraph text with bolding and math formulas
function formatContent(text) {
  if (!text) return null;

  // Split into paragraphs by double newlines
  const paragraphs = text.split(/\n\n+/);

  return paragraphs.map((para, pIdx) => {
    const trimmed = para.trim();
    if (!trimmed) return null;

    // Check if paragraph is a LaTeX block: $$...$$
    if (trimmed.startsWith('$$') && trimmed.endsWith('$$')) {
      const formulaText = trimmed.slice(2, -2).trim();
      return (
        <div
          key={pIdx}
          className="my-5 p-4 sm:p-5 rounded-2xl bg-slate-900 text-emerald-300 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner border border-slate-700/60 flex items-center justify-center text-center"
        >
          <span>{formulaText}</span>
        </div>
      );
    }

    // Check if paragraph is a bullet list
    if (trimmed.includes('\n- ') || trimmed.startsWith('- ') || trimmed.includes('\n1. ') || /^\d+\.\s/.test(trimmed)) {
      const lines = trimmed.split('\n');
      const isOrdered = /^\d+\.\s/.test(lines[0].trim());

      if (isOrdered) {
        return (
          <ol key={pIdx} className="my-3 space-y-2 list-decimal list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {lines.map((line, lIdx) => {
              const clean = line.replace(/^\d+\.\s*/, '').trim();
              return <li key={lIdx} dangerouslySetInnerHTML={{ __html: renderInlineFormatting(clean) }} />;
            })}
          </ol>
        );
      }

      return (
        <ul key={pIdx} className="my-3 space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          {lines.map((line, lIdx) => {
            const clean = line.replace(/^-\s*/, '').trim();
            return <li key={lIdx} dangerouslySetInnerHTML={{ __html: renderInlineFormatting(clean) }} />;
          })}
        </ul>
      );
    }

    // Regular paragraph
    return (
      <p
        key={pIdx}
        className="my-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: renderInlineFormatting(trimmed) }}
      />
    );
  });
}

function renderInlineFormatting(str) {
  // Bold: **text** -> <strong>text</strong>
  let html = str.replace(/\*\*(.*?)\*\*/g, '<strong class="font-extrabold text-slate-900 dark:text-white">$1</strong>');
  // Italics: *text* -> <em>text</em>
  html = html.replace(/\*([^\*]+)\*/g, '<em class="italic">$1</em>');
  // Inline code / math: `code` or $math$ -> <code ...>code</code>
  html = html.replace(/\$([^\$]+)\$/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono text-xs">$1</code>');
  html = html.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 font-mono text-xs">$1</code>');
  return html;
}

export default function ArticleView({ slug, onBack, onSelectArticle, onNavigateTab }) {
  const [copied, setCopied] = useState(false);

  // Locate the article by slug
  const article = ARTICLES.find((a) => a.slug === slug) || ARTICLES[0];
  const category = ARTICLE_CATEGORIES.find((c) => c.id === article.category) || ARTICLE_CATEGORIES[0];

  // Articles in the same category
  const relatedArticles = ARTICLES.filter((a) => a.category === article.category && a.slug !== article.slug);

  // Scroll to top on load or article change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.excerpt,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <article className="max-w-6xl mx-auto space-y-8">
      {/* =========================================================================
          BREADCRUMBS
          ========================================================================= */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium overflow-x-auto whitespace-nowrap scrollbar-none">
        <button
          type="button"
          onClick={() => onNavigateTab('route')}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <button
          type="button"
          onClick={onBack}
          className="hover:text-emerald-600 dark:hover:text-emerald-400 transition"
        >
          Educational Hub
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-700 dark:text-slate-300 font-semibold truncate max-w-[200px] sm:max-w-xs">
          {category.name}
        </span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        <span className="text-slate-900 dark:text-white font-extrabold truncate max-w-[200px] sm:max-w-sm">
          {article.title}
        </span>
      </nav>

      {/* =========================================================================
          ARTICLE HEADER
          ========================================================================= */}
      <header className="space-y-4 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            {category.name}
          </span>
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readTime}
          </span>
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> Last Updated {article.lastUpdated}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        {/* Lead Excerpt */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/30 border-l-4 border-emerald-500 text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-medium leading-relaxed">
          {article.excerpt}
        </div>

        {/* Author & Editorial Verification Box */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 text-xs text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-slate-200 block">
                Mileage Calculator Pro Editorial Standards Team
              </span>
              <span className="text-[11px] text-slate-400">
                Mathematically reviewed • Cross-referenced with IRS, EPA & Department of Transportation standards
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copied ? 'Link Copied!' : 'Share'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================================
          MAIN TWO-COLUMN LAYOUT
          ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT / MAIN ARTICLE BODY (8 COLS) */}
        <div className="lg:col-span-8 space-y-8">
          {/* Table of Contents Box (Quick Links) */}
          {article.tableOfContents && article.tableOfContents.length > 0 && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
                Table of Contents
              </span>
              <ol className="space-y-1.5 text-xs sm:text-sm">
                {article.tableOfContents.map((item, idx) => (
                  <li key={item.id} className="flex items-baseline gap-2">
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                      {idx + 1}.
                    </span>
                    <button
                      type="button"
                      onClick={() => scrollToSection(item.id)}
                      className="text-left font-medium text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:underline transition"
                    >
                      {item.title}
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Article Sections */}
          <div className="space-y-10">
            {article.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-24 space-y-4"
              >
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight pb-2 border-b border-slate-100 dark:border-slate-800">
                  {section.heading}
                </h2>

                {/* Formatted Text & Formulas */}
                <div className="prose-content">
                  {formatContent(section.content)}
                </div>

                {/* Optional Table */}
                {section.table && (
                  <div className="my-6 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
                            {section.table.headers.map((h, i) => (
                              <th key={i} className="px-4 py-3 whitespace-nowrap">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-850">
                          {section.table.rows.map((row, rIdx) => (
                            <tr
                              key={rIdx}
                              className={rIdx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900/40'}
                            >
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-3 text-slate-700 dark:text-slate-300 font-medium">
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Interactive Tool Banner Callout */}
          {article.relatedCalculators && article.relatedCalculators.length > 0 && (
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg space-y-4">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-emerald-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Put This Guide Into Practice
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-white">
                  Try the {CALCULATOR_DETAILS[article.relatedCalculators[0]]?.name || 'Interactive Mileage Calculator'}
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100 mt-1">
                  Perform real-time calculations using verified mathematical formulas with zero registration or paywalls.
                </p>
              </div>

              <button
                type="button"
                onClick={() => onNavigateTab(article.relatedCalculators[0])}
                className="px-5 py-3 rounded-2xl bg-white text-emerald-800 hover:bg-emerald-50 font-black text-xs sm:text-sm shadow-md transition inline-flex items-center gap-2"
              >
                <span>Launch Interactive Tool</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Frequently Asked Questions Accordion */}
          {article.faqs && article.faqs.length > 0 && (
            <section id="faqs" className="scroll-mt-24 space-y-4 pt-6 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {article.faqs.map((faq, fIdx) => (
                  <details
                    key={fIdx}
                    className="group rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-4 transition-all duration-200 open:shadow-sm"
                  >
                    <summary className="cursor-pointer font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between gap-4 list-none">
                      <span>{faq.q}</span>
                      <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0" />
                    </summary>
                    <div className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-700">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Primary Legal & Technical Citations */}
          <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold text-slate-700 dark:text-slate-300 block">
              Primary Standards & Statutory References
            </span>
            <ul className="list-disc list-inside space-y-1">
              <li>Internal Revenue Code § 62, § 162, § 274(d), and IRS Notice 2024-08 standard mileage rates.</li>
              <li>U.S. Environmental Protection Agency (EPA) and Department of Energy (DOE) fuel economy testing methods (40 CFR Part 600).</li>
              <li>OpenStreetMap (OSRM) highway routing engine and Haversine geodetic distance algorithms.</li>
            </ul>
          </div>
        </div>

        {/* RIGHT SIDEBAR (4 COLS) */}
        <aside className="lg:col-span-4 space-y-6">
          {/* Related Interactive Calculators */}
          {article.relatedCalculators && article.relatedCalculators.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <Calculator className="w-3.5 h-3.5 text-emerald-500" />
                <span>Related Calculators</span>
              </span>

              <div className="space-y-2">
                {article.relatedCalculators.map((calcId) => {
                  const details = CALCULATOR_DETAILS[calcId];
                  if (!details) return null;
                  return (
                    <button
                      key={calcId}
                      type="button"
                      onClick={() => onNavigateTab(calcId)}
                      className="w-full text-left p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 dark:bg-slate-900/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-600 transition group"
                    >
                      <div className="font-bold text-xs text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 flex items-center justify-between">
                        <span>{details.name}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-500" />
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                        {details.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* More in this Category */}
          {relatedArticles.length > 0 && (
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                <span>More in {category.name}</span>
              </span>

              <div className="space-y-2.5">
                {relatedArticles.map((rel) => (
                  <button
                    key={rel.slug}
                    type="button"
                    onClick={() => onSelectArticle(rel.slug)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700/50 transition group"
                  >
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 line-clamp-2">
                      {rel.title}
                    </h4>
                    <span className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {rel.readTime}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Back to Guides Button */}
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Educational Guides</span>
          </button>
        </aside>
      </div>
    </article>
  );
}
