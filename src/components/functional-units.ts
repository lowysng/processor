import {
    SIGNALS,
    Signal,
    OneBitSignal,
    TwoBitSignal,
    SixBitSignal,
    SixteenBitSignal,
} from '../signals'
import {
    and,
    xor,
    or,
    not16,
    and16,
} from './gates'

export const halfAdder = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
): TwoBitSignal => {
    const carry = and(signal, otherSignal)
    const sum = xor(signal, otherSignal)
    return carry.concatenate(sum)
}

export const fullAdder = (
    signal: OneBitSignal,
    otherSignal: OneBitSignal,
    inCarry: OneBitSignal
): TwoBitSignal => {
    const first = halfAdder(signal, otherSignal)
    const firstCarry = first.slice(0, 1)
    const firstSum = first.slice(1)

    const second = halfAdder(inCarry, firstSum)
    const secondCarry = second.slice(0, 1)
    const secondSum = second.slice(1)

    const outCarry = or(firstCarry, secondCarry)
    return outCarry.concatenate(secondSum)
}

export const add16 = (
    signal: SixteenBitSignal,
    otherSignal: SixteenBitSignal,
): SixteenBitSignal => {
    const signals = []
    let carryBit = SIGNALS._0
    for (let i = 15; i >= 0; i--) {
        const bit = signal.slice(i, i + 1)
        const otherBit = otherSignal.slice(i, i + 1)
        const result = fullAdder(bit, otherBit, carryBit)

        const sumBit = result.slice(1)
        carryBit = result.slice(0, 1)

        signals.unshift(sumBit)
    }
    return (new Signal('', 0)).concatenate(...signals)
}

export const inc16 = (
    signal: SixteenBitSignal,
): SixteenBitSignal => {
    return add16(signal, SIGNALS._0000000000000001)
}

type ALUInput = {
    x: SixteenBitSignal,
    y: SixteenBitSignal,
    control: SixBitSignal,
}

type ALUOutput = {
    out: SixteenBitSignal,
    isZero: OneBitSignal,
    isNegative: OneBitSignal,
}

export const ALU = ({ x, y, control }: ALUInput): ALUOutput => {
    const zeroX     = control.slice(0, 1).isEquals(SIGNALS._1)
    const negateX   = control.slice(1, 2).isEquals(SIGNALS._1)
    const zeroY     = control.slice(2, 3).isEquals(SIGNALS._1)
    const negateY   = control.slice(3, 4).isEquals(SIGNALS._1)
    const isAdd     = control.slice(4, 5).isEquals(SIGNALS._1)
    const negateOut = control.slice(5, 6).isEquals(SIGNALS._1)

    if (zeroX)      x = and16(x, not16(x))
    if (negateX)    x = not16(x)
    if (zeroY)      y = and16(y, not16(y))
    if (negateY)    y = not16(y)
    
    let out: SixteenBitSignal

    if (isAdd) {
        out = add16(x, y)
    } else {
        out = and16(x, y)
    }
    if (negateOut) out = not16(out)
    
    const isZero = (signal: Signal) => {
        const bitIsZero = (oneBitSignal: OneBitSignal) => oneBitSignal.isEquals(SIGNALS._0)
        return signal.every(bitIsZero) ? SIGNALS._1 : SIGNALS._0
    }
    const isNegative = (signal: Signal) => {
        const firstBitIsOne = (signal: Signal) => signal.slice(0, 1).isEquals(SIGNALS._1)
        return firstBitIsOne(signal) ? SIGNALS._1 : SIGNALS._0
    }
    
    return {
        out,
        isZero: isZero(out),
        isNegative: isNegative(out),
    }
}
