import {
    SIGNALS,
    OneBitSignal,
    TwoBitSignal,
    ThreeBitSignal,
    SixBitSignal,
    SixteenBitSignal,
    concatenate,
    slice,
    makeSignal,
    isEquals,
    toString,
    every,
} from './signals'
import {
    and,
    xor,
    or,
    not16,
    and16,
    multiplexor16,
    not,
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

    if (zeroX)      x = and16(x, not16(x))
    if (negateX)    x = not16(x)
    if (zeroY)      y = and16(y, not16(y))
    if (negateY)    y = not16(y)

    if (isAdd)     out = add16(x, y)
    else           out = and16(x, y)
    if (negateOut) out = not16(out)
    
    const isZero = (signal: OneBitSignal) => isEquals(signal, SIGNALS._0)

    return {
        out,
        isZero: every(out, isZero),
        isNegative: isEquals(slice(out, 0, 1), SIGNALS._1) ? SIGNALS._1 : SIGNALS._0,
    }
}

export type CPUInput = {
    instruction: SixteenBitSignal,
    memoryIn: SixteenBitSignal,
    isReset: OneBitSignal,
}

export type CPUOutput = {
    memoryOut: SixteenBitSignal,
    memoryAddress: SixteenBitSignal,
    isWriteMemory: OneBitSignal,
    pcRegister: SixteenBitSignal,
    isHalt: OneBitSignal,

    _aRegister: Function,
    _dRegister: Function,
    _pcRegister: Function,
}

type CPU = (input: CPUInput) => CPUOutput

export const makeCPU = (): CPU => {
    const aRegister = makeRegister()
    const dRegister = makeRegister()
    const pcRegister = makeProgramCounter()

    return ({ instruction, memoryIn, isReset }) => {
        const opCode = slice(instruction, 0, 1) as OneBitSignal
        const aSignal = slice(instruction, 3, 4) as OneBitSignal
        const cSignal = slice(instruction, 4, 10) as SixBitSignal
        const dSignal = slice(instruction, 10, 13) as ThreeBitSignal
        const jSignal = slice(instruction, 13, 16) as ThreeBitSignal

        const ALUInput1 = dRegister()
        const ALUInput2 = multiplexor16(aRegister(), memoryIn, aSignal)
        const { out: ALUOut, isZero, isNegative } = ALU({ x: ALUInput1, y: ALUInput2, control: cSignal })

        const aRegisterNextValue = multiplexor16(instruction, ALUOut, opCode)
        const isWriteARegister = or(not(opCode), slice(dSignal, 0, 1) as OneBitSignal)
        aRegister(aRegisterNextValue, isWriteARegister)

        const isWriteDRegister = and(opCode, slice(dSignal, 1, 2) as OneBitSignal)
        dRegister(ALUOut, isWriteDRegister)

        const memoryOut = ALUOut
        const memoryAddress = aRegister()
        const isWriteMemory = and(opCode, slice(dSignal, 2, 3) as OneBitSignal)

        let isJump: OneBitSignal = SIGNALS._0
        if (isEquals(opCode, SIGNALS._0)) isJump = SIGNALS._0
        else if (isEquals(jSignal, makeSignal('000'))) isJump = SIGNALS._0
        else if (isEquals(jSignal, makeSignal('111'))) isJump = SIGNALS._1
        else if (isEquals(jSignal, makeSignal('001'))) isJump = and(not(isZero), not(isNegative))
        else if (isEquals(jSignal, makeSignal('010'))) isJump = isZero
        else if (isEquals(jSignal, makeSignal('011'))) isJump = or(isZero, not(isNegative))
        else if (isEquals(jSignal, makeSignal('100'))) isJump = isNegative
        else if (isEquals(jSignal, makeSignal('101'))) isJump = not(isZero)
        else if (isEquals(jSignal, makeSignal('110'))) isJump = or(isZero, isNegative)

        const isIncrement = not(isJump)
        const pcOut = pcRegister(aRegister(), isIncrement, isJump, isReset)

        return {
            memoryOut,
            memoryAddress,
            isWriteMemory,
            pcRegister: pcOut,
            isHalt: isEquals(cSignal, makeSignal('100000')) ? SIGNALS._1 : SIGNALS._0,
            _aRegister: aRegister,
            _dRegister: dRegister,
            _pcRegister: pcRegister,
        }
    }
}
