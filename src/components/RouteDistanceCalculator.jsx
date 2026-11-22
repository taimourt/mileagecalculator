import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ArrowRightLeft, 
  Plus, 
  Trash2, 
  Navigation, 
  Clock, 
  Fuel, 
  DollarSign, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { POPULAR_ROUTES, CITY_COORDINATES } from '../data/cityPresets';
import { geocodeLocation, getDrivingRoute } from '../utils/geocoding';
import { formatCurrency, formatNumber, formatDuration } from '../utils/formatters';
import LeafletMap from './LeafletMap';
import CalculatorEducationalSection from './common/CalculatorEducationalSection';
import { Copy, Check, RotateCcw, Compass, Zap, FileText } from 'lucide-react';

export default function RouteDistanceCalculator({
  unitSystem = 'us',
  currency = 'USD',
  onSendToTripCost,
  onSendToMileage,
  onNavigateTab,
}) {
  const [fromAddress, setFromAddress] = useState('New York, NY');
  const [toAddress, setToAddress] = useState('Boston, MA');
  const [waypoints, setWaypoints] = useState([]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [avoidTolls, setAvoidTolls] = useState(false);
  
  // Fuel estimate parameters
  const [vehicleMpg, setVehicleMpg] = useState(28);
  const [fuelPrice, setFuelPrice] = useState(3.50);

  // Results & status
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [routeResult, setRouteResult] = useState(null);
  const [mapPoints, setMapPoints] = useState([]);
  const [polylineCoords, setPolylineCoords] = useState([]);
  const [copied, setCopied] = useState(false);

  // Auto-calculate on initial load
  useEffect(() => {
    calculateRoute();
  }, []);

  const handleSwap = () => {
    const temp = fromAddress;
    setFromAddress(toAddress);
    setToAddress(temp);
  };

  const handleAddWaypoint = () => {
    if (waypoints.length >= 4) return;
    setWaypoints([...waypoints, '']);
  };

  const handleUpdateWaypoint = (index, val) => {
    const updated = [...waypoints];
    updated[index] = val;
    setWaypoints(updated);
  };

  const handleRemoveWaypoint = (index) => {
    setWaypoints(waypoints.filter((_, i) => i !== index));
  };

  const applyPreset = (preset) => {
    setFromAddress(preset.from);
    setToAddress(preset.to);
    setWaypoints([]);
    setIsRoundTrip(false);
    // Trigger calculation
    setTimeout(() => {
      calculateRouteWithAddresses(preset.from, preset.to, []);
    }, 50);
  };

  const calculateRouteWithAddresses = async (from, to, stops) => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      // 1. Geocode Start
      const startCoord = await geocodeLocation(from);
      if (!startCoord) {
        throw new Error(`Could not find location for "${from}". Please check the spelling or add state/country.`);
      }

      // 2. Geocode Waypoints
      const stopCoords = [];
      for (const stop of stops) {
        if (stop.trim()) {
          const c = await geocodeLocation(stop);
          if (c) stopCoords.push(c);
        }
      }

      // 3. Geocode End
      const endCoord = await geocodeLocation(to);
      if (!endCoord) {
        throw new Error(`Could not find location for "${to}". Please check the spelling or add state/country.`);
      }

      const allPoints = [startCoord, ...stopCoords, endCoord];
      setMapPoints(allPoints);

      // 4. Fetch route
      const route = await getDrivingRoute(allPoints);
      if (!route) {
        throw new Error('Unable to compute road driving route between these points.');
      }

      setRouteResult(route);
      setPolylineCoords(route.polylineCoordinates || []);
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Error calculating route.');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateRoute = () => {
    calculateRouteWithAddresses(fromAddress, toAddress, waypoints);
  };

  // Distance adjustments
  const baseMiles = routeResult ? routeResult.distanceMiles : 0;
  const totalMiles = isRoundTrip ? baseMiles * 2 : baseMiles;
  const baseKm = routeResult ? routeResult.distanceKm : 0;
  const totalKm = isRoundTrip ? baseKm * 2 : baseKm;
  const totalHours = routeResult ? (isRoundTrip ? routeResult.durationHours * 2 : routeResult.durationHours) : 0;

  // Fuel computations
  const gallonsNeeded = vehicleMpg > 0 ? totalMiles / vehicleMpg : 0;
  const litersNeeded = gallonsNeeded * 3.78541;
  const estimatedFuelCost = (unitSystem === 'us' ? gallonsNeeded : litersNeeded) * fuelPrice;
  const costPerMile = totalMiles > 0 ? estimatedFuelCost / totalMiles : 0;

  return (
    <div className="space-y-6">
      {/* Header Intro */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Advanced Driving Distance Engine
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Driving Mileage & Route Calculator
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Calculate exact driving distance, travel time, live turn polyline map, multi-stop waypoints, and real-time fuel expense between any two or more locations.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 max-w-md">
            <span className="w-full text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Popular Routes
            </span>
            {POPULAR_ROUTES.slice(0, 5).map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => applyPreset(preset)}
                className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-medium transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Form & Route Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
          {/* Left Form: Inputs (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Origin */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                Origin (From)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  placeholder="e.g. New York, NY or 1600 Amphitheatre Pkwy"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none transition"
                />
                <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Waypoints */}
            {waypoints.map((wp, idx) => (
              <div key={idx} className="relative animate-fadeIn">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                  Stop #{idx + 1}
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={wp}
                      onChange={(e) => handleUpdateWaypoint(idx, e.target.value)}
                      placeholder={`Stopover ${idx + 1} address or city`}
                      className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
                    />
                    <Navigation className="w-4 h-4 text-blue-500 absolute left-3 top-3" />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveWaypoint(idx)}
                    className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-900 transition"
                    title="Remove stop"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Swap & Add Stop Row */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleSwap}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 py-1 transition"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Swap Origin & Destination
              </button>

              {waypoints.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddWaypoint}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline py-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Waypoint Stop
                </button>
              )}
            </div>

            {/* Destination */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                Destination (To)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="e.g. Boston, MA or Los Angeles, CA"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none transition"
                />
                <MapPin className="w-4 h-4 text-rose-600 absolute left-3 top-3.5" />
              </div>
            </div>

            {/* Route Options Toggles */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Round Trip (Return)</span>
                <button
                  type="button"
                  onClick={() => setIsRoundTrip(!isRoundTrip)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    isRoundTrip ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      isRoundTrip ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Avoid High Tolls</span>
                <button
                  type="button"
                  onClick={() => setAvoidTolls(!avoidTolls)}
                  className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                    avoidTolls ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                      avoidTolls ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Fuel Cost Parameters on Route */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Fuel className="w-3.5 h-3.5 text-emerald-600" />
                Live Fuel Cost Parameters
              </span>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    {unitSystem === 'us' ? 'Vehicle MPG' : 'Fuel Economy (km/L)'}
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    value={vehicleMpg}
                    onChange={(e) => setVehicleMpg(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">
                    Fuel Price ({unitSystem === 'us' ? `${currency}/gal` : `${currency}/L`})
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    value={fuelPrice}
                    onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="button"
              onClick={calculateRoute}
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 shadow-md shadow-emerald-600/25 active:scale-[0.99] transition flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Calculating Routing Data...
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  Calculate Mileage & Driving Route
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>

          {/* Right Area: Interactive Map (7 cols) */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Interactive Road Route & Turn Polyline Map
              </span>
              <span className="text-[11px] text-slate-400">
                Zoom & Pan freely • Drag pins
              </span>
            </div>
            <div className="flex-1 min-h-[380px] w-full">
              <LeafletMap points={mapPoints} routeCoordinates={polylineCoords} />
            </div>
          </div>
        </div>

        {/* Calculated Results Summary Cards */}
        {routeResult && (
          <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-700/60 animate-fadeIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                Calculated Route Mileage Summary
                {isRoundTrip && (
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                    Round-Trip (2-Way)
                  </span>
                )}
              </h3>

              {/* Action Buttons to send to other tabs */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => {
                    const summary = `Driving Route Summary:\nFrom: ${fromAddress} to ${toAddress}${waypoints.filter(Boolean).length > 0 ? ` (via ${waypoints.filter(Boolean).join(', ')})` : ''}\nDistance: ${formatNumber(unitSystem === 'us' ? totalMiles : totalKm, 1)} ${unitSystem === 'us' ? 'miles' : 'km'}\nDriving Time: ${formatDuration(totalHours)}\nFuel Required: ${formatNumber(unitSystem === 'us' ? gallonsNeeded : litersNeeded, 1)} ${unitSystem === 'us' ? 'gal' : 'L'} (~${formatCurrency(estimatedFuelCost, currency)})\nCalculated on MileageCalculatorPro.com`;
                    navigator.clipboard.writeText(summary).then(() => {
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2500);
                    });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-emerald-500 text-xs font-semibold text-slate-700 dark:text-slate-200 transition shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
                </button>

                {onSendToTripCost && (
                  <button
                    type="button"
                    onClick={() => onSendToTripCost(totalMiles, vehicleMpg, fuelPrice)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100 text-xs font-semibold border border-emerald-200 dark:border-emerald-800 transition"
                  >
                    Open in Trip Cost Splitter
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Distance */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/40 dark:from-slate-800 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-slate-500">Driving Distance</span>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatNumber(unitSystem === 'us' ? totalMiles : totalKm, 1)}
                  <span className="text-sm font-semibold ml-1 text-slate-600 dark:text-slate-400">
                    {unitSystem === 'us' ? 'miles' : 'km'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ({formatNumber(unitSystem === 'us' ? totalKm : totalMiles, 1)} {unitSystem === 'us' ? 'km' : 'mi'})
                </div>
              </div>

              {/* Estimated Driving Time */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 dark:from-slate-800 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-slate-500">Driving Time</span>
                <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                  {formatDuration(totalHours)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  ~{Math.round(totalMiles / Math.max(0.1, totalHours))} mph average speed
                </div>
              </div>

              {/* Fuel Required */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-amber-50/40 dark:from-slate-800 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-slate-500">Fuel Required</span>
                <div className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                  {formatNumber(unitSystem === 'us' ? gallonsNeeded : litersNeeded, 1)}
                  <span className="text-sm font-semibold ml-1 text-slate-600 dark:text-slate-400">
                    {unitSystem === 'us' ? 'gal' : 'L'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  at {vehicleMpg} {unitSystem === 'us' ? 'mpg' : 'km/L'}
                </div>
              </div>

              {/* Estimated Fuel Cost */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-purple-50/40 dark:from-slate-800 dark:to-slate-800/80 border border-slate-200 dark:border-slate-700">
                <span className="text-xs font-bold uppercase text-slate-500">Estimated Fuel Cost</span>
                <div className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">
                  {formatCurrency(estimatedFuelCost, currency)}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {formatCurrency(costPerMile, currency)} per mile
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Educational Section */}
      <CalculatorEducationalSection
        title="Driving Route & Distance Calculator"
        whatIsIt="The Driving Route & Distance Calculator computes real-world road highway mileage, travel duration, and fuel consumption between any two or more addresses, cities, or GPS coordinates. By querying OpenStreetMap and the Open Source Routing Machine (OSRM) highway network graph, it traces actual turn-by-turn road polylines, accounting for highway ramps, river crossings, and road circuity rather than relying on straight-line air distance."
        howToUse={[
          'Enter your starting location (Origin) and final destination (City, address, or zip code).',
          'Optionally click "+ Add Waypoint Stop" to add up to 4 intermediate stops along your itinerary.',
          'Adjust vehicle fuel economy (MPG) and current local gas prices to get a live fuel expense forecast.',
          'Review the interactive Leaflet map, turn polyline, travel duration, and export or transfer results directly to the Trip Cost Splitter.',
        ]}
        formula={
`// 1. Road Network Distance vs Geodesic Distance
Road Distance (D_road) = Σ (Segment lengths along OpenStreetMap road graph)
Geodesic Air Distance (D_geo) = 2R · arcsin(√(sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)))
Road Circuity Factor (CI) = D_road ÷ D_geo  ≈ 1.20 to 1.25

// 2. Fuel Consumption
Fuel Required (Gallons) = Total Road Distance (miles) ÷ Vehicle Fuel Economy (MPG)
Fuel Required (Liters) = (Total Distance in km × L/100km) ÷ 100

// 3. Estimated Fuel Cost
Fuel Cost = Fuel Required × Fuel Price per Gallon (or Liter)`
        }
        example={{
          scenario: 'A sales consultant drives from New York, NY to Boston, MA (215 driving miles) in a sedan achieving 30 MPG with gasoline at $3.50 per gallon.',
          inputs: ['Origin: New York, NY', 'Destination: Boston, MA', 'Vehicle MPG: 30.0 MPG', 'Gas Price: $3.50 / gallon'],
          results: ['Actual Road Distance: 215.3 miles (346.5 km)', 'Estimated Travel Time: 3 hours 45 minutes', 'Fuel Required: 7.18 gallons', 'Estimated Fuel Cost: $25.13', 'Cost Per Mile: $0.117 / mile']
        }}
        understandingResults={[
          { term: 'Driving Road Distance', definition: 'The physical terrestrial distance along navigable highways and streets, which is typically 15% to 30% longer than straight-line distance due to terrain and highway geometry.' },
          { term: 'Estimated Driving Time', definition: 'The estimated transit duration assuming standard speed limits across highway and arterial segments under free-flow conditions.' },
          { term: 'Fuel Required', definition: 'The projected volume of fuel consumed based on entered vehicle economy parameters.' },
          { term: 'Cost Per Mile', definition: 'The direct fuel expense incurred for each mile driven on this route.' },
        ]}
        factors={[
          'Traffic Congestion: Real-time rush hour slowdowns, construction, and traffic accidents will increase travel time and idle fuel consumption.',
          'Speed & Aggressive Driving: Highway speeds exceeding 65 mph (105 km/h) dramatically increase aerodynamic wind resistance, reducing fuel economy.',
          'Cold Weather: Winter driving decreases battery range for EVs and increases warm-up fuel consumption for internal combustion engines.',
          'Toll Roads vs Free Highways: Major interstates often include bridge or turnpike tolls that should be budgeted using our Trip Cost Splitter.',
        ]}
        faqs={[
          {
            q: 'How does this tool calculate driving distance compared to Google Maps?',
            a: 'Our calculator utilizes the Open Source Routing Machine (OSRM) engine and OpenStreetMap (OSM) roadway data, computing actual highway routes, street turns, and driving distances with high precision while keeping your searches 100% private in your browser.'
          },
          {
            q: 'Why is road driving distance always greater than straight-line "as the crow flies" distance?',
            a: 'Straight-line distance (orthodromic distance) measures the shortest path through the Earth\'s curvature. Roads must navigate hills, rivers, property lines, and existing urban grids. The ratio between road distance and straight-line distance is called the Circuity Index, which averages 1.20 to 1.25 across North American highway networks.'
          },
          {
            q: 'Can I add multiple stops or delivery destinations to my route?',
            a: 'Yes! Click the "+ Add Waypoint Stop" button to add up to 4 intermediate stops. The routing engine recalculates the entire accumulated trip distance, transit time, and fuel budget.'
          },
          {
            q: 'What should I do if an address or small town is not found?',
            a: 'Try adding the state, province, or postal code (e.g. "Springfield, IL" or "90210"). Our geocoding system uses OpenStreetMap Nominatim with a built-in cache of major world cities as fallback.'
          }
        ]}
        relatedCalculators={[
          { id: 'trip', title: 'Road Trip Cost Splitter', description: 'Budget fuel, tolls, and parking expenses and split costs evenly among passengers.', icon: Compass },
          { id: 'mileage', title: 'Gas Mileage & Odometer', description: 'Verify your vehicle\'s actual real-world MPG using full-tank odometer math.', icon: Fuel },
          { id: 'measure', title: 'Map Distance Measurement', description: 'Measure direct straight-line distances and custom walking paths by clicking on a map.', icon: Ruler },
        ]}
        onNavigateTab={onNavigateTab}
      />
    </div>
  );
}

