import {
    OneBitSignal,
    ThreeBitSignal,
    SixBitSignal,
    SixteenBitSignal,
    SIGNALS,
} from "../signals"
import {
    multiplexor,
    not,
    or,
    and,
} from "./gates"
import { Register, ProgramCounter } from "./memory"
import { ALU } from "./functional-units"

export type CPUInput = {
    instruction: SixteenBitSignal,
    memoryIn: SixteenBitSignal,
    isReset: OneBitSignal,
}

export type CPUOutput = {
    memoryOut: SixteenBitSignal,
    memoryAddress: SixteenBitSignal,
    isWriteMemory: OneBitSignal,
    pcOut: SixteenBitSignal,
    isHalt: OneBitSignal,
}

export class CPU {
    private aRegister = new Register()
    private dRegister = new Register()
    private programCounter = new ProgramCounter()

    step({ instruction, memoryIn, isReset }: CPUInput): CPUOutput {
        // decode
        const opCode: OneBitSignal = instruction.slice(0, 1)
        const aSignal: OneBitSignal = instruction.slice(3, 4)
        const cSignal: SixBitSignal = instruction.slice(4, 10)
        const dSignal: ThreeBitSignal = instruction.slice(10, 13)
        const jSignal: ThreeBitSignal = instruction.slice(13, 16)

        // execute
        const ALUInput1: SixteenBitSignal = this.dRegister.probe()
        const ALUInput2: SixteenBitSignal = multiplexor(this.aRegister.probe(), memoryIn, aSignal)
        const { out: ALUOut, isZero, isNegative } = ALU({ x: ALUInput1, y: ALUInput2, control: cSignal })

        // write back to a register
        const aRegisterNextValue: SixteenBitSignal = multiplexor(instruction, ALUOut, opCode)
        const isWriteARegister: OneBitSignal = or(not(opCode), dSignal.slice(0, 1))
        this.aRegister.probe(aRegisterNextValue, isWriteARegister)

        // write back to d register
        const isWriteDRegister: OneBitSignal = and(opCode, dSignal.slice(1, 2))
        this.dRegister.probe(ALUOut, isWriteDRegister)

        // write back to memory
        const memoryOut: SixteenBitSignal = ALUOut
        const memoryAddress: SixteenBitSignal = this.aRegister.probe()
        const isWriteMemory: OneBitSignal = and(opCode, dSignal.slice(2, 3))

        // fetch next instruction
        let isJump: OneBitSignal = SIGNALS._0

        if (opCode.isEquals(SIGNALS._0)) isJump = SIGNALS._0
        else if (jSignal.isEquals(SIGNALS._000)) isJump = SIGNALS._0
        else if (jSignal.isEquals(SIGNALS._111)) isJump = SIGNALS._1
        else if (jSignal.isEquals(SIGNALS._001)) isJump = and(not(isZero), not(isNegative))
        else if (jSignal.isEquals(SIGNALS._010)) isJump = isZero
        else if (jSignal.isEquals(SIGNALS._011)) isJump = or(isZero, not(isNegative))
        else if (jSignal.isEquals(SIGNALS._100)) isJump = isNegative
        else if (jSignal.isEquals(SIGNALS._101)) isJump = not(isZero)
        else if (jSignal.isEquals(SIGNALS._110)) isJump = or(isZero, isNegative)

        const isIncrement: OneBitSignal = not(isJump)
        const pcOut: SixteenBitSignal = this.programCounter.probe(this.aRegister.probe(), isIncrement, isJump, isReset)

        return {
            memoryOut,
            memoryAddress,
            isWriteMemory,
            pcOut,
            isHalt: cSignal.isEquals(new SixBitSignal('100 000')) ? SIGNALS._1 : SIGNALS._0,
        }
    }

    probeRegisters() {
        return {
            aRegister: this.aRegister.probe(),
            dRegister: this.dRegister.probe(),
            programCounter: this.programCounter.probe(),
        }
    }
}
