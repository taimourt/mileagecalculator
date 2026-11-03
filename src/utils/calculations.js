// Mileage and fuel calculation utilities

/**
 * Calculate Gas Mileage from odometer readings or distance
 */
export function calculateGasMileage({
  isOdometerMode = true,
  currentOdo = 0,
  previousOdo = 0,
  directDistance = 0,
  fuelAmount = 0,
  fuelPrice = 0,
  unitSystem = 'us', // 'us' (miles/gal), 'metric' (km/L), 'imperial' (miles/UK gal)
}) {
  const distance = isOdometerMode ? Math.max(0, currentOdo - previousOdo) : Math.max(0, directDistance);
  
  if (distance <= 0 || fuelAmount <= 0) {
    return null;
  }

  let distanceInMiles = 0;
  let distanceInKm = 0;
  let fuelInUSGallons = 0;
  let fuelInUKGallons = 0;
  let fuelInLiters = 0;

  if (unitSystem === 'us') {
    distanceInMiles = distance;
    distanceInKm = distance * 1.609344;
    fuelInUSGallons = fuelAmount;
    fuelInLiters = fuelAmount * 3.785411784;
    fuelInUKGallons = fuelInLiters / 4.54609;
  } else if (unitSystem === 'metric') {
    distanceInKm = distance;
    distanceInMiles = distance / 1.609344;
    fuelInLiters = fuelAmount;
    fuelInUSGallons = fuelAmount / 3.785411784;
    fuelInUKGallons = fuelInLiters / 4.54609;
  } else if (unitSystem === 'imperial') {
    distanceInMiles = distance;
    distanceInKm = distance * 1.609344;
    fuelInUKGallons = fuelAmount;
    fuelInLiters = fuelAmount * 4.54609;
    fuelInUSGallons = fuelInLiters / 3.785411784;
  }

  // Key metrics
  const mpgUS = distanceInMiles / fuelInUSGallons;
  const mpgUK = distanceInMiles / fuelInUKGallons;
  const kmPerLiter = distanceInKm / fuelInLiters;
  const lPer100km = (fuelInLiters / distanceInKm) * 100;

  // Costs
  const totalFuelCost = fuelPrice > 0 ? fuelAmount * fuelPrice : 0;
  const costPerMile = totalFuelCost > 0 ? totalFuelCost / distanceInMiles : (fuelPrice > 0 && mpgUS > 0 ? (unitSystem === 'us' ? fuelPrice / mpgUS : (fuelPrice * 3.785411784) / mpgUS) : 0);
  const costPerKm = totalFuelCost > 0 ? totalFuelCost / distanceInKm : (costPerMile / 1.609344);
  const milesPerDollar = totalFuelCost > 0 ? distanceInMiles / totalFuelCost : (costPerMile > 0 ? 1 / costPerMile : 0);
  const kmPerDollar = totalFuelCost > 0 ? distanceInKm / totalFuelCost : (costPerKm > 0 ? 1 / costPerKm : 0);

  // Rating badge
  let rating = { label: 'Average', color: 'text-amber-500 bg-amber-50 border-amber-200' };
  if (mpgUS >= 40) {
    rating = { label: 'Ultra High Efficiency (Hybrid / Eco)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300' };
  } else if (mpgUS >= 30) {
    rating = { label: 'Good Fuel Economy', color: 'text-green-700 bg-green-50 border-green-300' };
  } else if (mpgUS >= 22) {
    rating = { label: 'Average Fleet Economy', color: 'text-blue-700 bg-blue-50 border-blue-300' };
  } else if (mpgUS >= 16) {
    rating = { label: 'Below Average / High Consumption', color: 'text-amber-700 bg-amber-50 border-amber-300' };
  } else {
    rating = { label: 'Heavy Gas Guzzler', color: 'text-rose-700 bg-rose-50 border-rose-300' };
  }

  return {
    distanceTraveled: distance,
    distanceInMiles,
    distanceInKm,
    fuelAmount,
    fuelInUSGallons,
    fuelInLiters,
    fuelInUKGallons,
    mpgUS,
    mpgUK,
    kmPerLiter,
    lPer100km,
    totalFuelCost,
    costPerMile,
    costPerKm,
    milesPerDollar,
    kmPerDollar,
    rating,
  };
}

/**
 * Road trip fuel & travel expense calculator
 */
export function calculateTripCost({
  distanceMiles = 0,
  mpg = 28,
  fuelPrice = 3.5,
  isRoundTrip = false,
  passengers = 1,
  tolls = 0,
  parking = 0,
  lodging = 0,
  food = 0,
  other = 0,
}) {
  const effectiveDistance = isRoundTrip ? distanceMiles * 2 : distanceMiles;
  const gallonsNeeded = mpg > 0 ? effectiveDistance / mpg : 0;
  const fuelCost = gallonsNeeded * fuelPrice;
  const extraExpenses = tolls + parking + lodging + food + other;
  const totalCost = fuelCost + extraExpenses;
  const validPassengers = Math.max(1, passengers);
  const costPerPerson = totalCost / validPassengers;
  const costPerMile = effectiveDistance > 0 ? totalCost / effectiveDistance : 0;

  return {
    effectiveDistance,
    gallonsNeeded,
    fuelCost,
    extraExpenses,
    totalCost,
    passengers: validPassengers,
    costPerPerson,
    costPerMile,
    breakdown: [
      { name: 'Fuel', amount: fuelCost, color: '#16a34a' },
      { name: 'Tolls', amount: tolls, color: '#3b82f6' },
      { name: 'Parking', amount: parking, color: '#f59e0b' },
      { name: 'Lodging', amount: lodging, color: '#8b5cf6' },
      { name: 'Food & Extras', amount: food + other, color: '#ec4899' },
    ].filter(item => item.amount > 0),
  };
}

/**
 * IRS & Business Mileage Reimbursement Historical Archive (2019 - 2026)
 */
export const IRS_RATES = {
  2026: {
    year: '2026',
    business: 0.70, // 2026 projected standard IRS rate
    medical: 0.22,
    charity: 0.14,
    notes: 'Projected standard business mileage deduction rate',
  },
  2025: {
    year: '2025',
    business: 0.685, // 2025 rate
    medical: 0.21,
    charity: 0.14,
    notes: 'Official IRS standard mileage rate for 2025',
  },
  2024: {
    year: '2024',
    business: 0.67, // 2024 official rate (IRS Notice 2024-08)
    medical: 0.21,
    charity: 0.14,
    notes: 'Official IRS standard mileage rate for 2024',
  },
  2023: {
    year: '2023',
    business: 0.655, // 2023 official rate
    medical: 0.22,
    charity: 0.14,
    notes: 'Official 2023 rate (65.5 cents per business mile)',
  },
  '2022-h2': {
    year: '2022 (Jul 1 - Dec 31)',
    business: 0.625, // Mid-year gas price adjustment (62.5 cents)
    medical: 0.22,
    charity: 0.14,
    notes: 'Special mid-year inflation increase: 62.5 cents / mile',
  },
  '2022-h1': {
    year: '2022 (Jan 1 - Jun 30)',
    business: 0.585, // Early 2022 rate (58.5 cents)
    medical: 0.18,
    charity: 0.14,
    notes: 'First half of 2022 baseline: 58.5 cents / mile',
  },
  2021: {
    year: '2021',
    business: 0.56, // 2021 rate
    medical: 0.16,
    charity: 0.14,
    notes: 'Official 2021 standard rate (56.0 cents / mile)',
  },
  2020: {
    year: '2020',
    business: 0.575, // 2020 rate
    medical: 0.17,
    charity: 0.14,
    notes: 'Official 2020 standard rate (57.5 cents / mile)',
  },
  2019: {
    year: '2019',
    business: 0.58, // 2019 rate
    medical: 0.20,
    charity: 0.14,
    notes: 'Official 2019 standard rate (58.0 cents / mile)',
  },
};

export function calculateReimbursement({
  miles = 0,
  rate = 0.67,
  taxBracketPct = 24, // e.g., 24% federal tax bracket
}) {
  const totalReimbursement = miles * rate;
  const taxSavingsEstimate = (totalReimbursement * taxBracketPct) / 100;

  return {
    miles,
    rate,
    totalReimbursement,
    taxSavingsEstimate,
  };
}

/**
 * EV vs Gas vehicle comparison
 */
export function calculateEvVsGas({
  annualMiles = 12000,
  gasMpg = 28,
  gasPricePerGallon = 3.60,
  evKwhPer100Miles = 30, // average Tesla Model 3 / Hyundai Ioniq
  electricityPricePerKwh = 0.16, // average US residential $/kWh
  years = 5,
}) {
  // Gas vehicle
  const annualGasGallons = annualMiles / gasMpg;
  const annualGasCost = annualGasGallons * gasPricePerGallon;
  const gasCostPerMile = annualGasCost / annualMiles;
  // Gas CO2 ~ 19.6 lbs CO2 per gallon of gasoline
  const annualGasCo2Lbs = annualGasGallons * 19.6;

  // Electric vehicle
  const annualKwh = (annualMiles / 100) * evKwhPer100Miles;
  const annualEvCost = annualKwh * electricityPricePerKwh;
  const evCostPerMile = annualEvCost / annualMiles;
  // US grid average ~ 0.85 lbs CO2 per kWh
  const annualEvCo2Lbs = annualKwh * 0.85;

  // Comparison
  const annualSavings = annualGasCost - annualEvCost;
  const multiYearSavings = annualSavings * years;
  const annualCo2SavedLbs = Math.max(0, annualGasCo2Lbs - annualEvCo2Lbs);
  const annualCo2SavedKg = annualCo2SavedLbs * 0.453592;

  return {
    gas: {
      annualCost: annualGasCost,
      costPerMile: gasCostPerMile,
      costPer100Miles: gasCostPerMile * 100,
      annualGallons: annualGasGallons,
      annualCo2Lbs: annualGasCo2Lbs,
    },
    ev: {
      annualCost: annualEvCost,
      costPerMile: evCostPerMile,
      costPer100Miles: evCostPerMile * 100,
      annualKwh: annualKwh,
      annualCo2Lbs: annualEvCo2Lbs,
    },
    annualSavings,
    multiYearSavings,
    years,
    annualCo2SavedLbs,
    annualCo2SavedKg,
  };
}

