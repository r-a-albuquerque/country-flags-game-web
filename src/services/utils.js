import _ from 'lodash'

export function uniqueRandomArray(times, min = 0, max = 0) {
    const set = new Set()
    const total = max - min + 1
    if (times > total) {
        throw new Error('Requested number of unique values is larger than the available range.')
    }

    while (set.size < times) {
        const rand = _.random(min, max)
        set.add(rand)
    }

    return Array.from(set)
}

export function random(max = 4) {
    return _.random(0, max)
}

export function formatCountryName(country) {
    if (!country) return 'Unknown country'
    if (typeof country === 'string') return country
    if (typeof country.name === 'string') return country.name
    return country.name?.common || country.name?.official || country.name || 'Unknown country'
}

export function stableIdForCountry(country) {
    if (!country) return 'UNKNOWN'
    if (country.cca3) return String(country.cca3)
    if (country.ccn3) return String(country.ccn3)
    const base = typeof country === 'string' ? country : formatCountryName(country)
    return base.replace(/\s+/g, '_').replace(/[^\w\-]/g, '').toUpperCase()
}

export function pickRandomOptions(countries = [], count = 5) {
    if (!Array.isArray(countries) || countries.length === 0) return { options: [], selectedIndex: -1 }
    const size = Math.min(count, countries.length)
    const indices = uniqueRandomArray(size, 0, countries.length - 1)
    const options = indices.map(i => {
        const c = countries[i]
        return { ...c, id: stableIdForCountry(c) }
    })
    const selectedIndex = _.random(0, options.length - 1)
    return { options, selectedIndex }
}

export default {
    uniqueRandomArray,
    random,
    formatCountryName,
    stableIdForCountry,
    pickRandomOptions
}
