/**
 * Automated Verification & Precision Test Suite
 * Tests all mathematical models, unit conversions, edge cases, and rounding precision.
 */

import { 
  calculateGasMileage, 
  calculateTripCost, 
  calculateReimbursement, 
  calculateEvVsGas,
  IRS_RATES 
} from '../src/utils/calculations.js';

import { haversineDistance } from '../src/utils/geocoding.js';

let passed = 0;
let failed = 0;

function assert(condition, testName, details = '') {
  if (condition) {
    passed++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${testName} ${details ? `(${details})` : ''}`);
  }
}

console.log('\n======================================================');
console.log('🧪 MILEAGE CALCULATOR PRO — AUTOMATED AUDIT & TEST SUITE');
console.log('======================================================\n');

// -----------------------------------------------------------------------------
// 1. GAS MILEAGE & FUEL ECONOMY CALCULATIONS
// -----------------------------------------------------------------------------
console.log('--- 1. Gas Mileage & Fuel Economy (MPG & L/100km) ---');

// Normal Calculation (360 miles, 15 gallons, $3.50/gal)
{
  const res = calculateGasMileage({
    isOdometerMode: false,
    directDistance: 360,
    fuelAmount: 15,
    fuelPrice: 3.50,
    unitSystem: 'us',
  });
  assert(res !== null, 'Normal calculation returns valid result object');
  assert(Math.abs(res.mpgUS - 24.0) < 0.001, '360 mi / 15 gal = 24.0 US MPG', `Got: ${res?.mpgUS}`);
  assert(Math.abs(res.lPer100km - (235.214583 / 24.0)) < 0.01, 'L/100km conversion: ~9.80 L/100km', `Got: ${res?.lPer100km}`);
  assert(Math.abs(res.totalFuelCost - 52.50) < 0.001, '15 gal * $3.50 = $52.50 total fuel cost', `Got: ${res?.totalFuelCost}`);
  assert(Math.abs(res.costPerMile - (52.50 / 360)) < 0.001, 'Cost per mile = ~$0.1458/mi', `Got: ${res?.costPerMile}`);
}

// Odometer Mode (12,360 current - 12,000 previous = 360 miles)
{
  const res = calculateGasMileage({
    isOdometerMode: true,
    currentOdo: 12360,
    previousOdo: 12000,
    fuelAmount: 15,
    fuelPrice: 3.50,
    unitSystem: 'us',
  });
  assert(res !== null && res.distanceTraveled === 360, 'Odometer mode correctly computes 360 miles');
  assert(Math.abs(res.mpgUS - 24.0) < 0.001, 'Odometer mode produces 24.0 US MPG');
}

// Metric Mode (600 km, 50 Liters, $1.65/L)
{
  const res = calculateGasMileage({
    isOdometerMode: false,
    directDistance: 600,
    fuelAmount: 50,
    fuelPrice: 1.65,
    unitSystem: 'metric',
  });
  assert(res !== null, 'Metric mode calculation returns valid object');
  assert(Math.abs(res.kmPerLiter - 12.0) < 0.001, '600 km / 50 L = 12.0 km/L', `Got: ${res?.kmPerLiter}`);
  assert(Math.abs(res.lPer100km - 8.333) < 0.01, '50 L / 600 km * 100 = 8.33 L/100km', `Got: ${res?.lPer100km}`);
  assert(Math.abs(res.totalFuelCost - 82.50) < 0.001, '50 L * $1.65 = $82.50 total cost', `Got: ${res?.totalFuelCost}`);
}

// Zero Values & Empty Inputs
{
  const resZeroDistance = calculateGasMileage({ directDistance: 0, fuelAmount: 15 });
  assert(resZeroDistance === null, 'Zero distance returns null safely without division by zero');

  const resZeroFuel = calculateGasMileage({ directDistance: 360, fuelAmount: 0 });
  assert(resZeroFuel === null, 'Zero fuel returns null safely without division by zero');
}

// Negative Values & Inverted Odometers
{
  const resInvertedOdo = calculateGasMileage({
    isOdometerMode: true,
    currentOdo: 10000,
    previousOdo: 12000, // previous > current
    fuelAmount: 10,
  });
  assert(resInvertedOdo === null, 'Inverted odometer (previous > current) handled safely without crash');
}

// Large Decimal & High Precision Values
{
  const resDec = calculateGasMileage({
    isOdometerMode: false,
    directDistance: 457.82,
    fuelAmount: 14.33,
    fuelPrice: 3.459,
    unitSystem: 'us',
  });
  const expectedMpg = 457.82 / 14.33;
  assert(Math.abs(resDec.mpgUS - expectedMpg) < 0.0001, 'High-precision decimal float calculations');
}

// -----------------------------------------------------------------------------
// 2. ROAD TRIP & FUEL COST SPLITTER
// -----------------------------------------------------------------------------
console.log('\n--- 2. Road Trip & Fuel Expense Splitter ---');

// Normal trip (300 miles, 25 MPG, $3.50/gal, 3 passengers, $30 extra)
{
  const res = calculateTripCost({
    distanceMiles: 300,
    mpg: 25,
    fuelPrice: 3.50,
    isRoundTrip: false,
    passengers: 3,
    tolls: 15,
    parking: 15,
  });
  // 300 / 25 = 12 gallons. 12 * $3.50 = $42.00 fuel. Extra = $30. Total = $72.00. Per person = $24.00.
  assert(Math.abs(res.gallonsNeeded - 12.0) < 0.001, '300 mi / 25 MPG = 12.0 gallons', `Got: ${res.gallonsNeeded}`);
  assert(Math.abs(res.fuelCost - 42.00) < 0.001, '12 gal * $3.50 = $42.00 fuel cost', `Got: ${res.fuelCost}`);
  assert(Math.abs(res.totalCost - 72.00) < 0.001, 'Fuel ($42) + Extra ($30) = $72.00 total', `Got: ${res.totalCost}`);
  assert(Math.abs(res.costPerPerson - 24.00) < 0.001, '$72.00 / 3 passengers = $24.00 per person', `Got: ${res.costPerPerson}`);
}

// Round-Trip Toggle
{
  const resRT = calculateTripCost({
    distanceMiles: 300,
    mpg: 25,
    fuelPrice: 3.50,
    isRoundTrip: true, // 600 miles
    passengers: 1,
  });
  assert(resRT.effectiveDistance === 600, 'Round-trip doubles distance to 600 miles');
  assert(Math.abs(resRT.gallonsNeeded - 24.0) < 0.001, '600 mi / 25 MPG = 24.0 gallons');
}

// Zero Passengers edge case
{
  const resZeroPass = calculateTripCost({ distanceMiles: 100, passengers: 0 });
  assert(resZeroPass.passengers === 1, 'Zero passengers automatically clamps to 1 to avoid NaN');
  assert(!isNaN(resZeroPass.costPerPerson), 'Cost per person is finite and valid');
}

// -----------------------------------------------------------------------------
// 3. IRS BUSINESS MILEAGE REIMBURSEMENT
// -----------------------------------------------------------------------------
console.log('\n--- 3. IRS Business Mileage Deduction ---');

// Official Rates Verification
{
  assert(IRS_RATES[2024].business === 0.67, '2024 IRS standard business rate is $0.67/mi');
  assert(IRS_RATES[2025].business === 0.685, '2025 IRS standard business rate is $0.685/mi');
  assert(IRS_RATES['2022-h2'].business === 0.625, '2022 H2 special mid-year rate is $0.625/mi');
  assert(IRS_RATES['2022-h1'].business === 0.585, '2022 H1 standard rate is $0.585/mi');
}

// 1000 Business Miles at 2024 rate ($0.67) in 24% tax bracket
{
  const res = calculateReimbursement({
    miles: 1000,
    rate: 0.67,
    taxBracketPct: 24,
  });
  assert(Math.abs(res.totalReimbursement - 670.00) < 0.001, '1,000 miles * $0.67 = $670.00 deduction', `Got: ${res.totalReimbursement}`);
  assert(Math.abs(res.taxSavingsEstimate - (670.00 * 0.24)) < 0.001, 'Tax savings = $160.80', `Got: ${res.taxSavingsEstimate}`);
}

// -----------------------------------------------------------------------------
// 4. ELECTRIC VEHICLE (EV) VS GAS SAVINGS
// -----------------------------------------------------------------------------
console.log('\n--- 4. Electric Vehicle (EV) vs Gas Comparison ---');

// 12,000 miles/yr, Gas: 28 MPG @ $3.60, EV: 30 kWh/100m @ $0.16/kWh, 5 years
{
  const res = calculateEvVsGas({
    annualMiles: 12000,
    gasMpg: 28,
    gasPricePerGallon: 3.60,
    evKwhPer100Miles: 30,
    electricityPricePerKwh: 0.16,
    years: 5,
  });
  // Gas gallons: 12000 / 28 = 428.57 gal. Cost: 428.57 * 3.60 = $1,542.86.
  // EV kWh: (12000 / 100) * 30 = 3600 kWh. Cost: 3600 * 0.16 = $576.00.
  // Annual Savings: $1,542.86 - $576.00 = $966.86.
  // 5-Year Savings: $4,834.29.
  assert(Math.abs(res.gas.annualCost - 1542.86) < 0.5, 'Annual gas expenditure ~$1,542.86', `Got: ${res.gas.annualCost}`);
  assert(Math.abs(res.ev.annualCost - 576.00) < 0.01, 'Annual EV charging expenditure $576.00', `Got: ${res.ev.annualCost}`);
  assert(Math.abs(res.annualSavings - 966.86) < 0.5, 'Annual net savings ~$966.86', `Got: ${res.annualSavings}`);
  assert(Math.abs(res.multiYearSavings - (res.annualSavings * 5)) < 0.01, '5-year savings multiple matches annual * 5');
  assert(res.annualCo2SavedLbs > 0, 'Net carbon emissions saved is positive');
}

// -----------------------------------------------------------------------------
// 5. GEODESIC HAVERSINE DISTANCE FORMULATION
// -----------------------------------------------------------------------------
console.log('\n--- 5. Geodesic Haversine Great-Circle Distance ---');

// JFK (40.6413, -73.7781) to LHR (51.4700, -0.4543)
// Real-world Great Circle distance is approximately 3,451 statute miles
{
  const dist = haversineDistance(40.6413, -73.7781, 51.4700, -0.4543);
  assert(Math.abs(dist - 3451.0) < 15.0, 'JFK to LHR Haversine distance ~3,451 miles', `Got: ${dist.toFixed(1)} miles`);
}

// Zero distance (same coordinate)
{
  const distZero = haversineDistance(40.7128, -74.0060, 40.7128, -74.0060);
  assert(distZero === 0, 'Identical coordinates yield 0.0 miles');
}

// -----------------------------------------------------------------------------
// 6. CAR LEASE & PCP EXCESS MILEAGE FORECASTING
// -----------------------------------------------------------------------------
console.log('\n--- 6. Car Lease & PCP Excess Mileage Model ---');

{
  const leaseMonths = 36;
  const annualAllowance = 10000; // total 30,000 miles allowed
  const monthsElapsed = 18; // halfway: allowed to date = 15,000 miles
  const currentOdometer = 18500; // 3,500 miles ahead of pace
  const overageRate = 0.20; // $0.20 / excess mile

  const totalAllowed = (leaseMonths / 12) * annualAllowance;
  const allowedToDate = (monthsElapsed / 12) * annualAllowance;
  const monthlyPace = currentOdometer / monthsElapsed; // ~1027.78 mi/mo
  const projectedFinal = monthlyPace * leaseMonths; // 37,000 miles
  const projectedExcess = Math.max(0, projectedFinal - totalAllowed); // 7,000 miles
  const projectedPenalty = projectedExcess * overageRate; // $1,400.00

  assert(totalAllowed === 30000, '36-month lease @ 10k/yr = 30,000 miles allowed');
  assert(allowedToDate === 15000, '18-month pace benchmark = 15,000 miles');
  assert(Math.abs(projectedFinal - 37000) < 0.01, 'Projected return odometer = 37,000 miles');
  assert(Math.abs(projectedExcess - 7000) < 0.01, 'Projected excess = 7,000 miles over contract');
  assert(Math.abs(projectedPenalty - 1400.00) < 0.01, 'Projected overage fine = $1,400.00');

  // Under-allowance case (no negative penalty)
  const underOdo = 12000; // under pace
  const underPace = underOdo / monthsElapsed;
  const underFinal = underPace * leaseMonths; // 24,000 mi
  const underPenalty = Math.max(0, underFinal - totalAllowed) * overageRate;
  assert(underPenalty === 0, 'Under-allowance driving produces exactly $0.00 penalty');
}

// -----------------------------------------------------------------------------
// 7. IFTA COMMERCIAL TRUCKING JURISDICTION TAXES
// -----------------------------------------------------------------------------
console.log('\n--- 7. IFTA Commercial Motor Carrier Tax Accounting ---');

{
  const fleetMpg = 6.5; // Class 8 diesel tractor
  const states = [
    { state: 'TX', miles: 520, bought: 90, rate: 0.20 },
    { state: 'IL', miles: 410, bought: 60, rate: 0.454 },
  ];

  // TX: Consumed = 520 / 6.5 = 80 gal. Bought = 90. Net = -10 (credit). Tax = -10 * 0.20 = -$2.00
  // IL: Consumed = 410 / 6.5 = 63.0769 gal. Bought = 60. Net = +3.0769. Tax = 3.0769 * 0.454 = +$1.3969
  const txConsumed = 520 / fleetMpg;
  const txNet = txConsumed - 90;
  const txTax = txNet * 0.20;

  const ilConsumed = 410 / fleetMpg;
  const ilNet = ilConsumed - 60;
  const ilTax = ilNet * 0.454;

  const totalDue = txTax + ilTax;

  assert(Math.abs(txConsumed - 80.0) < 0.001, 'TX diesel burned = 80.0 gallons');
  assert(Math.abs(txTax - (-2.00)) < 0.001, 'TX fuel credit = -$2.00');
  assert(totalDue < 0, 'Net credit due to surplus tax-paid fuel in Texas');
}

// -----------------------------------------------------------------------------
// 8. AERONAUTICAL AIR MILES & CABIN MULTIPLIERS
// -----------------------------------------------------------------------------
console.log('\n--- 8. Aeronautical Air Miles & Loyalty Accrual ---');

{
  const airMiles = 3451.0;
  const nm = airMiles * 0.868976;
  const km = airMiles * 1.609344;
  const flightHours = (airMiles / 510) + 0.5;

  assert(Math.abs(nm - 2998.83) < 1.0, '3,451 statute miles = ~2,999 nautical miles');
  assert(Math.abs(km - 5553.84) < 1.0, '3,451 statute miles = ~5,554 km');
  assert(flightHours > 7.0 && flightHours < 7.5, 'JFK to LHR flight duration ~7.25 hours');

  // Loyalty Multipliers
  assert(Math.round(airMiles * 1.0) === 3451, 'Economy class = 100% base frequent flyer miles');
  assert(Math.round(airMiles * 1.5) === 5177, 'Business class = 150% bonus miles (5,177 miles)');
  assert(Math.round(airMiles * 2.0) === 6902, 'First class = 200% bonus miles (6,902 miles)');
}

// -----------------------------------------------------------------------------
// 9. UNIT & RATIO CONVERSIONS (2-STROKE & FUEL RATIOS)
// -----------------------------------------------------------------------------
console.log('\n--- 9. Fuel Ratio & Unit Conversions ---');

{
  // 50:1 Two-Stroke Fuel Mix: 1 gallon = 128 fl oz. Oil = 128 / 50 = 2.56 fl oz per gallon
  const gasGallons = 2;
  const ratio = 50;
  const oilOz = (gasGallons * 128) / ratio; // 5.12 fl oz
  const oilMl = oilOz * 29.5735; // ~151.4 mL

  assert(Math.abs(oilOz - 5.12) < 0.001, '2 gallons @ 50:1 requires 5.12 fl oz two-cycle oil');
  assert(Math.abs(oilMl - 151.42) < 0.1, '5.12 fl oz converts to ~151.4 mL oil');

  // MPG to L/100km constant check: 235.214583 / 30 MPG = 7.840 L/100km
  const l100 = 235.214583 / 30;
  assert(Math.abs(l100 - 7.84) < 0.01, '30 US MPG = 7.84 L/100km');

  // UK Imperial MPG to US MPG: 1 UK Gallon = 1.20095 US Gallons
  const ukMpg = 30 * 1.20095;
  assert(Math.abs(ukMpg - 36.0285) < 0.01, '30 US MPG = 36.03 UK Imperial MPG');
}

// -----------------------------------------------------------------------------
// 10. STRESS & ROBUSTNESS: VERY LARGE NUMBERS, EMPTY & BOUNDARY TESTS
// -----------------------------------------------------------------------------
console.log('\n--- 10. Robustness & Boundary Edge Cases ---');

{
  // Very large distance (10,000,000 miles)
  const resLarge = calculateGasMileage({
    isOdometerMode: false,
    directDistance: 10000000,
    fuelAmount: 400000,
    fuelPrice: 3.50,
  });
  assert(resLarge !== null && resLarge.mpgUS === 25, 'Handles 10,000,000 miles without overflow');

  // Small fractional decimal (0.05 gallons)
  const resSmall = calculateGasMileage({
    isOdometerMode: false,
    directDistance: 1.5,
    fuelAmount: 0.05,
  });
  assert(Math.abs(resSmall.mpgUS - 30.0) < 0.001, 'Handles small decimal volume (1.5 mi / 0.05 gal = 30 MPG)');
}

// -----------------------------------------------------------------------------
// SUMMARY REPORT
// -----------------------------------------------------------------------------
console.log('\n======================================================');
console.log(`📊 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
console.log('======================================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
