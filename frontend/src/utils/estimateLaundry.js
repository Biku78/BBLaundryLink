export const pricingServices = [
  { name: "Wash & Fold", unit: "kg", icon: "wash" },
  { name: "Ironing", unit: "piece", icon: "iron" },
  { name: "Dry Cleaning", unit: "kg", icon: "hanger" },
  { name: "Shoe Care", unit: "pair", icon: "shield" },
];

export function estimateLaundry(partners, service, quantity, express = false) {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 15) {
    throw new RangeError("Quantity must be a whole number from 1 to 15.");
  }
  const definition = pricingServices.find((item) => item.name === service);
  if (!definition) throw new RangeError("Unknown laundry service.");
  const eligible = partners.filter((partner) =>
    Number.isFinite(partner.rates?.[service]),
  );
  const partner = [...eligible].sort(
    (a, b) => a.rates[service] - b.rates[service],
  )[0];
  if (!partner) return null;
  const rate = partner.rates[service];
  const subtotal = rate * quantity;
  const expressFee = express ? Math.round(subtotal * 0.3) : 0;
  return {
    partner,
    rate,
    unit: definition.unit,
    quantity,
    subtotal,
    expressFee,
    total: subtotal + expressFee,
  };
}
