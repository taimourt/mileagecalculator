import React, { useState, useMemo } from 'react';
import { 
  Plane, 
  Compass, 
  Clock, 
  Award, 
  MapPin, 
  ArrowRightLeft,
  Anchor,
  Globe2,
  CheckCircle
} from 'lucide-react';
import { haversineDistance } from '../utils/geocoding';
import { formatNumber, formatDuration } from '../utils/formatters';
import CalculatorEducationalSection from './common/CalculatorEducationalSection';

const POPULAR_AIRPORTS = [
  { code: 'JFK', name: 'New York (JFK)', city: 'New York', lat: 40.6413, lng: -73.7781 },
  { code: 'LHR', name: 'London Heathrow (LHR)', city: 'London', lat: 51.4700, lng: -0.4543 },
  { code: 'LAX', name: 'Los Angeles (LAX)', city: 'Los Angeles', lat: 33.9416, lng: -118.4085 },
  { code: 'DXB', name: 'Dubai (DXB)', city: 'Dubai', lat: 25.2532, lng: 55.3657 },
  { code: 'HND', name: 'Tokyo Haneda (HND)', city: 'Tokyo', lat: 35.5494, lng: 139.7798 },
  { code: 'CDG', name: 'Paris Charles de Gaulle (CDG)', city: 'Paris', lat: 49.0097, lng: 2.5479 },
  { code: 'ORD', name: 'Chicago O\'Hare (ORD)', city: 'Chicago', lat: 41.9742, lng: -87.9073 },
  { code: 'SIN', name: 'Singapore Changi (SIN)', city: 'Singapore', lat: 1.3644, lng: 103.9915 },
  { code: 'SYD', name: 'Sydney Kingsford Smith (SYD)', city: 'Sydney', lat: -33.9399, lng: 151.1753 },
  { code: 'SFO', name: 'San Francisco (SFO)', city: 'San Francisco', lat: 37.6213, lng: -122.3790 },
  { code: 'FRA', name: 'Frankfurt (FRA)', city: 'Frankfurt', lat: 50.0379, lng: 8.5622 },
  { code: 'YYZ', name: 'Toronto Pearson (YYZ)', city: 'Toronto', lat: 43.6777, lng: -79.6248 },
];

export default function AirMilesCalculator() {
  const [originCode, setOriginCode] = useState('JFK');
  const [destCode, setDestCode] = useState('LHR');
  const [cabinClass, setCabinClass] = useState('economy'); // 'economy' | 'business' | 'first'

  const originAirport = POPULAR_AIRPORTS.find((a) => a.code === originCode) || POPULAR_AIRPORTS[0];
  const destAirport = POPULAR_AIRPORTS.find((a) => a.code === destCode) || POPULAR_AIRPORTS[1];

  const handleSwap = () => {
    const temp = originCode;
    setOriginCode(destCode);
    setDestCode(temp);
  };

  const flightData = useMemo(() => {
    // Great circle air distance in statute miles
    const airMiles = haversineDistance(
      originAirport.lat,
      originAirport.lng,
      destAirport.lat,
      destAirport.lng
    );

    const kilometers = airMiles * 1.609344;
    const nauticalMiles = airMiles * 0.868976;

    // Flight time estimate: ~500 mph cruising speed + 30 min takeoff/landing taxi
    const cruisingHours = airMiles / 510;
    const totalFlightHours = cruisingHours + 0.5;

    // Frequent flyer miles loyalty multiplier
    let loyaltyMultiplier = 1.0;
    if (cabinClass === 'business') loyaltyMultiplier = 1.5;
    if (cabinClass === 'first') loyaltyMultiplier = 2.0;

    const frequentFlyerMiles = Math.round(airMiles * loyaltyMultiplier);

    // Ground equivalent estimate (if driving was possible)
    const estimatedRoadMiles = airMiles * 1.25;

    return {
      airMiles,
      kilometers,
      nauticalMiles,
      totalFlightHours,
      frequentFlyerMiles,
      estimatedRoadMiles,
    };
  }, [originAirport, destAirport, cabinClass]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950/60 dark:text-cyan-300 text-xs font-bold mb-2">
              <Plane className="w-3.5 h-3.5" />
              Aviation Great-Circle & Frequent Flyer Miles
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Air Miles & Flight Distance Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Calculate exact Great-Circle flight distances, aeronautical nautical miles (NM), estimated air travel duration, and frequent flyer mileage points between worldwide airports and cities.
            </p>
          </div>
        </div>

        {/* Airport Selectors */}
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 pt-6 items-center">
          {/* Origin (5 cols) */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Departure Airport (Origin)
            </label>
            <select
              value={originCode}
              onChange={(e) => setOriginCode(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
            >
              {POPULAR_AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.name} ({a.city})
                </option>
              ))}
            </select>
          </div>

          {/* Swap (1 col) */}
          <div className="md:col-span-1 flex justify-center pt-5">
            <button
              type="button"
              onClick={handleSwap}
              className="p-3 rounded-2xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-600 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition"
              title="Swap departure and arrival"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* Destination (5 cols) */}
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Arrival Airport (Destination)
            </label>
            <select
              value={destCode}
              onChange={(e) => setDestCode(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500"
            >
              {POPULAR_AIRPORTS.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.name} ({a.city})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Cabin Class Selection */}
        <div className="pt-4 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Cabin Fare Class (Loyalty Tier Multiplier):
          </span>
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setCabinClass('economy')}
              className={`px-3 py-1.5 rounded-lg transition ${
                cabinClass === 'economy'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Economy (1.0x)
            </button>
            <button
              type="button"
              onClick={() => setCabinClass('business')}
              className={`px-3 py-1.5 rounded-lg transition ${
                cabinClass === 'business'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Business (1.5x)
            </button>
            <button
              type="button"
              onClick={() => setCabinClass('first')}
              className={`px-3 py-1.5 rounded-lg transition ${
                cabinClass === 'first'
                  ? 'bg-cyan-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              First Class (2.0x)
            </button>
          </div>
        </div>

        {/* Output Metrics Grid */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Statute Air Miles */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-100">
                Statute Air Miles
              </span>
              <div className="text-3xl sm:text-4xl font-black mt-1">
                {formatNumber(flightData.airMiles, 0)}{' '}
                <span className="text-base font-bold text-cyan-100">miles</span>
              </div>
              <div className="text-xs text-cyan-100 mt-2 font-medium">
                {formatNumber(flightData.kilometers, 0)} km direct orthodromic distance
              </div>
            </div>

            {/* Nautical Miles */}
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Aeronautical Nautical Miles
              </span>
              <div className="text-3xl sm:text-4xl font-black text-cyan-400 mt-1">
                {formatNumber(flightData.nauticalMiles, 0)}{' '}
                <span className="text-base font-bold text-slate-400">NM</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                Standard international ICAO aviation unit
              </div>
            </div>

            {/* Estimated Flight Time */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                Estimated Flight Time
              </span>
              <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-1">
                {formatDuration(flightData.totalFlightHours)}
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                At 510 mph commercial cruising airspeed
              </div>
            </div>

            {/* Frequent Flyer Loyalty Miles */}
            <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-500">
                Frequent Flyer Miles
              </span>
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatNumber(flightData.frequentFlyerMiles, 0)}{' '}
                <span className="text-base font-bold text-slate-400">pts</span>
              </div>
              <div className="text-xs text-slate-400 mt-2 font-medium">
                Eligible base elite qualifying miles
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Educational Guide */}
      <CalculatorEducationalSection
        title="Aeronautical Air Miles & Flight Distance Calculator"
        whatIsIt="The Aeronautical Air Miles Calculator computes precise great-circle flight distances between commercial airports worldwide using official IATA and ICAO aerodrome geodetic coordinates. It models great-circle statute miles, nautical miles (NM), estimated airborne gate-to-gate flight durations based on 510 MPH typical commercial jet cruising airspeeds, and airline frequent flyer loyalty program base points."
        howToUse={[
          'Select or search your departure airport from the departure dropdown (e.g., JFK - New York).',
          'Select your destination airport (e.g., LHR - London Heathrow).',
          'Review the calculated orthodromic great-circle flight path distance.',
          'Check estimated airborne flight time, nautical mile equivalents, and eligible elite qualifying points.'
        ]}
        formula={`d = 2R \\cdot \\arcsin\\left(\\sqrt{\\sin^2\\left(\\frac{\\Delta\\phi}{2}\\right) + \\cos(\\phi_1)\\cos(\\phi_2)\\sin^2\\left(\\frac{\\Delta\\lambda}{2}\\right)}\\right)

\\text{Nautical Miles} = \\frac{\\text{Statute Miles}}{1.150779}

\\text{Flight Time (Hours)} = \\frac{\\text{Distance}}{510\\text{ MPH}} + 0.5\\text{ hr (Taxi, Climb & Approach)}`}
        example={{
          description: 'Calculating a transatlantic commercial flight from New York JFK to London Heathrow (LHR):',
          inputs: [
            { label: 'Departure Airport', value: 'JFK (40.6413° N, 73.7781° W)' },
            { label: 'Arrival Airport', value: 'LHR (51.4700° N, 0.4543° W)' },
            { label: 'Cruising Airspeed', value: '510 MPH typical Boeing 777 / Airbus A350 cruise' }
          ],
          steps: [
            'Convert geographic coordinates into spherical radians.',
            'Execute Haversine spherical arc trigonometry with R = 3,958.8 statute miles.',
            'Great-circle distance = 3,451 statute miles (3,000 nautical miles / 5,554 km).',
            'Airborne flight time: (3,451 ÷ 510) + 0.5 taxi/descent ≈ 7 hours 15 minutes.'
          ],
          result: 'Flight Distance: 3,451 miles (3,000 NM). Estimated airborne duration: ~7h 15m. Base Frequent Flyer Points: 3,451.'
        }}
        understandingResults={[
          { label: 'Statute Air Miles', desc: 'The direct shortest line flight distance across the Earth measured in land miles (5,280 ft).' },
          { label: 'Nautical Miles (NM)', desc: 'The universal unit of aviation and maritime navigation (1 NM = 1,852 meters).' },
          { label: 'Frequent Flyer Miles', desc: 'Standard 1:1 base elite qualifying miles (EQMs) credited before cabin class multiplier bonuses.' }
        ]}
        factors={[
          { name: 'Jet Stream Wind Velocities', impact: 'High-altitude jet streams (often exceeding 120–160 knots) shorten eastbound transatlantic flights by over an hour, while adding flight time when heading westbound.' },
          { name: 'Air Traffic Control Routing', impact: 'Actual flight plans follow organized North Atlantic Tracks (NATs) or Pacific Organised Track Systems (PACOTS) to maintain radar separation, slightly exceeding theoretical great-circle routes.' },
          { name: 'Extended Twin-Engine Operations (ETOPS)', impact: 'Twin-engine passenger planes follow routes that remain within certified diversion distances (e.g. 180 or 240 minutes) from suitable emergency alternate runways.' }
        ]}
        faqs={[
          {
            q: 'Why do flight paths curve toward the North Pole on flat maps?',
            a: 'Because the Earth is a three-dimensional sphere, the shortest distance between two points (a great circle) projects as an upward arching curve when flattened onto a standard cylindrical Mercator projection map.'
          },
          {
            q: 'Do frequent flyer loyalty programs award miles based on actual distance or ticket price?',
            a: 'Traditionally programs awarded 1 mile per air mile flown. Modern US airline programs (Delta SkyMiles, United MileagePlus, American AAdvantage) now award redeemable miles based on fare dollars spent, but still use physical flight distance for elite status qualification (EQMs).'
          },
          {
            q: 'How accurate is the flight duration estimate?',
            a: 'Our calculator uses a standardized commercial jet cruise benchmark (510 MPH / 443 knots true airspeed) plus 30 minutes for taxi, climb to 35,000 ft, and instrument approach. Real-world block times vary by wind velocity and airport runway congestion.'
          }
        ]}
        relatedCalculators={[
          { id: 'route', name: 'Driving Route Distance Calculator', desc: 'Compare flight vs driving route distance' },
          { id: 'measure', name: 'Map Distance Tool', desc: 'Interactive point-to-point map distance' },
          { id: 'convert', name: 'Distance Unit Converter', desc: 'Convert nautical miles, statute miles, and km' }
        ]}
        relatedGuides={[
          { id: 'how-to-estimate-driving-distance', title: 'How to Estimate Driving Distance', desc: 'Great-circle vs road circuity comparison' },
          { id: 'miles-vs-kilometers-understanding-distance-units', title: 'Miles vs Kilometers', desc: 'Statute mile vs nautical mile definitions' }
        ]}
      />
    </div>
  );
}

