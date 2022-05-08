export enum Bit {
    ZERO = '0',
    ONE = '1',
}

export interface Signal {
    bits: Bit[]
}

export interface OneBitSignal extends Signal {
    bits: [Bit]
}

export interface TwoBitSignal extends Signal {
    bits: [Bit, Bit]
}

export interface ThreeBitSignal extends Signal {
    bits: [Bit, Bit, Bit]
}

export interface FourBitSignal extends Signal {
    bits: [Bit, Bit, Bit, Bit]
}

export interface SixBitSignal extends Signal {
    bits: [Bit, Bit, Bit, Bit, Bit, Bit]
}

export interface EightBitSignal extends Signal {
    bits: [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]
}

export interface SixteenBitSignal extends Signal {
    bits: [Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit, Bit]
}

export const makeSignal = (signal: string): Signal => {
    const removeWhitespace = signal.replace(/\s+/g, '')
    const array = removeWhitespace.split('')
    const bits = array.map((char) => {
        if (char === '0') return Bit.ZERO
        if (char === '1') return Bit.ONE
        throw new Error(`invalid char in string of makeSignal: ${signal}`)
    })
    return { bits }
}

const _0: OneBitSignal = makeSignal('0') as OneBitSignal
const _1: OneBitSignal = makeSignal('1') as OneBitSignal

const _00: TwoBitSignal = makeSignal('00') as TwoBitSignal
const _01: TwoBitSignal = makeSignal('01') as TwoBitSignal
const _10: TwoBitSignal = makeSignal('10') as TwoBitSignal
const _11: TwoBitSignal = makeSignal('11') as TwoBitSignal

const _000: ThreeBitSignal = makeSignal('000') as ThreeBitSignal
const _001: ThreeBitSignal = makeSignal('001') as ThreeBitSignal
const _010: ThreeBitSignal = makeSignal('010') as ThreeBitSignal
const _011: ThreeBitSignal = makeSignal('011') as ThreeBitSignal
const _100: ThreeBitSignal = makeSignal('100') as ThreeBitSignal
const _101: ThreeBitSignal = makeSignal('101') as ThreeBitSignal
const _110: ThreeBitSignal = makeSignal('110') as ThreeBitSignal
const _111: ThreeBitSignal = makeSignal('111') as ThreeBitSignal

const _0000: FourBitSignal = makeSignal('0000') as FourBitSignal
const _0001: FourBitSignal = makeSignal('0001') as FourBitSignal
const _0010: FourBitSignal = makeSignal('0010') as FourBitSignal
const _0100: FourBitSignal = makeSignal('0100') as FourBitSignal
const _1000: FourBitSignal = makeSignal('1000') as FourBitSignal

const _00000000: EightBitSignal = makeSignal('0000 0000') as EightBitSignal
const _11111111: EightBitSignal = makeSignal('1111 1111') as EightBitSignal

const _0000000000000000: SixteenBitSignal = makeSignal('0000000000000000') as SixteenBitSignal
const _0000000000000001: SixteenBitSignal = makeSignal('0000000000000001') as SixteenBitSignal
const _0000000000000010: SixteenBitSignal = makeSignal('0000000000000010') as SixteenBitSignal
const _0000000011111111: SixteenBitSignal = makeSignal('0000000011111111') as SixteenBitSignal
const _1111111100000000: SixteenBitSignal = makeSignal('1111111100000000') as SixteenBitSignal
const _1111111111111110: SixteenBitSignal = makeSignal('1111111111111110') as SixteenBitSignal
const _1111111111111111: SixteenBitSignal = makeSignal('1111111111111111') as SixteenBitSignal

export const SIGNALS = {
    _0,
    _1,
    _00,
    _01,
    _10,
    _11,
    _000,
    _001,
    _010,
    _011,
    _100,
    _101,
    _110,
    _111,
    _0000,
    _0001,
    _0010,
    _0100,
    _1000,
    _00000000,
    _11111111,
    _0000000000000000,
    _0000000000000001,
    _0000000000000010,
    _0000000011111111,
    _1111111100000000,
    _1111111111111110,
    _1111111111111111,
}

export const slice = (
    signal: Signal,
    start: number,
    end?: number,
): Signal => {
    return { bits: signal.bits.slice(start, end) }
}

export const concatenate = (
    ...signals: Signal[]
): Signal => {
    const output = { bits: [] }
    signals.forEach((signal) => {
        signal.bits.forEach((bit) => {
            output.bits.push(bit)
        })
    })
    return output
}

export const toString = (
    signal: Signal,
): string => {
    return signal.bits.map((bit) => {
        if (bit === Bit.ZERO) return '0'
        if (bit === Bit.ONE) return '1'
    }).join('')
}

export const isEquals = (
    signal: Signal,
    otherSignal: Signal
): boolean => {
    if (signal.bits.length !== otherSignal.bits.length) {
        throw new Error(`non-matching signals length in isEquals: ${signal.bits.length} !== ${otherSignal.bits.length}`)
    }
    return signal.bits.every((bit, index) => bit === otherSignal.bits[index])
}

export const singleInputMap = (
    signal: Signal,
    mapper: (s: OneBitSignal) => OneBitSignal
): Signal => {
    return {
        bits: signal.bits.map((bit) => mapper({ bits: [bit] }).bits[0])
    }
}

export const doubleInputMap = (
    signal: Signal,
    otherSignal: Signal,
    mapper: (s1: OneBitSignal, s2: OneBitSignal) => OneBitSignal
): Signal => {
    return {
        bits: signal.bits.map((bit, index) => mapper(
            { bits: [bit] },
            { bits: [otherSignal.bits[index]] }
        ).bits[0])
    }
}

export const some = (
    signal: Signal,
    predicate: (s: OneBitSignal) => boolean
): OneBitSignal => {
    if (signal.bits.some((bit) => predicate({ bits: [bit] }))) {
        return _1
    } else {
        return _0
    }
}

export const every = (
    signal: Signal,
    predicate: (s: OneBitSignal) => boolean
): OneBitSignal => {
    if (signal.bits.every((bit) => predicate({ bits: [bit] }))) {
        return _1
    } else {
        return _0
    }
}

export const toNumber = (
    signal: Signal,
): number => {
    let sum = 0
    let j = 0
    for (let i = signal.bits.length - 1; i >= 0; i--) {
        if (signal.bits[i] === Bit.ONE) {
            sum += 2 ** j
        }
        j += 1
    }
    return sum
}
