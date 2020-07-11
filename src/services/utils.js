import _ from 'lodash'

// generate a sized array of random unique numbers
export function uniqueRandomArray(times, ...args) {
    const set = new Set()

    // how many numbers? better: whats the array size?
    while (times > 0) {
        // a random number (between the limit specified on args)
        const rand = _.random(...args)

        // number already generated?
        if (!set.has(rand)) {

            // insert number on final array
            set.add(rand)
            times--
        }
    }

    return Array.from(set)
}