export const toCurrency = (n: number) =>
  n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const toPercent = (n: number) =>
  `${(n * 100).toFixed(2)}%`;

export const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max); 