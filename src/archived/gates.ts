import {
    SIGNALS,
    makeSignal,
    OneBitSignal,
    TwoBitSignal,
    ThreeBitSignal,
    FourBitSignal,
    EightBitSignal,
    SixteenBitSignal,
    toString,
    isEquals,
    singleInputMap,
    doubleInputMap,
    some,
} from './signals'

export const nand = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
): OneBitSignal => {
    if (
        isEquals(signal, SIGNALS._1) &&
        isEquals(otherSignal, SIGNALS._1)
    ) {
        return SIGNALS._0
    } else {
        return SIGNALS._1
    }
}

export const not = (
    signal: OneBitSignal,
): OneBitSignal => {
    return nand(signal, signal)
}

export const not16 = (
    signal: SixteenBitSignal,
): SixteenBitSignal => {
    return singleInputMap(signal, not) as SixteenBitSignal
}

export const and = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
): OneBitSignal => {
    return not(nand(signal, otherSignal))
}

export const and16 = (
    signal: SixteenBitSignal,
    otherSignal: SixteenBitSignal,
): SixteenBitSignal => {
    return doubleInputMap(signal, otherSignal, and) as SixteenBitSignal
}

export const or = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
): OneBitSignal => {
    return nand(
        nand(signal, signal),
        nand(otherSignal, otherSignal),
    )
}

export const or16 = (
    signal: SixteenBitSignal,
    otherSignal: SixteenBitSignal,
): SixteenBitSignal => {
    return doubleInputMap(signal, otherSignal, or) as SixteenBitSignal
}

export const or8way = (
    signal: EightBitSignal,
): OneBitSignal => {
    const isOne = (signal: OneBitSignal) => isEquals(signal, SIGNALS._1)
    return some(signal, isOne)
}

export const xor = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
): OneBitSignal => {
    const a = nand(signal, otherSignal)
    return nand(
        nand(signal, a),
        nand(otherSignal, a)
    )
}

export const multiplexor = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
    select: OneBitSignal,
): OneBitSignal => {
    if (isEquals(select, SIGNALS._0)) return signal
    if (isEquals(select, SIGNALS._1)) return otherSignal
}

export const multiplexor16 = (
    signal: SixteenBitSignal,
    otherSignal: SixteenBitSignal,
    select: OneBitSignal,
): SixteenBitSignal => {
    if (isEquals(select, SIGNALS._0)) return signal
    if (isEquals(select, SIGNALS._1)) return otherSignal
}

export const multiplexor4way16 = (
    first: SixteenBitSignal,
    second: SixteenBitSignal,
    third: SixteenBitSignal,
    fourth: SixteenBitSignal,
    select: TwoBitSignal,
): SixteenBitSignal => {
    if (isEquals(select, SIGNALS._00)) return first
    if (isEquals(select, SIGNALS._01)) return second
    if (isEquals(select, SIGNALS._10)) return third
    if (isEquals(select, SIGNALS._11)) return fourth
}

export const multiplexor8way16 = (
    first: SixteenBitSignal,
    second: SixteenBitSignal,
    third: SixteenBitSignal,
    fourth: SixteenBitSignal,
    fifth: SixteenBitSignal,
    sixth: SixteenBitSignal,
    seventh: SixteenBitSignal,
    eight: SixteenBitSignal,
    select: ThreeBitSignal,
): SixteenBitSignal => {
    if (isEquals(select, SIGNALS._000)) return first
    if (isEquals(select, SIGNALS._001)) return second
    if (isEquals(select, SIGNALS._010)) return third
    if (isEquals(select, SIGNALS._011)) return fourth
    if (isEquals(select, SIGNALS._100)) return fifth
    if (isEquals(select, SIGNALS._101)) return sixth
    if (isEquals(select, SIGNALS._110)) return seventh
    if (isEquals(select, SIGNALS._111)) return eight
}

export const demultiplexor = (
    signal: OneBitSignal,
    select: OneBitSignal,
): TwoBitSignal => {
    const string = toString(signal)
    if (isEquals(select, SIGNALS._0)) return makeSignal(`${string}0`) as TwoBitSignal
    if (isEquals(select, SIGNALS._1)) return makeSignal(`0${string}`) as TwoBitSignal
}

export const demultiplexor4way = (
    signal: OneBitSignal,
    select: TwoBitSignal,
): FourBitSignal => {
    const string = toString(signal)
    if (isEquals(select, SIGNALS._00)) return makeSignal(`${string}000`) as FourBitSignal
    if (isEquals(select, SIGNALS._01)) return makeSignal(`0${string}00`) as FourBitSignal
    if (isEquals(select, SIGNALS._10)) return makeSignal(`00${string}0`) as FourBitSignal
    if (isEquals(select, SIGNALS._11)) return makeSignal(`000${string}`) as FourBitSignal
}

export const demultiplexor8way = (
    signal: OneBitSignal,
    select: ThreeBitSignal,
): EightBitSignal => {
    const string = toString(signal)
    if (isEquals(select, SIGNALS._000)) return makeSignal(`${string}0000000`) as EightBitSignal
    if (isEquals(select, SIGNALS._001)) return makeSignal(`0${string}000000`) as EightBitSignal
    if (isEquals(select, SIGNALS._010)) return makeSignal(`00${string}00000`) as EightBitSignal
    if (isEquals(select, SIGNALS._011)) return makeSignal(`000${string}0000`) as EightBitSignal
    if (isEquals(select, SIGNALS._100)) return makeSignal(`0000${string}000`) as EightBitSignal
    if (isEquals(select, SIGNALS._101)) return makeSignal(`00000${string}00`) as EightBitSignal
    if (isEquals(select, SIGNALS._110)) return makeSignal(`000000${string}0`) as EightBitSignal
    if (isEquals(select, SIGNALS._111)) return makeSignal(`0000000${string}`) as EightBitSignal
}
