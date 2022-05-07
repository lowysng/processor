import {
    SIGNALS,
    OneBitSignal,
    TwoBitSignal,
    SixBitSignal,
    SixteenBitSignal,
    concatenate,
    slice,
    makeSignal,
    isEquals,
    toString,
    some,
} from './signals'
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

type Register = (input?: SixteenBitSignal, isLoad?: OneBitSignal) => SixteenBitSignal

export const makeRegister = (): Register => {
    let latch: SixteenBitSignal = SIGNALS._0000000000000000
    return (input?, isLoad?) => {
        if (input && isLoad && isEquals(isLoad, SIGNALS._1)) {
            latch = input
        }
        return latch
    }
}

type RAM64K = (address: SixteenBitSignal, input?: SixteenBitSignal, isLoad?: OneBitSignal) => SixteenBitSignal

export const makeRAM64K = (): RAM64K => {
    const registers = {}
    return (address, input?, isLoad?) => {
        const string = toString(address)
        if (registers[string] === undefined) {
            registers[string] = makeRegister()
        }
        const register = registers[string]
        return register(input, isLoad)
    }
}

type ProgramCounter = (
    input?: SixteenBitSignal,
    isIncrement?: OneBitSignal,
    isLoad?: OneBitSignal,
    isReset?: OneBitSignal,
) => SixteenBitSignal

export const makeProgramCounter = (): ProgramCounter => {
    let latch: SixteenBitSignal = SIGNALS._0000000000000000
    return (input?, isIncrement?,  isLoad?, isReset?,) => {
        if (isReset && isEquals(isReset, SIGNALS._1)) {
            latch = SIGNALS._0000000000000000
        } else if (isLoad && isEquals(isLoad, SIGNALS._1)) {
            latch = input
        } else if (isIncrement && isEquals(isIncrement, SIGNALS._1)) {
            latch = inc16(latch)
        }
        return latch
    }
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
    const zeroX     = isEquals(slice(control, 0, 1), SIGNALS._1)
    const negateX   = isEquals(slice(control, 1, 2), SIGNALS._1)
    const zeroY     = isEquals(slice(control, 2, 3), SIGNALS._1)
    const negateY   = isEquals(slice(control, 3, 4), SIGNALS._1)
    const isAdd     = isEquals(slice(control, 4, 5), SIGNALS._1)
    const negateOut = isEquals(slice(control, 5, 6), SIGNALS._1)

    let out: SixteenBitSignal

    if (zeroX)      x = SIGNALS._0000000000000000
    if (negateX)    x = not16(x)
    if (zeroY)      y = SIGNALS._0000000000000000
    if (negateY)    y = not16(y)

    if (isAdd)     out = add16(x, y)
    else           out = and16(x, y)
    if (negateOut) out = not16(out)
    
    const isOne = (signal: OneBitSignal) => isEquals(signal, SIGNALS._1)
    const isZero = !some(out, isOne) ? SIGNALS._1 : SIGNALS._0
    const isNegative = isEquals(slice(out, 0, 1), SIGNALS._1) ? SIGNALS._1 : SIGNALS._0

    return {
        out,
        isZero,
        isNegative,
    }
}
