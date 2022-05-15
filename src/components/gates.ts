import {
    SIGNALS,
    Signal,
    OneBitSignal,
    TwoBitSignal,
    ThreeBitSignal,
    EightBitSignal, 
    SixteenBitSignal,
    FourBitSignal,
} from '../signals'

export const nand = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
): OneBitSignal => {
    if (signal.isEquals(SIGNALS._1) && otherSignal.isEquals(SIGNALS._1)) {
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
    return signal.map(not)
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
    return signal.mapAgainst(otherSignal, and)
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
    return signal.mapAgainst(otherSignal, or)
}

export const or8way = (
    signal: EightBitSignal,
): OneBitSignal => {
    const isOne = (signal: OneBitSignal) => signal.isEquals(SIGNALS._1)
    const someIsOne = signal.some(isOne)
    if (someIsOne) {
        return SIGNALS._1
    } else {
        return SIGNALS._0
    }
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
    signal: Signal,
    otherSignal: Signal,
    select: OneBitSignal,
): OneBitSignal => {
    if (select.isEquals(SIGNALS._0)) return signal
    if (select.isEquals(SIGNALS._1)) return otherSignal
}

export const multiplexor4way = (
    first: Signal,
    second: Signal,
    third: Signal,
    fourth: Signal,
    select: TwoBitSignal,
): SixteenBitSignal => {
    if (select.isEquals(SIGNALS._00)) return first
    if (select.isEquals(SIGNALS._01)) return second
    if (select.isEquals(SIGNALS._10)) return third
    if (select.isEquals(SIGNALS._11)) return fourth
}

export const multiplexor8way = (
    first: Signal,
    second: Signal,
    third: Signal,
    fourth: Signal,
    fifth: Signal,
    sixth: Signal,
    seventh: Signal,
    eight: Signal,
    select: ThreeBitSignal,
): SixteenBitSignal => {
    if (select.isEquals(SIGNALS._000)) return first
    if (select.isEquals(SIGNALS._001)) return second
    if (select.isEquals(SIGNALS._010)) return third
    if (select.isEquals(SIGNALS._011)) return fourth
    if (select.isEquals(SIGNALS._100)) return fifth
    if (select.isEquals(SIGNALS._101)) return sixth
    if (select.isEquals(SIGNALS._110)) return seventh
    if (select.isEquals(SIGNALS._111)) return eight
}

export const demultiplexor = (
    signal: OneBitSignal,
    select: OneBitSignal,
): TwoBitSignal => {
    const bit: string = signal.toString()
    let out: string
    
    if (select.isEquals(SIGNALS._0)) out = `${bit}0`
    if (select.isEquals(SIGNALS._1)) out = `0${bit}`
    
    return new TwoBitSignal(out)
}

export const demultiplexor4way = (
    signal: OneBitSignal,
    select: TwoBitSignal,
): FourBitSignal => {
    const bit = signal.toString()
    let out: string

    if (select.isEquals(SIGNALS._00)) out = `${bit}000`
    if (select.isEquals(SIGNALS._01)) out = `0${bit}00`
    if (select.isEquals(SIGNALS._10)) out = `00${bit}0`
    if (select.isEquals(SIGNALS._11)) out = `000${bit}`

    return new FourBitSignal(out)
}

export const demultiplexor8way = (
    signal: OneBitSignal,
    select: ThreeBitSignal,
): EightBitSignal => {
    const bit = signal.toString()
    let out: string

    if (select.isEquals(SIGNALS._000)) out = `${bit}0000000`
    if (select.isEquals(SIGNALS._001)) out = `0${bit}000000`
    if (select.isEquals(SIGNALS._010)) out = `00${bit}00000`
    if (select.isEquals(SIGNALS._011)) out = `000${bit}0000`
    if (select.isEquals(SIGNALS._100)) out = `0000${bit}000`
    if (select.isEquals(SIGNALS._101)) out = `00000${bit}00`
    if (select.isEquals(SIGNALS._110)) out = `000000${bit}0`
    if (select.isEquals(SIGNALS._111)) out = `0000000${bit}`

    return new EightBitSignal(out)
}

