import { CPU, RAM64K, inc16 } from '../components'
import { Signal, SIGNALS } from '../signals'
import { program } from './program'

const MEMORY_RANGE = 32

export class Computer {
    private cpu = new CPU()
    private iMemory = new RAM64K()
    private dMemory = new RAM64K()

    private pcAddress = SIGNALS._0000000000000000
    private memoryIn = this.dMemory.probe(SIGNALS._0000000000000000)

    private history: ComputerState[] = []

    constructor() {
        this.loadProgram()
        this.storeHistory()
    }

    private loadProgram() {
        let address = SIGNALS._0000000000000000
        program.forEach(instruction => {
            this.iMemory.probe(address, instruction, SIGNALS._1)
            address = inc16(address)
        })
    }

    private storeHistory() {
        const { aRegister, dRegister, programCounter } = this.cpu.probeRegisters()
        this.history.push({
            aRegister: aRegister.toString(),
            dRegister: dRegister.toString(),
            programCounter: programCounter.toString(),
            iMemory: this.iMemory.snap(MEMORY_RANGE),
            dMemory: this.dMemory.snap(MEMORY_RANGE),
        })
    }

    public fetchExecute() {
        // fetch
        const instruction = this.iMemory.probe(this.pcAddress)

        // execute
        const {
            memoryOut,
            memoryAddress,
            isWriteMemory,
            pcOut,
            isHalt,
        } = this.cpu.step({
            instruction,
            memoryIn: this.memoryIn,
            isReset: SIGNALS._0,
        })

        this.memoryIn = this.dMemory.probe(memoryAddress, memoryOut, isWriteMemory)
        this.pcAddress = pcOut
        
        this.storeHistory()

        if (isHalt.isEquals(SIGNALS._1)) {
            return false
        }

        return true
    }

    public debug() {
        let stateIndex = 0
        let maxStateIndex = this.history.length

        this.render(stateIndex, stateIndex === maxStateIndex - 1)

        const readline = require('readline')
        readline.emitKeypressEvents(process.stdin);
        process.stdin.setRawMode(true);

        process.stdin.on('keypress', (str, key) => {
            if (key.ctrl && key.name === 'c') {
                console.clear();
                process.exit();
            } else if (key.name === 'left' && stateIndex !== 0) {
                stateIndex = stateIndex - 1;
                this.render(stateIndex, stateIndex === maxStateIndex - 1);
            } else if (key.name === 'right' && stateIndex !== (maxStateIndex - 1)) {
                stateIndex = stateIndex + 1;
                this.render(stateIndex, stateIndex === maxStateIndex - 1);
            }
        });

    }

    private render(stateIndex: number, isHalt: boolean) {
        const { aRegister, dRegister, programCounter, iMemory, dMemory } = this.history[stateIndex]

        console.clear()
        console.log('Left: go to previous state')
        console.log('Right: go to next state')
        console.log('CTRL+C: quit\n')
        console.log(`   State: ${stateIndex} ${isHalt ? '(HALT)' : ''}`)
        console.log(`   CPU A register:      ${aRegister} | ${Signal.toDecimal(aRegister)}`)
        console.log(`   CPU D register:      ${dRegister} | ${Signal.toDecimal(dRegister)}`)
        console.log(`   CPU program counter: ${programCounter} | ${Signal.toDecimal(programCounter)}\n`)
        console.log('   ---------------------\t---------------------')
        console.log('   Instruction memory   \tData memory          ')
        console.log('   ---------------------\t---------------------')

        for (let i = 0 ; i < MEMORY_RANGE; i++) {
            const _i = String(i).padStart(2, '0')
            if (i === Signal.toDecimal(programCounter)) {
                console.log(`-> [${_i}] ${iMemory[i]} \t[${_i}] ${dMemory[i]} | ${Signal.toDecimal(dMemory[i])}`)
            } else {
                console.log(`   [${_i}] ${iMemory[i]} \t[${_i}] ${dMemory[i]} | ${Signal.toDecimal(dMemory[i])}`)
            }
        }

    }

}

export interface ComputerState {
    aRegister: string;
    dRegister: string;
    programCounter: string;
    iMemory: string[];
    dMemory: string[];
}
