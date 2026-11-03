import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

export default function LeafletMap({ points = [], routeCoordinates = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Check if map is already initialized
    if (!mapInstanceRef.current) {
      // Fix Leaflet's default icon URLs when bundled with Vite
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const map = L.map(mapContainerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([39.8283, -98.5795], 4); // Center of US default

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      layerGroupRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    const validPoints = points.filter(p => p && !isNaN(p.lat) && !isNaN(p.lng));

    if (validPoints.length === 0) return;

    // Custom icons for Start, End, and Waypoints
    const startIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color: #16a34a; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">A</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const endIcon = L.divIcon({
      className: 'custom-map-pin',
      html: `<div style="background-color: #dc2626; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: 2px solid white;">B</div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    const waypointIcon = (idx) =>
      L.divIcon({
        className: 'custom-map-pin',
        html: `<div style="background-color: #2563eb; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: 0 3px 5px rgba(0,0,0,0.3); border: 2px solid white;">${idx}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

    // Add Markers
    validPoints.forEach((p, idx) => {
      let icon = waypointIcon(idx);
      if (idx === 0) icon = startIcon;
      else if (idx === validPoints.length - 1) icon = endIcon;

      const marker = L.marker([p.lat, p.lng], { icon }).bindPopup(
        `<b>${idx === 0 ? 'Origin: ' : idx === validPoints.length - 1 ? 'Destination: ' : 'Stop: '}</b>${p.name || ''}`
      );
      layerGroup.addLayer(marker);
    });

    // Add Route Polyline
    if (routeCoordinates && routeCoordinates.length > 1) {
      const polyline = L.polyline(routeCoordinates, {
        color: '#2563eb',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: null,
      });
      layerGroup.addLayer(polyline);

      // Fit bounds to show entire route with padding
      map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
    } else if (validPoints.length > 0) {
      const bounds = L.latLngBounds(validPoints.map(p => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

    // Leaflet needs resize trigger after rendering
    setTimeout(() => {
      if (map) map.invalidateSize();
    }, 200);
  }, [points, routeCoordinates]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-inner bg-slate-100 dark:bg-slate-800">
      <div ref={mapContainerRef} className="w-full h-full min-h-[380px] z-10" />
      <div className="absolute bottom-3 left-3 z-[400] bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2 shadow-sm">
        <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
        OSRM Real-time Driving Route Engine
      </div>
    </div>
  );
}

