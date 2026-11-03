import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Compass, 
  Fuel, 
  ShieldCheck, 
  Truck, 
  Car, 
  ExternalLink,
  ChevronRight,
  Layers,
  Sparkles,
  Award,
  FileCheck2,
  Atom,
  HelpCircle
} from 'lucide-react';

const TOPIC_PILLARS = [
  {
    id: 'geospatial',
    title: 'Pillar I: Geospatial Navigation, Routing & Geodesic Mathematics',
    icon: Compass,
    color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
    summary: 'The mathematics of Great-Circle geodesics, WGS-84 ellipsoidal geometry, and road network tortuosity factors.',
    sections: [
      {
        heading: '1. Haversine vs. Vincenty Geodesic Formulations',
        content: `Calculating distance across planetary surfaces requires spherical trigonometry. The Haversine formula calculates the great-circle distance between two points on a sphere of radius R:
d = 2R · arcsin(√(sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)))
While accurate to ~0.3% globally, high-precision geospatial systems adopt the Vincenty inverse formulation on the WGS-84 reference ellipsoid (semi-major axis a = 6,378,137.0 m; flattening f ≈ 1/298.257223563), providing sub-millimeter geodetic precision across terrestrial coordinates.`
      },
      {
        heading: '2. The Road Circuity & Tortuosity Factor (1.15 to 1.30)',
        content: `Terrestrial road driving distance always exceeds geodesic straight-line distance. The ratio between actual road travel distance (D_road) and Euclidean/Geodesic distance (D_geo) is defined as the Circuity Index:
Circuity Index (CI) = D_road ÷ D_geo
Empirical transportation engineering studies demonstrate that across North American interstates, CI averages 1.20 to 1.24. In metropolitan grids with Manhattan geometries, CI is approximately 1.27 (√(2) in square lattices), while mountainous topographies can exhibit circuity factors exceeding 1.45.`
      },
    ],
    relatedTool: 'route',
    toolCta: 'Launch OSRM GPS Route Engine',
  },

  {
    id: 'thermodynamics',
    title: 'Pillar II: Automotive Energetics, Thermodynamics & Fuel Economy',
    icon: Fuel,
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
    summary: 'Internal combustion thermal efficiency, stoichiometric combustion, EPA testing cycles, and MPGe conversion science.',
    sections: [
      {
        heading: '1. Brake Specific Fuel Consumption (BSFC) & Thermal Limits',
        content: `Modern automotive gasoline engines achieve peak thermal efficiencies of 35% to 40% (diesel up to 45%). The chemical energy released per gallon of standard gasoline is approximately 114,000 BTU (33.705 kWh or 121.3 MJ). The majority of combustion energy is dissipated as thermal exhaust and coolant radiation, with approximately 15% to 20% overcoming rolling resistance, aerodynamic drag (F_drag = 0.5 · ρ · v² · C_d · A), and mechanical drivetrain inertia.`
      },
      {
        heading: '2. The Inverse Relationship of MPG and L/100km',
        content: `Miles Per Gallon (MPG) is a distance-per-volume metric, whereas Liters per 100 Kilometers (L/100km) is a consumption-per-distance metric. This leads to the "MPG Illusion": replacing a 14 MPG car with a 20 MPG car saves 2.14 gallons every 100 miles, whereas replacing a 33 MPG car with a 50 MPG car saves only 1.03 gallons per 100 miles.
Conversion Constant: L/100km = 235.214583 ÷ US MPG.`
      },
      {
        heading: '3. MPGe (Miles Per Gallon Gasoline Equivalent) for Electric Vehicles',
        content: `The Environmental Protection Agency (EPA) established 1 gallon of gasoline = 33.705 kWh of electrical energy. To derive EV fuel economy:
MPGe = (Miles Driven ÷ Total kWh Consumed) × 33.705 kWh/gal
An electric vehicle consuming 28 kWh per 100 miles achieves (100 ÷ 28) × 33.705 = 120.4 MPGe.`
      },
    ],
    relatedTool: 'mileage',
    toolCta: 'Open Fuel Economy & Odometer Calculator',
  },

  {
    id: 'taxation',
    title: 'Pillar III: Fiscal Compliance, IRS Regulations & IRC § 274(d)',
    icon: ShieldCheck,
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-900',
    summary: 'Statutory basis under Rev. Proc. 2019-46, Accountable Plan substantiation rules, and Schedule C tax deduction mechanics.',
    sections: [
      {
        heading: '1. IRS Standard Mileage Rate Statutory Framework',
        content: `Under Internal Revenue Code (IRC) Section 162(a), taxpayers may deduct ordinary and necessary expenses incurred in carrying on a trade or business. Rather than tracking actual expenses (fuel, oil, repairs, insurance, depreciation under IRC § 280F), taxpayers may employ the optional standard mileage rate established annually by the IRS under Rev. Proc. 2019-46.
The rate reflects an independent annual study conducted by Runzheimer International evaluating fixed and variable vehicle operating costs.`
      },
      {
        heading: '2. Strict Substantiation Requirements under IRC § 274(d)',
        content: `Under Treasury Regulation § 1.274-5T, no deduction is permitted based on approximations or unverified estimates. Taxpayers must maintain a contemporaneous mileage log containing:
1. Amount of mileage for each business use
2. Date of the expenditure or use
3. Destination (city, town, or physical location)
4. Business reason for the travel or business relationship with persons visited.`
      },
    ],
    relatedTool: 'irs',
    toolCta: 'Access IRS Logbook & 2019-2026 Archive',
  },

  {
    id: 'logistics',
    title: 'Pillar IV: Commercial Transportation, Logistics & IFTA Law',
    icon: Truck,
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
    summary: 'Multi-jurisdictional fuel tax reporting under IFTA Article III, carrier tariff rates, and practical highway miles.',
    sections: [
      {
        heading: '1. International Fuel Tax Agreement (IFTA) Jurisdictional Allocation',
        content: `Commercial motor vehicles with a Gross Vehicle Weight Rating (GVWR) exceeding 26,000 lbs, or having 3 or more axles, operating across state lines must report fuel use under IFTA. Taxes are assessed based on fuel consumed within each member jurisdiction, calculated as:
Taxable Gallons = Total Jurisdiction Miles ÷ Fleet Overall Average MPG
Net Tax Due = (Taxable Gallons - Tax-Paid Gallons Purchased) × State Tax Rate.`
      },
      {
        heading: '2. Practical Miles vs. HHG Short Miles in Freight Logistics',
        content: `Household Goods (HHG) mileage calculates the shortest legally permissible highway route between postal zip codes. Conversely, Practical Route Mileage calculates the fastest interstate corridor suitable for heavy commercial freight, prioritizing highway clearance and weight limits over pure distance. Practical miles typically exceed HHG miles by 6% to 11%.`
      },
    ],
    relatedTool: 'ifta',
    toolCta: 'Run IFTA State-by-State Audit Calculator',
  },

  {
    id: 'leasing',
    title: 'Pillar V: Automotive Finance, Asset Depreciation & Contract Hire',
    icon: Car,
    color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-900',
    summary: 'Residual value actuarial schedules, PCP Guaranteed Minimum Future Value (GMFV), and overage penalty pricing.',
    sections: [
      {
        heading: '1. Actuarial Residual Value Schedules & Excess Wear Mechanics',
        content: `Closed-end consumer leases and Personal Contract Purchase (PCP) agreements fix the vehicle's future purchase option price (Residual Value or GMFV) based on contractually agreed mileage limits (e.g., 30,000 miles over 36 months). Vehicles returned with mileage exceeding this ceiling suffer accelerated second-hand market depreciation. Financial institutions charge contractual excess mileage fees ($0.15 to $0.35 per mile; 8p to 25p in the UK) to offset wholesale auction value attrition.`
      },
    ],
    relatedTool: 'lease',
    toolCta: 'Calculate PCP & Lease Overage Risks',
  },
];

const SEMANTIC_GLOSSARY = [
  { term: 'Orthodromic Distance', category: 'Geodesics', definition: 'The shortest distance between two points on the surface of a sphere, measured along the surface of the sphere (Great-Circle path).' },
  { term: 'Circuity Index (CI)', category: 'Transportation', definition: 'The ratio between actual travel network road distance and Euclidean straight-line distance between two geographic coordinates.' },
  { term: 'Brake Specific Fuel Consumption (BSFC)', category: 'Thermodynamics', definition: 'A measure of the fuel efficiency of any prime mover that burns fuel and produces rotational power (grams of fuel per kilowatt-hour).' },
  { term: 'Stoichiometric Ratio', category: 'Combustion', definition: 'The ideal chemical ratio of air to fuel at which complete combustion occurs without excess air or unburned fuel (14.7:1 by mass for gasoline).' },
  { term: 'MPGe (Gasoline Equivalent)', category: 'Alternative Fuel', definition: 'The distance an electric vehicle can travel on 33.705 kWh of electricity, equating to the thermal energy content of 1 gallon of gasoline.' },
  { term: 'IRC Section 162(a)', category: 'Tax Law', definition: 'The statutory provision allowing deductions for ordinary and necessary expenses incurred in carrying on any trade or business.' },
  { term: 'Accountable Plan', category: 'Tax Compliance', definition: 'An employer reimbursement arrangement that satisfies business connection, substantiation under § 274(d), and timely return of excess amounts.' },
  { term: 'IFTA Articles of Agreement', category: 'Commercial Law', definition: 'The inter-jurisdictional treaty governing multi-state commercial carrier fuel tax apportionment across the US and Canadian provinces.' },
  { term: 'Guaranteed Minimum Future Value (GMFV)', category: 'Automotive Finance', definition: 'The anticipated wholesale residual value of a vehicle at the conclusion of a PCP financing agreement.' },
  { term: 'Household Goods (HHG) Mileage', category: 'Logistics', definition: 'The industry-standard short-mile calculation metric traditionally used for commercial freight rating.' },
  { term: 'Vincenty Formulations', category: 'Geodesics', definition: 'Two iterative methods used in geodesy to calculate distance between points on an oblate spheroid with sub-millimeter precision.' },
  { term: 'WGS-84 (World Geodetic System)', category: 'Geodesics', definition: 'The standard coordinate reference system used by GPS and global satellite navigation systems.' },
];

export default function TopicalAuthorityHub({ onNavigateTab }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activePillar, setActivePillar] = useState('geospatial');

  const filteredGlossary = SEMANTIC_GLOSSARY.filter(
    (item) =>
      item.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-3 border border-emerald-500/30">
            <Atom className="w-3.5 h-3.5 text-emerald-400" />
            Topical Authority & Semantic Entity Knowledge Base
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            The Science, Mathematics & Regulatory Framework of Mileage
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
            An exhaustive semantic ontology connecting geodesic mathematics, automotive thermodynamics, IRS tax compliance (IRC § 162 & § 274), IFTA interstate commerce, and actuarial lease depreciation.
          </p>
        </div>
      </div>

      {/* Pillar Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {TOPIC_PILLARS.map((p) => {
          const Icon = p.icon;
          const isActive = activePillar === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePillar(p.id)}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isActive
                  ? 'bg-white dark:bg-slate-800 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-slate-50 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:bg-white dark:hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={`p-1.5 rounded-xl border ${p.color}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {p.id}
                </span>
              </div>
              <h3 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-2">
                {p.title.split(':')[1] || p.title}
              </h3>
            </button>
          );
        })}
      </div>

      {/* Active Pillar Deep-Dive Content */}
      {TOPIC_PILLARS.map((p) => {
        if (p.id !== activePillar) return null;
        const Icon = p.icon;
        return (
          <div
            key={p.id}
            className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm animate-fadeIn space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl border ${p.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {p.title}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {p.summary}
                  </p>
                </div>
              </div>

              {p.relatedTool && onNavigateTab && (
                <button
                  type="button"
                  onClick={() => onNavigateTab(p.relatedTool)}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm shrink-0"
                >
                  <span>{p.toolCta}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="space-y-6">
              {p.sections.map((sec, idx) => (
                <div key={idx} className="space-y-2">
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-1.5 h-4 bg-emerald-500 rounded-full"></span>
                    {sec.heading}
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 text-xs text-slate-600 dark:text-slate-300 font-mono leading-relaxed whitespace-pre-line">
                    {sec.content}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Semantic Entity Glossary & Lexicon */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold mb-2">
              <Layers className="w-3.5 h-3.5" />
              Semantic Entity Ontology & Definitions
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Automotive, Geospatial & Regulatory Lexicon ({filteredGlossary.length} Entities)
            </h2>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search semantic glossary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredGlossary.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-400">
                    {item.category}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
                <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mb-1.5">
                  {item.term}
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {item.definition}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
