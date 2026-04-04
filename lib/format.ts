export function currency(amount: number, code = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: code
  }).format(amount);
}
