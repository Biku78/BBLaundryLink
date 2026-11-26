export function sortPartners(partners, order = 'recommended') {
  const result = [...partners]
  if (order === 'price') result.sort((a, b) => a.price - b.price)
  if (order === 'rating') result.sort((a, b) => b.rating - a.rating)
  return result
}
