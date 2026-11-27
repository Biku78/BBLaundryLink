import { describe, expect, it } from 'vitest'
import { sortPartners } from './sortPartners'
const shops = [{ name: 'A', price: 50, rating: 4.6 }, { name: 'B', price: 60, rating: 4.5 }, { name: 'C', price: 45, rating: 4.7 }]
describe('partner sorting', () => {
  it('keeps recommended order', () => expect(sortPartners(shops).map(p => p.name)).toEqual(['A', 'B', 'C']))
  it('sorts price from low to high', () => expect(sortPartners(shops, 'price').map(p => p.name)).toEqual(['C', 'A', 'B']))
  it('sorts highest ratings first', () => expect(sortPartners(shops, 'rating').map(p => p.name)).toEqual(['C', 'A', 'B']))
  it('sorts numeric distances rather than distance strings', () => {
    const partners = [{ distance: '10.2' }, { distance: '2.1' }, { distance: '1.2' }]
    expect(sortPartners(partners, 'nearest').map(p => p.distance)).toEqual(['1.2', '2.1', '10.2'])
  })
  it('does not mutate the original list', () => {
    const original = structuredClone(shops)
    sortPartners(shops, 'price')
    expect(shops).toEqual(original)
  })
  it('handles no matches', () => expect(sortPartners([], 'rating')).toEqual([]))
})
