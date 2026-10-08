// Prices are whole shillings: M-Pesa only takes whole amounts.
const grouping = new Intl.NumberFormat("en-KE", { maximumFractionDigits: 0 });

export function formatKES(amount: number): string {
  return `KES\u00A0${grouping.format(Math.round(amount))}`;
}

export function percentOff(price: number, compareAt: number | null | undefined): number {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round((1 - price / compareAt) * 100);
}
