// Conversion rate: 1 USD = 83 INR
const USD_TO_INR = 83

export function formatPrice(usdPrice) {
  return `₹${(usdPrice * USD_TO_INR).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`
}