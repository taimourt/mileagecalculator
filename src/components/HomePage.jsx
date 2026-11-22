import React, { useState } from 'react';
import { 
  MapPin, 
  Fuel, 
  FileText, 
  Compass, 
  Truck, 
  Car, 
  Zap, 
  Ruler, 
  Plane, 
  Repeat, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Award, 
  HelpCircle, 
  BookOpen, 
  Globe2, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Calculator,
  Sliders,
  Download
} from 'lucide-react';
import RouteDistanceCalculator from './RouteDistanceCalculator';

export default function HomePage({
  unitSystem = 'us',
  currency = 'USD',
  onSendToTripCost,
  onNavigateTab,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  // All 10 existing calculators with real working routes
  const calculators = [
    {
      id: 'route',
      title: 'Driving Route & Distance Calculator',
      badge: 'Primary Tool',
      icon: MapPin,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      description: 'Calculate exact driving distance, travel duration, live turn polylines, and multi-stop waypoints between any two or more locations.',
      features: ['OSRM road routing', 'Up to 4 waypoints', 'Live fuel cost estimate'],
    },
    {
      id: 'mileage',
      title: 'Gas Mileage & Odometer Calculator',
      badge: 'MPG / Economy',
      icon: Fuel,
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800',
      description: 'Determine vehicle fuel economy (US MPG, UK MPG, L/100km, km/L) from full-tank odometer readings or direct trip distance.',
      features: ['Full-tank odometer math', 'Cost per mile & km', 'Efficiency rating badge'],
    },
    {
      id: 'irs',
      title: 'IRS Business Mileage Reimbursement',
      badge: '2019–2026 Rates',
      icon: FileText,
      color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800',
      description: 'Calculate standard tax deductions and employee reimbursements with official IRS annual rates from 2019 through 2026.',
      features: ['Schedule C deduction', 'Business, medical & charity', '1-click CSV log export'],
    },
    {
      id: 'trip',
      title: 'Road Trip Cost Splitter',
      badge: 'Expense Splitter',
      icon: Compass,
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      description: 'Plan road trip budgets, estimate total fuel expenses, add tolls, parking, and meals, and split costs evenly among passengers.',
      features: ['Passenger split breakdown', 'Vehicle preset selector', 'Incidental expense tracking'],
    },
    {
      id: 'ifta',
      title: 'Commercial Trucking & IFTA Calculator',
      badge: 'State Fuel Tax',
      icon: Truck,
      color: 'text-teal-600 bg-teal-50 dark:bg-teal-950/60 border-teal-200 dark:border-teal-800',
      description: 'Multi-jurisdiction fuel tax reporting for interstate commercial motor carriers, owner-operators, and Class 8 fleets.',
      features: ['State-by-state mileage log', 'Tax-paid gallon offset', 'Net tax due or refund'],
    },
    {
      id: 'lease',
      title: 'Car Lease & PCP Excess Mileage',
      badge: 'Lease Overage',
      icon: Car,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
      description: 'Track your annual lease allowance pace and forecast excess mileage penalties at return date with daily driving guidance.',
      features: ['Pace vs contract allowance', 'Projected financial penalty', 'Target daily pace recommendation'],
    },
    {
      id: 'ev',
      title: 'Electric Vehicle (EV) vs Gas Comparison',
      badge: 'Green Energy',
      icon: Zap,
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800',
      description: 'Compare fuel cost per mile, annual expenditure, 5-year savings, and tailpipe CO2 emissions reduction between EV and gas cars.',
      features: ['EPA 33.7 kWh benchmark', 'Multi-year cost horizon', 'CO2 emissions reduction'],
    },
    {
      id: 'measure',
      title: 'Map Distance Measurement Tool',
      badge: 'Interactive Map',
      icon: Ruler,
      color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800',
      description: 'Click anywhere on an interactive map to measure straight-line distance, walking paths, running loops, and road estimates.',
      features: ['Straight-line air miles', 'Multi-point walking paths', 'Satellite and street views'],
    },
    {
      id: 'air',
      title: 'Aeronautical Air Flight Miles',
      badge: 'Great-Circle',
      icon: Plane,
      color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60 border-sky-200 dark:border-sky-800',
      description: 'Compute orthodromic great-circle air flight distance between global airports, estimated flight times, and frequent flyer miles.',
      features: ['Statute & nautical miles', 'Cabin class multiplier', 'Flight duration estimation'],
    },
    {
      id: 'convert',
      title: 'Universal Mileage & Unit Converter',
      badge: 'Unit Ratios',
      icon: Repeat,
      color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
      description: 'Instant conversions between Miles & Kilometers, US MPG & L/100km, fuel unit costs, and 50:1 two-stroke fuel mixtures.',
      features: ['Two-way unit conversions', '50:1 gas/oil mix ratios', 'Cost per distance metric'],
    },
  ];

  // Filtered calculators based on search
  const filteredCalculators = calculators.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.badge.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Homepage FAQ Data
  const homepageFaqs = [
    {
      q: 'How does the driving distance calculator determine road mileage vs. straight-line distance?',
      a: 'Our driving distance calculator queries the Open Source Routing Machine (OSRM) highway network graph to trace actual drivable roads, turns, and highway ramps. In contrast, straight-line distance (geodesic distance) uses spherical trigonometry (the Haversine formula) to measure the shortest distance across Earth\'s curvature without accounting for terrain, rivers, or road networks. Road distance is typically 15% to 30% longer than straight-line distance due to road circuity.'
    },
    {
      q: 'What are the current IRS standard mileage reimbursement rates?',
      a: 'The IRS sets annual standard mileage rates for business, charitable, and medical transportation. For 2026, the projected business rate is $0.70/mile. For 2025, the rate is $0.685/mile. For 2024, it was $0.67/mile, and for 2023, it was $0.655/mile. Self-employed freelancers and 1099 contractors can deduct these rates on Schedule C (Line 9: Car and truck expenses).'
    },
    {
      q: 'How is gas mileage (MPG) calculated accurately using the full-tank method?',
      a: 'The full-tank odometer method is the gold standard for vehicle fuel economy: (1) Fill your gas tank completely and record your starting odometer. (2) Drive normally until your next fill-up. (3) Fill your tank completely again and record both the current odometer and the exact number of gallons added. Subtract the previous odometer from the current odometer to get total miles driven, then divide by gallons pumped: Miles Per Gallon (MPG) = Distance Driven ÷ Gallons Added.'
    },
    {
      q: 'How does the IFTA commercial trucking tax calculator work?',
      a: 'The International Fuel Tax Agreement (IFTA) simplifies fuel tax reporting for interstate commercial motor carriers. You enter the miles driven in each state or Canadian province and the tax-paid gallons purchased in each jurisdiction. The calculator divides total fleet miles by fleet average MPG to determine gallons consumed in each state. It then subtracts gallons purchased to calculate net taxable gallons and applies each state\'s fuel tax rate to determine net tax owed or refund.'
    },
    {
      q: 'Does Mileage Calculator Pro save or share my personal travel logs?',
      a: 'No. Mileage Calculator Pro is built on a 100% client-side privacy architecture. All route calculations, odometer entries, client reimbursement logs, and expense reports are processed exclusively in your web browser. No addresses, trip logs, or tax records are stored on our servers, ensuring complete confidentiality for your business and personal travel.'
    },
    {
      q: 'How do I convert between US MPG, UK Imperial MPG, and Liters per 100 Kilometers (L/100km)?',
      a: 'Because 1 US Gallon equals 3.785 Liters and 1 UK Imperial Gallon equals 4.546 Liters, the conversion formulas are: L/100km = 235.215 ÷ US MPG; US MPG = 235.215 ÷ (L/100km); UK Imperial MPG = US MPG × 1.20095; Kilometers per Liter (km/L) = US MPG × 0.425144.'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* =========================================================================
          SECTION 1: HERO SECTION
          ========================================================================= */}
      <section className="relative pt-2 pb-6">
        <div className="text-center max-w-4xl mx-auto space-y-4">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80 text-xs font-bold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>High-Precision Driving Distance, Fuel & Tax Suite</span>
          </div>

          {/* Semantic H1 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Free Mileage, Driving Distance & Fuel Cost Calculators
          </h1>

          {/* Intro Description */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Engineered for commuters, road-trippers, business owners, and commercial fleets. Calculate accurate GPS driving distances, fuel economy (MPG & L/100km), IRS business reimbursements (2019–2026), and trip budgets with 100% client-side privacy.
          </p>

          {/* Quick Tool Jump Pills */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-2 text-xs font-semibold">
            <span className="text-slate-400 font-medium mr-1">Popular Tools:</span>
            <button
              type="button"
              onClick={() => onNavigateTab('route')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 shadow-sm transition flex items-center gap-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Driving Route
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('mileage')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 shadow-sm transition flex items-center gap-1.5"
            >
              <Fuel className="w-3.5 h-3.5 text-blue-600" /> Gas Mileage (MPG)
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('irs')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 shadow-sm transition flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-purple-600" /> IRS Business Log
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('trip')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 shadow-sm transition flex items-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" /> Trip Cost Splitter
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('ifta')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 shadow-sm transition flex items-center gap-1.5"
            >
              <Truck className="w-3.5 h-3.5 text-teal-600" /> IFTA Trucking
            </button>
            <button
              type="button"
              onClick={() => onNavigateTab('ev')}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-slate-700 dark:text-slate-200 shadow-sm transition flex items-center gap-1.5"
            >
              <Zap className="w-3.5 h-3.5 text-cyan-600" /> EV vs Gas
            </button>
          </div>
        </div>

        {/* Primary Mileage Calculator Embedded in Hero */}
        <div className="mt-8">
          <RouteDistanceCalculator
            unitSystem={unitSystem}
            currency={currency}
            onSendToTripCost={onSendToTripCost}
          />
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: POPULAR CALCULATORS DIRECTORY
          ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Complete Calculator Directory
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Explore Our Mileage & Calculation Suite
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Choose from 10 specialized calculation tools. Every calculator runs verified mathematical formulas with instant, transparent results.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search calculators (e.g. IRS, MPG, IFTA)..."
              className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
            />
          </div>
        </div>

        {/* Calculator Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCalculators.map((calc) => {
            const Icon = calc.icon;
            return (
              <div
                key={calc.id}
                className="flex flex-col justify-between p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-emerald-500 dark:hover:border-emerald-500 transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border ${calc.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300">
                      {calc.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                      {calc.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                      {calc.description}
                    </p>
                  </div>

                  {/* Bullet points */}
                  <ul className="space-y-1.5 pt-2 text-[11px] text-slate-600 dark:text-slate-300">
                    {calc.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-700/60">
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateTab(calc.id);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-emerald-600 dark:bg-slate-900 dark:hover:bg-emerald-600 text-slate-700 hover:text-white dark:text-slate-200 dark:hover:text-white border border-slate-200 dark:border-slate-700 hover:border-transparent text-xs font-bold transition flex items-center justify-center gap-2 group"
                  >
                    <span>Open Calculator</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCalculators.length === 0 && (
          <div className="py-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500">No calculators matching "{searchQuery}".</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-2 text-xs font-bold text-emerald-600 hover:underline"
            >
              Clear search filter
            </button>
          </div>
        )}
      </section>

      {/* =========================================================================
          SECTION 3: HOW IT WORKS (3 SIMPLE STEPS)
          ========================================================================= */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Simple 3-Step Process
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            How Mileage Calculator Pro Works
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Accurate travel and fuel calculations without registration, paywalls, or privacy compromises.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-emerald-600/20 text-base">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Select Your Calculator & Enter Data
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Choose the right tool for your trip: input origin and destination addresses, odometer readings, vehicle MPG, or tax log entries with up to 4 multi-stop waypoints.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-blue-600/20 text-base">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Configure Units, Rates & Expenses
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Seamlessly toggle between US Customary (miles/gallons) and Metric (km/liters). Select official IRS tax years (2019–2026), customize fuel prices, and add tolls or parking fees.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold flex items-center justify-center shadow-md shadow-purple-600/20 text-base">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Review Results, Split & Export
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly view turn polylines, travel durations, and cost per mile. Export compliant CSV mileage logs for taxes, split expenses among passengers, or save calculations locally.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: EXPLORE DRIVING RESOURCES
          ========================================================================= */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Educational Guides & Standards
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Explore Driving & Tax Resources
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            In-depth guides on government deduction rules, fuel efficiency mathematics, and commercial fleet regulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resource 1: IRS & Tax */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                IRS Business Mileage & Tax Compliance
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Understand the statutory foundation of the IRS Standard Mileage Rate under Revenue Procedure 2019-46. Learn how self-employed freelancers, 1099 contractors, and gig workers substantiate business miles on Schedule C to maximize legal tax deductions.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('irs')}
                className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
              >
                Open IRS Reimbursement Logbook &rarr;
              </button>
            </div>
          </div>

          {/* Resource 2: Fuel Economy Math */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 flex items-center justify-center">
                <Fuel className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Fuel Economy Science & The MPG Illusion
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Explore why Miles Per Gallon (MPG) is non-linear and why Liters per 100km (L/100km) provides a more realistic representation of actual fuel savings. Learn how the EPA calculates MPGe for electric vehicles using the 33.705 kWh/gal energy benchmark.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('authority')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
              >
                Read Thermodynamics Knowledge Pillar &rarr;
              </button>
            </div>
          </div>

          {/* Resource 3: Commercial Fleet / IFTA */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-teal-100 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 flex items-center justify-center">
                <Truck className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                IFTA Commercial Motor Carrier Guide
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              A comprehensive breakdown of the International Fuel Tax Agreement. Review how interstate truck drivers calculate taxable gallons consumed versus gallons purchased at fuel stops to prevent penalties during quarterly audits.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('ifta')}
                className="text-xs font-bold text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1"
              >
                Access IFTA Trucking Calculator &rarr;
              </button>
            </div>
          </div>

          {/* Resource 4: Car Leasing & Overage */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Car Lease & PCP Excess Mileage Economics
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Avoid hefty turn-in fines on your contract hire or personal contract purchase (PCP). Learn how depreciation pace models can forecast your return odometer reading and calculate recommended monthly driving limits.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateTab('lease')}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                Open Lease & PCP Calculator &rarr;
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: WHY USE MILEAGE CALCULATOR PRO?
          ========================================================================= */}
      <section className="bg-slate-100/70 dark:bg-slate-900/60 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800">
        <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Platform Benefits
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Why Use Mileage Calculator Pro?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Built from the ground up for mathematical accuracy, zero data tracking, and universal compatibility.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              100% Client-Side Privacy
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No server-side databases or third-party log tracking. Your travel itineraries, tax logs, and addresses never leave your browser.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Official Government Rates
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pre-loaded with official IRS standard mileage rates (2019–2026), EPA vehicle constants, and updated state fuel tax schedules.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Globe2 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Multi-Unit & Currency Support
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Instantly toggle between US Customary, UK Imperial, and Metric systems, paired with multi-currency support ($ USD, € EUR, £ GBP, CA$, A$).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2 shadow-sm">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              10 Complete Tools in 1
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              From interactive multi-point road routing to EV savings, lease overages, and flight distance calculators on a single fast platform.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 6: FREQUENTLY ASKED QUESTIONS
          ========================================================================= */}
      <section className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Frequently Asked Questions
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Common Questions About Mileage & Calculations
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Quick answers regarding distance measurements, fuel economy calculations, and tax deduction compliance.
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {homepageFaqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900 transition"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-slate-900 dark:text-white pr-4">
                    {faq.q}
                  </span>
                  <div className="w-6 h-6 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center shrink-0 text-slate-500">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="p-4 sm:p-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Have more questions? Visit our{' '}
            <button
              type="button"
              onClick={() => onNavigateTab('faqs')}
              className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
            >
              Full FAQs & Mileage Guide
            </button>{' '}
            or contact our team directly.
          </p>
        </div>
      </section>
    </div>
  );
}
