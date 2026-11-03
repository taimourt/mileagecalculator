import React, { useState } from 'react';
import { 
  HelpCircle, 
  Search, 
  ChevronDown, 
  ChevronUp, 
  MapPin, 
  Fuel, 
  FileText, 
  Truck, 
  Car, 
  Plane,
  Repeat
} from 'lucide-react';

const FAQ_DATA = [
  // Cluster: Map & Distance Measurement
  {
    category: 'Map & Driving Distance',
    icon: MapPin,
    questions: [
      {
        q: 'How do I measure distance between two points on a map (Google Maps style)?',
        a: 'To measure distance on our interactive map tool or Google Maps: click your starting point (Point A), then click your destination (Point B). Our tool calculates both the direct straight-line air distance ("as the crow flies") in miles, feet, kilometers, and meters, as well as the driving road distance accounting for standard highway circuity and road geometry.',
      },
      {
        q: 'What is the difference between straight-line air distance and road driving distance?',
        a: 'Straight-line distance (orthodromic / geodesic distance) measures the shortest path across the Earth\'s curvature between two coordinates. Road driving distance follows actual highway and street networks, typically adding 15% to 30% more miles due to terrain, turns, detours, and speed routes (road tortuosity factor ~1.22).',
      },
      {
        q: 'Can I calculate driving distance between multiple addresses with waypoints?',
        a: 'Yes! Use our Driving Route & Distance Calculator to add up to 4 intermediate waypoint stops between your origin and destination. It generates turn-by-turn routing, total accumulated trip mileage, estimated driving duration, and live fuel cost.',
      },
      {
        q: 'How do I measure walking or running distance on a map?',
        a: 'In our "Measure Distance on Map" tool, switch to "Walking Path" mode. Drop pins along sidewalks, park paths, or running trails. The tool calculates exact feet, meters, and miles, making it ideal for planning 5K, 10K, or marathon training loops.',
      },
      {
        q: 'Can I measure distances using latitude and longitude coordinates?',
        a: 'Yes. Our geocoding engine accepts city names, street addresses, zip/postal codes, and exact decimal latitude/longitude coordinates (e.g., 40.7128, -74.0060) to compute precise geographic distances.',
      },
    ],
  },

  // Cluster: IRS & Business Mileage Reimbursement
  {
    category: 'IRS & Business Reimbursement',
    icon: FileText,
    questions: [
      {
        q: 'What are the official IRS standard mileage reimbursement rates from 2019 to 2026?',
        a: 'The IRS sets annual standard mileage deduction rates for business, charitable, and medical travel:\n• 2026 (Projected): $0.70 / business mile\n• 2025: $0.685 / business mile, $0.21 medical, $0.14 charity\n• 2024: $0.67 / business mile, $0.21 medical, $0.14 charity\n• 2023: $0.655 / business mile, $0.22 medical, $0.14 charity\n• 2022 (Jul 1 - Dec 31): $0.625 / business mile (mid-year gas price adjustment)\n• 2022 (Jan 1 - Jun 30): $0.585 / business mile\n• 2021: $0.56 / business mile\n• 2020: $0.575 / business mile\n• 2019: $0.58 / business mile',
      },
      {
        q: 'Why did the 2022 IRS mileage rate change to 62.5 cents halfway through the year?',
        a: 'In response to rapid gasoline price inflation during the spring of 2022, the IRS announced a rare mid-year adjustment (IRS Announcement 2022-13). From January 1 through June 30, 2022, the business rate was 58.5 cents/mile. From July 1 through December 31, 2022, it jumped to 62.5 cents/mile.',
      },
      {
        q: 'How do self-employed contractors claim business mileage on tax returns (Schedule C)?',
        a: 'Self-employed individuals, 1099 freelancers, and gig drivers (Uber, Lyft, DoorDash) multiply their total documented business miles by the IRS standard mileage rate for that tax year. This total is entered on Form 1040 Schedule C (Line 9: Car and truck expenses), reducing net taxable self-employment income.',
      },
      {
        q: 'What records does the IRS require for mileage logs and expense reports (Concur/Expensify)?',
        a: 'Under IRS Publication 463, a valid mileage log must record: (1) Trip date, (2) Destination or starting/ending locations, (3) Business purpose or client name, and (4) Total miles driven. Our IRS Business Logbook tool allows you to log these fields and export a compliant CSV report with 1 click.',
      },
    ],
  },

  // Cluster: Gas Mileage & Fuel Economy
  {
    category: 'Gas Mileage & Fuel Economy',
    icon: Fuel,
    questions: [
      {
        q: 'What is the formula to calculate gas mileage (MPG)?',
        a: 'Gas Mileage (Miles Per Gallon) = (Current Odometer Reading − Previous Odometer Reading) ÷ Gallons Added to Full Tank. For example, if you drove 360 miles between full-tank fill-ups and pumped 15 gallons of gasoline, your mileage is 360 ÷ 15 = 24.0 MPG.',
      },
      {
        q: 'How do I convert between US MPG, UK Imperial MPG, and Liters per 100km (L/100km)?',
        a: 'Because 1 US Gallon = 3.785 Liters and 1 UK Imperial Gallon = 4.546 Liters:\n• L/100km = 235.214 ÷ US MPG\n• US MPG = 235.214 ÷ (L/100km)\n• UK Imperial MPG = US MPG × 1.20095\n• Kilometers per Liter (km/L) = US MPG × 0.425144',
      },
      {
        q: 'How can I calculate vehicle cost per mile to drive?',
        a: 'Fuel Cost Per Mile = Gas Price ($/gal) ÷ Vehicle MPG. For example, at $3.50/gallon with a 28 MPG vehicle, fuel costs $3.50 ÷ 28 = $0.125 per mile. To calculate true total operating cost per mile, add routine maintenance, tire wear, and insurance depreciation (~$0.15–$0.25/mi extra).',
      },
      {
        q: 'How does motorcycle / bike fuel average (KMPL) differ from cars?',
        a: 'Motorcycles and scooters have significantly lower curb weight and engine displacement, averaging 40 to 80+ KMPL (equivalent to 95 to 190 US MPG), whereas standard passenger sedans average 12 to 17 KMPL (28 to 40 MPG).',
      },
      {
        q: 'What is a 50:1 two-stroke fuel ratio mix?',
        a: 'A 50:1 ratio means 50 parts gasoline to 1 part two-cycle engine oil. For every 1 US gallon (128 oz) of gasoline, add 2.56 fluid ounces (76 ml) of 2-stroke oil. For 2 gallons, add 5.12 oz. Use our Mileage & Fuel Converter tab for instant mix measurements.',
      },
    ],
  },

  // Cluster: Commercial Trucking & IFTA
  {
    category: 'Commercial Trucking & IFTA',
    icon: Truck,
    questions: [
      {
        q: 'What is an IFTA mileage calculator and how does IFTA reporting work?',
        a: 'The International Fuel Tax Agreement (IFTA) is an agreement among the 48 contiguous US states and 10 Canadian provinces to simplify the reporting of fuel taxes by commercial interstate motor carriers. Trucks log miles traveled in each state and fuel gallons purchased. Quarterly, carriers pay tax based on gallons consumed in each state minus fuel tax already paid at the pump.',
      },
      {
        q: 'What is the average fuel mileage for commercial Class 8 semi trucks?',
        a: 'Standard Class 8 tractor-trailers (carrying 40,000 to 80,000 lbs gross vehicle weight) average between 6.0 and 7.5 MPG. Aerodynamic modern sleeper cabs with automated transmissions can achieve 7.5 to 8.5 MPG on flat highway corridors.',
      },
      {
        q: 'What are "practical miles" vs "short miles" in freight trucking?',
        a: 'Short miles (Household Goods / HHG miles) represent the shortest legal highway route between two zip codes. Practical miles represent the route most practical for commercial trucks (favoring interstate highways rather than secondary winding roads with lower weight limits). Practical miles are typically 5% to 10% longer than HHG miles.',
      },
    ],
  },

  // Cluster: Car Lease & PCP Excess Mileage
  {
    category: 'Car Lease & PCP Excess Mileage',
    icon: Car,
    questions: [
      {
        q: 'How do car lease and PCP excess mileage penalty charges work?',
        a: 'When leasing a vehicle or financing through Personal Contract Purchase (PCP), the contract specifies an annual mileage allowance (e.g., 10,000 miles/year, totaling 30,000 miles on a 36-month lease). If you return the vehicle over that limit, the finance company charges a contractual per-mile fee (typically $0.15 to $0.35/mile in the US, or 8p to 25p/mile in the UK).',
      },
      {
        q: 'How can I calculate if I am ahead of my lease mileage pace?',
        a: 'Divide your current odometer reading by the number of months elapsed. If your actual monthly average exceeds (Annual Allowance ÷ 12), you are ahead of pace and risk penalties at inspection return. Use our Car Lease & PCP tab to calculate your recommended daily driving target.',
      },
    ],
  },

  // Cluster: Air Miles & Flight Distance
  {
    category: 'Air Miles & Flight Distance',
    icon: Plane,
    questions: [
      {
        q: 'How is air flight distance between cities and airports calculated?',
        a: 'Flight distance is calculated using the Great-Circle distance formula (Haversine or Vincenty equations) based on the spherical latitude and longitude of departure and arrival airport runways. This represents the shortest flight path through the air.',
      },
      {
        q: 'What is the difference between statute air miles and nautical miles (NM)?',
        a: '1 Statute Mile = 1,609.34 meters (5,280 feet), standard in US terrestrial measurement. 1 Nautical Mile (NM) = 1,852 meters (approx 6,076.12 feet), based on one minute of latitude arc. Aviation and maritime transport use nautical miles for navigation and knot speed calculations (1 Knot = 1 NM/hour).',
      },
      {
        q: 'How are frequent flyer airline miles (Delta, United, Lufthansa Miles & More) estimated?',
        a: 'Historically, frequent flyer programs awarded 1 loyalty point per physical statute air mile flown. Today, elite qualifying miles (EQM) are still anchored to Great-Circle flight distances, adjusted by cabin fare class multipliers (1.0x Economy, 1.5x Business, 2.0x First Class).',
      },
    ],
  },
];

export default function FaqKnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryIndex, questionIndex) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Filter FAQs by search query
  const filteredCategories = FAQ_DATA.map((cat) => {
    const matchingQuestions = cat.questions.filter(
      (q) =>
        q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return {
      ...cat,
      questions: matchingQuestions,
    };
  }).filter((cat) => cat.questions.length > 0);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors mt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            Mileage, Distance & Reimbursement Knowledge Base
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Frequently Asked Questions & Comprehensive Mileage Guide
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Detailed answers covering driving distance measurement, IRS standard tax rates (2019–2026), gas mileage formulas, commercial IFTA trucking, lease excess penalties, and flight air miles.
          </p>
        </div>

        {/* Live Search Filter */}
        <div className="relative w-full md:w-72">
          <input
            type="text"
            placeholder="Search all mileage questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Accordion Categories */}
      <div className="pt-6 space-y-6">
        {filteredCategories.map((cat, catIdx) => {
          const Icon = cat.icon;
          return (
            <div key={catIdx} className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Icon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                {cat.category} ({cat.questions.length})
              </h3>

              <div className="space-y-2">
                {cat.questions.map((item, qIdx) => {
                  const key = `${catIdx}-${qIdx}`;
                  const isOpen = !!openItems[key];

                  return (
                    <div
                      key={qIdx}
                      className="border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden transition"
                    >
                      <button
                        type="button"
                        onClick={() => toggleItem(catIdx, qIdx)}
                        className="w-full px-5 py-3.5 flex items-center justify-between bg-slate-50 dark:bg-slate-900/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition"
                      >
                        <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                          {item.q}
                        </span>
                        {isOpen ? (
                          <ChevronUp className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="p-5 text-xs text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800/90 leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-700/80">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-xs">
            No questions matching "{searchQuery}". Try searching for "IRS", "MPG", "IFTA", or "distance".
          </div>
        )}
      </div>
    </div>
  );
}

