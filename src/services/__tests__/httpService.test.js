import axios from 'axios'
import http from '../httpService'

jest.mock('axios')

describe('httpService.getCountries normalization', () => {
    test('normalizes v2 (string name + flag) and v3 shapes', async () => {
        const data = [
            // v2-like
            { name: 'Country V2', flag: 'http://v2/flag.png', alpha2Code: 'V2', alpha3Code: 'V22', capital: 'CapV2', population: 100 },
            // v3-like
            { name: { common: 'Country V3', official: 'Country V3 Official' }, flags: { png: 'http://v3/flag.png', svg: 'http://v3/flag.svg' }, cca2: 'V3', cca3: 'V33', capital: ['CapV3'], population: 200 }
        ]

        axios.get.mockResolvedValue({ data })

        const result = await http.getCountries()
        expect(result).toBeDefined()
        expect(Array.isArray(result.data)).toBeTruthy()
        expect(result.data.length).toBe(2)

        const [a, b] = result.data

        // v2 normalized
        expect(typeof a.name).toBe('string')
        expect(a.flags && a.flags.png).toBe('http://v2/flag.png')
        expect(Array.isArray(a.capital)).toBeTruthy()
        expect(a.capital[0]).toBe('CapV2')
        expect(a.cca2).toBe('V2')
        expect(a.cca3).toBe('V22')
        expect(a.id).toBeDefined()

        // v3 normalized
        expect(typeof b.name).toBe('string')
        expect(b.flags && b.flags.svg).toBe('http://v3/flag.svg')
        expect(Array.isArray(b.capital)).toBeTruthy()
        expect(b.capital[0]).toBe('CapV3')
        expect(b.cca2).toBe('V3')
        expect(b.cca3).toBe('V33')
        expect(b.id).toBeDefined()
    })
})
