import React, { useState } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Calculator, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Info,
  Scale
} from 'lucide-react';

export default function CalculatorEducationalSection({
  title,
  whatIsIt,
  howToUse = [],
  formula,
  example,
  understandingResults = [],
  factors = [],
  faqs = [],
  relatedCalculators = [],
  relatedGuides = [],
  onNavigateTab,
}) {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="mt-12 space-y-12 text-slate-700 dark:text-slate-300">
      
      {/* 1. What is this calculator & How to use */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Educational Guide & Documentation</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            What is the {title}?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
            {whatIsIt}
          </p>
        </div>

        {/* How to use steps */}
        {howToUse.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              How to Use This Calculator (Step-by-Step)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {howToUse.map((step, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1 text-xs">
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">Step {idx + 1}</span>
                  <p className="text-slate-600 dark:text-slate-400">{step}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. Mathematical Formula & Worked Example */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Mathematical Precision
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Calculation Formula & Derivation
          </h2>
        </div>

        {formula && (
          <div className="p-5 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs sm:text-sm overflow-x-auto space-y-2 border border-slate-800 shadow-inner">
            {typeof formula === 'string' ? (
              <pre className="whitespace-pre-wrap">{formula}</pre>
            ) : (
              formula
            )}
          </div>
        )}

        {/* Worked Example */}
        {example && (
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-3 text-xs">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Worked Calculation Example
            </h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {example.scenario}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <span className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Inputs:</span>
                <ul className="space-y-1 text-slate-500">
                  {example.inputs.map((inp, i) => (
                    <li key={i}>&bull; {inp}</li>
                  ))}
                </ul>
              </div>
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200">
                <span className="font-bold block mb-1">Output Results:</span>
                <ul className="space-y-1">
                  {example.results.map((res, i) => (
                    <li key={i}>&bull; {res}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 3. Understanding Your Results & Factors Affecting Output */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Understanding Your Results & Real-World Variables
        </h2>

        {understandingResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              What Each Metric Means:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {understandingResults.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 space-y-1">
                  <span className="font-bold text-slate-900 dark:text-white">{item.term}</span>
                  <p className="text-slate-500 dark:text-slate-400">{item.definition}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {factors.length > 0 && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Factors & Limitations Affecting This Calculation:
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 dark:text-slate-400">
              {factors.map((f, idx) => (
                <li key={idx} className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900">
                  <Info className="w-3.5 h-3.5 text-blue-500 shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      {/* 4. Frequently Asked Questions (Accordion) */}
      {faqs.length > 0 && (
        <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Expert Q&A
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Frequently Asked Questions About {title}
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 flex items-center justify-between text-left bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200"
                    aria-expanded={isOpen}
                  >
                    <span className="pr-4">{faq.q}</span>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 text-slate-400">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="p-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 5. Related Calculators & Resources */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
          Related Calculators & Guides
        </h2>

        {relatedCalculators.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {relatedCalculators.map((rel, idx) => {
              const Icon = rel.icon || Calculator;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (onNavigateTab) {
                      onNavigateTab(rel.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-left transition space-y-2 group"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 transition">
                    {rel.title}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                    {rel.description}
                  </p>
                </button>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
