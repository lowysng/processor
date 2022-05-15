import {
    inc16,
    CPU,
    RAM64K,
} from '../components'

import {
    SixteenBitSignal,
    SIGNALS,
} from '../signals'

const MEMORY_RANGE = 32

const PROGRAM = [
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1
    new SixteenBitSignal('1000 1100 0000 1000'),  // M=A
    new SixteenBitSignal('0000 0000 0000 0011'),  // @3
    new SixteenBitSignal('1000 1100 0001 0000'),  // D=A
    new SixteenBitSignal('0000 0000 0000 0010'),  // @2
    new SixteenBitSignal('1000 0011 0000 1000'),  // M=D
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1
    new SixteenBitSignal('1001 1100 0001 0000'),  // D=M
    new SixteenBitSignal('0000 0000 0000 0010'),  // @2
    new SixteenBitSignal('1001 0100 1101 0000'),  // D=D-M
    new SixteenBitSignal('0000 0000 0001 0100'),  // @20
    new SixteenBitSignal('1000 0011 0001 0001'),  // D;JGT
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1
    new SixteenBitSignal('1001 1100 0001 0000'),  // D=M
    new SixteenBitSignal('0000 0000 0000 0000'),  // @0
    new SixteenBitSignal('1001 0000 1000 1000'),  // M=D+M
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1
    new SixteenBitSignal('1001 1101 1100 1000'),  // M=M+1
    new SixteenBitSignal('0000 0000 0000 0110'),  // @6
    new SixteenBitSignal('1000 1010 1000 0111'),  // 0;JMP
    new SixteenBitSignal('1000 1000 0000 0000'),  // HALT
]

export class Computer {
    private cpu = new CPU()
    private iMemory = new RAM64K()
    private dMemory = new RAM64K()

    private instruction = this.iMemory.probe(SIGNALS._0000000000000000)
    private memoryIn = this.dMemory.probe(SIGNALS._0000000000000000)

    constructor() {
        this.loadProgram()
    }

    private loadProgram() {
        let address = SIGNALS._0000000000000000
        PROGRAM.forEach(instruction => {
            this.iMemory.probe(address, instruction, SIGNALS._1)
            address = inc16(address)
        })
    }

    public fetchExecute() {
        const {
            memoryOut,
            memoryAddress,
            isWriteMemory,
            pcOut,
            isHalt,
        } = this.cpu.step({
            instruction: this.instruction,
            memoryIn: this.memoryIn,
            isReset: SIGNALS._0,
        })

        this.instruction = this.iMemory.probe(pcOut)
        this.memoryIn = this.dMemory.probe(memoryAddress, memoryOut, isWriteMemory)

        if (isHalt.isEquals(SIGNALS._1)) {
            return false
        }

        return true
    }

}
