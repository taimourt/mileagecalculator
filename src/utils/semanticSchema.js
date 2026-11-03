/**
 * Semantic SEO & Entity Knowledge Graph Generator
 * Adheres to Schema.org standards & Google Search Central Guidelines for Topical Authority
 */

export const WIKIDATA_ENTITIES = {
  fuelEconomy: 'https://www.wikidata.org/wiki/Q1785507',
  fuelEfficiency: 'https://www.wikidata.org/wiki/Q1474278',
  mile: 'https://www.wikidata.org/wiki/Q12554',
  kilometer: 'https://www.wikidata.org/wiki/Q828224',
  irs: 'https://www.wikidata.org/wiki/Q712521',
  greatCircleDistance: 'https://www.wikidata.org/wiki/Q1344445',
  geodesic: 'https://www.wikidata.org/wiki/Q213440',
  vehicleLeasing: 'https://www.wikidata.org/wiki/Q2982823',
  nauticalMile: 'https://www.wikidata.org/wiki/Q9332',
  ifta: 'https://www.wikidata.org/wiki/Q6050519',
  electricVehicle: 'https://www.wikidata.org/wiki/Q50912',
  odometer: 'https://www.wikidata.org/wiki/Q176218',
  taxDeduction: 'https://www.wikidata.org/wiki/Q3249089',
};

/**
 * Generate full Schema.org JSON-LD graph for any given tool & language
 */
export function generateSemanticJsonLd(lang = 'en', page = 'route') {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mileagecalculator.pro';
  const canonicalUrl = `${origin}/#/${lang}/${page}`;

  const organization = {
    '@type': 'Organization',
    '@id': `${origin}/#organization`,
    name: 'Mileage Calculator Pro Standards & Analytics Authority',
    url: origin,
    logo: {
      '@type': 'ImageObject',
      url: `${origin}/favicon.svg`,
      width: 512,
      height: 512,
    },
    knowsAbout: Object.values(WIKIDATA_ENTITIES),
  };

  const website = {
    '@type': 'WebSite',
    '@id': `${origin}/#website`,
    url: origin,
    name: 'Mileage Calculator Pro',
    description: 'Topical Authority Knowledge Graph and Calculation Suite for Geospatial Distance, Fuel Economy, IRS Taxation, and IFTA Compliance.',
    publisher: {
      '@id': `${origin}/#organization`,
    },
    inLanguage: lang,
  };

  const webApplication = {
    '@type': 'WebApplication',
    '@id': `${canonicalUrl}#application`,
    url: canonicalUrl,
    name: `Mileage Calculator Pro — ${page.toUpperCase()}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    featureList: [
      'OSRM GPS Road Routing Polyline Engine',
      'Straight-line Geodesic Great-Circle Haversine Distance',
      'Real-world Fuel Economy Calculations (US MPG, UK MPG, L/100km, km/L)',
      'IRS Business Mileage Substantiation Archive (2019-2026)',
      'IFTA Multi-Jurisdiction Commercial Truck Fuel Tax Accounting',
      'PCP & Contract Hire Excess Mileage Depreciation Forecasting',
      'Orthodromic Aeronautical Air & Nautical Miles Engine',
    ],
    about: [
      { '@type': 'Thing', name: 'Fuel Economy in Automobiles', sameAs: WIKIDATA_ENTITIES.fuelEconomy },
      { '@type': 'Thing', name: 'Standard Mileage Rate', sameAs: WIKIDATA_ENTITIES.irs },
      { '@type': 'Thing', name: 'Great-Circle Distance', sameAs: WIKIDATA_ENTITIES.greatCircleDistance },
      { '@type': 'Thing', name: 'International Fuel Tax Agreement', sameAs: WIKIDATA_ENTITIES.ifta },
      { '@type': 'Thing', name: 'Vehicle Leasing Overage', sameAs: WIKIDATA_ENTITIES.vehicleLeasing },
    ],
  };

  const breadcrumbs = {
    '@type': 'BreadcrumbList',
    '@id': `${canonicalUrl}#breadcrumbs`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${origin}/#/${lang}/route`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Mileage & Distance Suite',
        item: `${origin}/#/${lang}/sitemap`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: page.toUpperCase(),
        item: canonicalUrl,
      },
    ],
  };

  // How-To schema tailored for topical authority
  const howToCalculateMpg = {
    '@type': 'HowTo',
    '@id': `${origin}/#howto-mpg`,
    name: 'How to Accurately Calculate Real-World Gas Mileage (MPG and L/100km)',
    description: 'Step-by-step mathematical guide to calculating vehicle gas mileage and fuel economy using the full-tank odometer method.',
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Fill the Fuel Tank',
        text: 'Pump fuel into the vehicle until the gas nozzle automatically clicks off. Record the initial odometer reading or reset the trip meter to 0.0.',
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Drive Normally',
        text: 'Operate the vehicle across your typical driving cycle (city, highway, or mixed) until at least half the fuel tank is expended.',
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Refill and Record Odometer and Gallons',
        text: 'Return to the fuel pump and fill the tank to capacity again. Note the exact gallons (or liters) pumped and the ending odometer reading.',
      },
      {
        '@type': 'HowToStep',
        position: 4,
        name: 'Calculate Fuel Economy',
        text: 'Subtract previous odometer from current odometer to find miles traveled. Divide total miles by gallons added: MPG = Miles ÷ Gallons. For metric: L/100km = (Liters ÷ Kilometers) × 100.',
      },
    ],
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      webApplication,
      breadcrumbs,
      howToCalculateMpg,
    ],
  };
}

/**
 * Injects or updates the active JSON-LD graph in document <head>
 */
export function injectSemanticJsonLd(lang, page) {
  if (typeof document === 'undefined') return;

  let scriptEl = document.getElementById('semantic-seo-jsonld');
  if (!scriptEl) {
    scriptEl = document.createElement('script');
    scriptEl.id = 'semantic-seo-jsonld';
    scriptEl.type = 'application/ld+json';
    document.head.appendChild(scriptEl);
  }

  const schema = generateSemanticJsonLd(lang, page);
  scriptEl.textContent = JSON.stringify(schema, null, 2);
}

