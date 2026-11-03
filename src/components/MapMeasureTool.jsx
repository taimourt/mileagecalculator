import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { 
  Ruler, 
  Trash2, 
  Undo, 
  MapPin, 
  Navigation2, 
  Compass, 
  Layers, 
  Info,
  CheckCircle,
  Eye,
  Footprints,
  Bike,
  Car
} from 'lucide-react';
import { haversineDistance } from '../utils/geocoding';
import { formatNumber } from '../utils/formatters';

export default function MapMeasureTool({ unitSystem = 'us', currency = 'USD' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);

  const [points, setPoints] = useState([]);
  const [measurementMode, setMeasurementMode] = useState('straight'); // 'straight' | 'walking' | 'driving'
  const [mapTile, setMapTile] = useState('streets'); // 'streets' | 'satellite'

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current, {
        center: [39.8283, -98.5795],
        zoom: 4,
        zoomControl: true,
      });

      const tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      mapInstanceRef.current._tileLayer = tileLayer;

      // Handle map click to drop measurement pins
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        setPoints((prev) => [...prev, { lat, lng, id: Date.now() + Math.random() }]);
      });
    }

    return () => {
      // Map cleanup if needed
    };
  }, []);

  // Update markers and polyline when points change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear old markers
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];

    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    if (points.length === 0) return;

    // Add new markers with point number
    const newMarkers = points.map((p, idx) => {
      const isStart = idx === 0;
      const isEnd = idx === points.length - 1 && points.length > 1;
      const color = isStart ? '#16a34a' : isEnd ? '#dc2626' : '#2563eb';

      const pinIcon = L.divIcon({
        className: 'measure-pin',
        html: `<div style="background-color: ${color}; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 11px; box-shadow: 0 3px 6px rgba(0,0,0,0.35); border: 2px solid white;">${idx + 1}</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      const marker = L.marker([p.lat, p.lng], { icon: pinIcon }).addTo(map);
      marker.bindPopup(`<b>Point ${idx + 1}</b><br/>Lat: ${p.lat.toFixed(5)}<br/>Lng: ${p.lng.toFixed(5)}`);
      return marker;
    });

    markersRef.current = newMarkers;

    // Draw connecting polyline
    if (points.length > 1) {
      const latlngs = points.map((p) => [p.lat, p.lng]);
      const poly = L.polyline(latlngs, {
        color: '#2563eb',
        weight: 4,
        opacity: 0.85,
        dashArray: measurementMode === 'straight' ? '6, 8' : null,
      }).addTo(map);

      polylineRef.current = poly;
    }
  }, [points, measurementMode]);

  // Handle tile switch
  const handleTileSwitch = (tileType) => {
    setMapTile(tileType);
    const map = mapInstanceRef.current;
    if (!map) return;

    if (map._tileLayer) {
      map.removeLayer(map._tileLayer);
    }

    let url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attr = '&copy; OpenStreetMap contributors';

    if (tileType === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attr = 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community';
    }

    map._tileLayer = L.tileLayer(url, { attribution: attr, maxZoom: 19 }).addTo(map);
  };

  // Calculate cumulative straight line distance
  const { totalMiles, totalKm, totalFeet, totalMeters, nauticalMiles } = React.useMemo(() => {
    if (points.length < 2) {
      return { totalMiles: 0, totalKm: 0, totalFeet: 0, totalMeters: 0, nauticalMiles: 0 };
    }

    let miles = 0;
    for (let i = 0; i < points.length - 1; i++) {
      miles += haversineDistance(points[i].lat, points[i].lng, points[i + 1].lat, points[i + 1].lng);
    }

    // Road circuity adjustment if driving mode selected
    if (measurementMode === 'driving') {
      miles *= 1.22; // Average road tortuosity
    } else if (measurementMode === 'walking') {
      miles *= 1.15; // Footpath winding
    }

    const km = miles * 1.609344;
    const feet = miles * 5280;
    const meters = km * 1000;
    const nm = miles * 0.868976;

    return { totalMiles: miles, totalKm: km, totalFeet: feet, totalMeters: meters, nauticalMiles: nm };
  }, [points, measurementMode]);

  const handleClear = () => {
    setPoints([]);
  };

  const handleUndo = () => {
    setPoints((prev) => prev.slice(0, -1));
  };

  // Quick preset points to test instantly
  const loadPresetDistance = (presetName) => {
    if (presetName === 'nyc-centralpark') {
      setPoints([
        { lat: 40.7644, lng: -73.9731, id: 1 },
        { lat: 40.7829, lng: -73.9654, id: 2 },
        { lat: 40.8006, lng: -73.9581, id: 3 },
      ]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([40.7825, -73.9660], 13);
      }
    } else if (presetName === 'london-river') {
      setPoints([
        { lat: 51.5033, lng: -0.1195, id: 1 }, // London Eye
        { lat: 51.5081, lng: -0.0759, id: 2 }, // Tower of London
        { lat: 51.5055, lng: -0.0754, id: 3 }, // Tower Bridge
      ]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([51.505, -0.09], 13);
      }
    } else if (presetName === 'sf-goldengate') {
      setPoints([
        { lat: 37.8077, lng: -122.475, id: 1 }, // Presidio
        { lat: 37.8199, lng: -122.4783, id: 2 }, // Golden Gate Mid
        { lat: 37.8324, lng: -122.4795, id: 3 }, // Marin Headlands
      ]);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setView([37.82, -122.48], 13);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100 dark:border-slate-700/60">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 text-xs font-bold mb-2">
              <Ruler className="w-3.5 h-3.5" />
              Interactive Map Distance Measurement Tool (Google Maps Style)
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Measure Distance on Map — Straight Line & Multi-Point
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Click anywhere on the interactive map to measure direct straight-line distance ("as the crow flies"), air miles, road travel estimates, running loops, and walking paths between two or multiple points.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">Quick Demos:</span>
            <button
              type="button"
              onClick={() => loadPresetDistance('nyc-centralpark')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
            >
              NYC Central Park Run
            </button>
            <button
              type="button"
              onClick={() => loadPresetDistance('sf-goldengate')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
            >
              Golden Gate Bridge
            </button>
            <button
              type="button"
              onClick={() => loadPresetDistance('london-river')}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-blue-50 hover:text-blue-600 transition font-medium"
            >
              London Thames Walk
            </button>
          </div>
        </div>

        {/* Toolbar & Live Metrics */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls Column (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Mode selection */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Measurement Methodology
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setMeasurementMode('straight')}
                  className={`py-2 rounded-xl transition flex flex-col items-center gap-1 ${
                    measurementMode === 'straight'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Straight line distance / As the crow flies / Air miles"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Straight Line
                </button>
                <button
                  type="button"
                  onClick={() => setMeasurementMode('walking')}
                  className={`py-2 rounded-xl transition flex flex-col items-center gap-1 ${
                    measurementMode === 'walking'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Walking / Running path distance"
                >
                  <Footprints className="w-3.5 h-3.5" />
                  Walking Path
                </button>
                <button
                  type="button"
                  onClick={() => setMeasurementMode('driving')}
                  className={`py-2 rounded-xl transition flex flex-col items-center gap-1 ${
                    measurementMode === 'driving'
                      ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Driving road distance factor"
                >
                  <Car className="w-3.5 h-3.5" />
                  Road Est.
                </button>
              </div>
            </div>

            {/* Map Layer Switcher */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Map View Style
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleTileSwitch('streets')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition ${
                    mapTile === 'streets'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Street Map
                </button>
                <button
                  type="button"
                  onClick={() => handleTileSwitch('satellite')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition ${
                    mapTile === 'satellite'
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Satellite Imagery
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleUndo}
                disabled={points.length === 0}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 disabled:opacity-40 text-slate-700 dark:text-slate-300 text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Undo className="w-3.5 h-3.5" />
                Undo Last
              </button>
              <button
                type="button"
                onClick={handleClear}
                disabled={points.length === 0}
                className="flex-1 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/70 disabled:opacity-40 text-rose-600 dark:text-rose-400 text-xs font-bold border border-rose-200 dark:border-rose-900 transition flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear All
              </button>
            </div>

            {/* Instructions box */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
              <div className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-blue-500" />
                How to use:
              </div>
              <p>1. Click on the map to place your starting pin (Point 1).</p>
              <p>2. Click anywhere else to add Point 2, 3, etc.</p>
              <p>3. The total distance automatically calculates across all units in real time.</p>
            </div>

            {/* Points count badge */}
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center justify-between px-1">
              <span>Points Placed:</span>
              <span className="font-bold text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 rounded-full">
                {points.length} {points.length === 1 ? 'point' : 'points'}
              </span>
            </div>
          </div>

          {/* Interactive Map (8 cols) */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="relative w-full h-[440px] rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner">
              <div ref={mapContainerRef} className="w-full h-full z-10" />
              
              {/* Overlay Tip */}
              <div className="absolute top-3 left-3 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-sm flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-500" />
                Click map to drop measurement points
              </div>
            </div>
          </div>
        </div>

        {/* Calculated Results Matrix */}
        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              Measured Distance Output
              {measurementMode === 'straight' && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                  Straight-Line Air Miles (Direct)
                </span>
              )}
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {/* Miles */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50/40 dark:from-slate-900 dark:to-slate-800 border border-blue-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Miles</span>
              <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-1">
                {formatNumber(totalMiles, 2)}
                <span className="text-xs font-semibold text-slate-400 ml-1">mi</span>
              </div>
            </div>

            {/* Kilometers */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-slate-900 dark:to-slate-800 border border-emerald-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Kilometers</span>
              <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                {formatNumber(totalKm, 2)}
                <span className="text-xs font-semibold text-slate-400 ml-1">km</span>
              </div>
            </div>

            {/* Feet */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Feet</span>
              <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                {formatNumber(totalFeet, 0)}
                <span className="text-xs font-semibold text-slate-400 ml-1">ft</span>
              </div>
            </div>

            {/* Meters */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Meters</span>
              <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                {formatNumber(totalMeters, 0)}
                <span className="text-xs font-semibold text-slate-400 ml-1">m</span>
              </div>
            </div>

            {/* Nautical Miles */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
              <span className="text-[11px] font-bold uppercase text-slate-400 block">Nautical Miles</span>
              <div className="text-xl sm:text-2xl font-black text-slate-800 dark:text-slate-200 mt-1">
                {formatNumber(nauticalMiles, 2)}
                <span className="text-xs font-semibold text-slate-400 ml-1">NM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

