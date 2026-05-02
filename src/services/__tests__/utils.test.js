import { formatCountryName, stableIdForCountry, pickRandomOptions } from '../utils'

describe('utils helpers', () => {
    test('formatCountryName handles string and object names', () => {
        expect(formatCountryName(null)).toBe('Unknown country')
        expect(formatCountryName({ name: 'Brazil' })).toBe('Brazil')
        expect(formatCountryName({ name: { common: 'United States', official: 'United States of America' } })).toBe('United States')
    })

    test('stableIdForCountry prefers cca3 then falls back', () => {
        expect(stableIdForCountry(null)).toBe('UNKNOWN')
        const c1 = { cca3: 'BRA', name: 'Brazil' }
        expect(stableIdForCountry(c1)).toBe('BRA')
        const c2 = { ccn3: '076', name: 'Brazil' }
        expect(stableIdForCountry(c2)).toBe('076')
    })

    test('pickRandomOptions returns requested number (or less) and selectedIndex in range', () => {
        const countries = Array.from({ length: 10 }).map((_, i) => ({ name: `C${i}`, cca3: `C${i}` }))
        const { options, selectedIndex } = pickRandomOptions(countries, 5)
        expect(options.length).toBe(5)
        expect(selectedIndex).toBeGreaterThanOrEqual(0)
        expect(selectedIndex).toBeLessThan(options.length)
        const ids = options.map(o => o.id || o.cca3 || o.name)
        expect(new Set(ids).size).toBe(ids.length)
    })
})
