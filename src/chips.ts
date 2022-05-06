import {
    OneBitSignal,
    TwoBitSignal,
    concatenate,
    slice,
    SixteenBitSignal,
    SIGNALS,
    makeSignal,
} from './signals'
import {
    and,
    xor,
    or,
} from './gates'

export const halfAdder = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
): TwoBitSignal => {
    const carry = and(signal, otherSignal)
    const sum = xor(signal, otherSignal)
    return concatenate(carry, sum) as TwoBitSignal
}

export const fullAdder = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
    inCarry: OneBitSignal
): TwoBitSignal => {
    const first = halfAdder(signal, otherSignal)
    const firstCarry = slice(first, 0, 1) as OneBitSignal
    const firstSum = slice(first, 1) as OneBitSignal

    const second = halfAdder(inCarry, firstSum)
    const secondCarry = slice(second, 0, 1) as OneBitSignal
    const secondSum = slice(second, 1) as OneBitSignal

    const outCarry = or(firstCarry, secondCarry)
    return concatenate(outCarry, secondSum) as TwoBitSignal
}

export const add16 = (
    signal: SixteenBitSignal,
    otherSignal: SixteenBitSignal,
): SixteenBitSignal => {
    const signals = []
    let carryBit = SIGNALS._0
    for (let i = 15; i >= 0; i--) {
        const bit = slice(signal, i, i + 1) as OneBitSignal
        const otherBit = slice(otherSignal, i, i + 1) as OneBitSignal
        const result = fullAdder(bit, otherBit, carryBit)

        const sumBit = slice(result, 1) as OneBitSignal
        carryBit = slice(result, 0, 1) as OneBitSignal

        signals.unshift(sumBit)
    }
    return concatenate(...signals) as SixteenBitSignal
}

export const inc16 = (
    signal: SixteenBitSignal,
): SixteenBitSignal => {
    return add16(signal, makeSignal('0000 0000 0000 0001') as SixteenBitSignal)
}
