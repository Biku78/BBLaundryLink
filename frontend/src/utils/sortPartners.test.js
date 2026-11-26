import { describe, expect, it } from 'vitest'
import { sortPartners } from './sortPartners'
const shops = [{ name: 'A', price: 50, rating: 4.6 }, { name: 'B', price: 60, rating: 4.5 }, { name: 'C', price: 45, rating: 4.7 }]
describe('partner sorting', () => {
  it('keeps recommended order', () => expect(sortPartners(shops).map(p => p.name)).toEqual(['A', 'B', 'C']))
  it('sorts price from low to high', () => expect(sortPartners(shops, 'price').map(p => p.name)).toEqual(['C', 'A', 'B']))
  it('sorts highest ratings first', () => expect(sortPartners(shops, 'rating').map(p => p.name)).toEqual(['C', 'A', 'B']))
  it('does not mutate the original list', () => {
    const original = structuredClone(shops)
    sortPartners(shops, 'price')
    expect(shops).toEqual(original)
  })
  it('handles no matches', () => expect(sortPartners([], 'rating')).toEqual([]))
})
