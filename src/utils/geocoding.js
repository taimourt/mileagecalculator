import { CITY_COORDINATES } from '../data/cityPresets';

// Calculate Haversine direct distance between two points in miles
export function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Radius of Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Geocode a location query string
export async function geocodeLocation(query) {
  const trimmed = query.trim();
  if (!trimmed) return null;

  // Check cached coordinates first
  const exactMatch = Object.keys(CITY_COORDINATES).find(
    k => k.toLowerCase() === trimmed.toLowerCase() ||
         k.toLowerCase().startsWith(trimmed.toLowerCase())
  );
  if (exactMatch) {
    return {
      name: CITY_COORDINATES[exactMatch].name,
      lat: CITY_COORDINATES[exactMatch].lat,
      lng: CITY_COORDINATES[exactMatch].lng,
    };
  }

  // Try OpenStreetMap Nominatim
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}&limit=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'en' },
      }
    );
    clearTimeout(timeoutId);
    if (res.ok) {
      const data = await res.json();
      if (data && data.length > 0) {
        return {
          name: data[0].display_name.split(',').slice(0, 3).join(', '),
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }
    }
  } catch (err) {
    console.warn('Geocoding fallback activated:', err);
  }

  // Fallback: search partial match
  const partialMatch = Object.keys(CITY_COORDINATES).find(
    k => k.toLowerCase().includes(trimmed.toLowerCase())
  );
  if (partialMatch) {
    return {
      name: CITY_COORDINATES[partialMatch].name,
      lat: CITY_COORDINATES[partialMatch].lat,
      lng: CITY_COORDINATES[partialMatch].lng,
    };
  }

  return null;
}

// Get driving route between points using OSRM or fallback
export async function getDrivingRoute(points) {
  if (points.length < 2) return null;

  const validPoints = points.filter(p => p && !isNaN(p.lat) && !isNaN(p.lng));
  if (validPoints.length < 2) return null;

  const coordinatesString = validPoints.map(p => `${p.lng},${p.lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coordinatesString}?overview=full&geometries=geojson`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const distanceMeters = route.distance;
        const durationSeconds = route.duration;
        const distanceMiles = distanceMeters * 0.000621371;
        const distanceKm = distanceMeters / 1000;
        const durationHours = durationSeconds / 3600;

        // Leaflet expects [lat, lng], GeoJSON is [lng, lat]
        const polylineCoordinates = route.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        return {
          distanceMiles,
          distanceKm,
          durationHours,
          polylineCoordinates,
          source: 'osrm-routing',
        };
      }
    }
  } catch (err) {
    console.warn('OSRM routing fallback to Haversine circuity calculation:', err);
  }

  // Fallback: Haversine distance with 1.25 road winding factor & 60mph average
  let totalDirectMiles = 0;
  const polylineCoordinates = [];

  for (let i = 0; i < validPoints.length - 1; i++) {
    const p1 = validPoints[i];
    const p2 = validPoints[i + 1];
    polylineCoordinates.push([p1.lat, p1.lng]);
    totalDirectMiles += haversineDistance(p1.lat, p1.lng, p2.lat, p2.lng);
  }
  polylineCoordinates.push([
    validPoints[validPoints.length - 1].lat,
    validPoints[validPoints.length - 1].lng,
  ]);

  const roadCircuityFactor = 1.22;
  const estimatedMiles = totalDirectMiles * roadCircuityFactor;
  const estimatedKm = estimatedMiles * 1.609344;
  const estimatedHours = estimatedMiles / 55; // 55 mph highway/mixed average

  return {
    distanceMiles: estimatedMiles,
    distanceKm: estimatedKm,
    durationHours: estimatedHours,
    polylineCoordinates,
    source: 'haversine-estimate',
  };
}

