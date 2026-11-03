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
    </div>
  );
}

