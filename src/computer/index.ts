import { CPU, RAM64K, inc16 } from '../components'
import { SIGNALS } from '../signals'
import { program } from './program'

const MEMORY_RANGE = 32

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
        program.forEach(instruction => {
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
