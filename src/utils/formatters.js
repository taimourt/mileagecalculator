export function formatCurrency(amount, currency = 'USD') {
  if (isNaN(amount) || amount === null || amount === undefined) return '$0.00';
  const symbols = {
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
  };
  const sym = symbols[currency] || '$';
  return `${sym}${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatNumber(val, decimals = 1) {
  if (isNaN(val) || val === null || val === undefined) return '0';
  return Number(val).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDuration(decimalHours) {
  if (!decimalHours || isNaN(decimalHours)) return '0 min';
  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
}

