import { inc16, makeCPU, makeRAM64K } from './chips'
import { SIGNALS, isEquals, SixteenBitSignal, toString, toNumber } from './signals'
import { instructions } from './instructions'

export type ComputerState = {
    aRegister: SixteenBitSignal,
    dRegister: SixteenBitSignal,
    pcRegister: SixteenBitSignal,
    instruction: SixteenBitSignal,
    iMemory: SixteenBitSignal[],
    dMemory: SixteenBitSignal[],
}

const MEMORY_RANGE = 32

export const makeComputer = () => {
const CPU = makeCPU()
    const iMemory = makeRAM64K()
    const dMemory = makeRAM64K()

    // load instruction into instruction memory
    let iMemoryAddress = SIGNALS._0000000000000000
    instructions.forEach((instruction) => {
        iMemory(iMemoryAddress, instruction, SIGNALS._1)
        iMemoryAddress = inc16(iMemoryAddress)
    })

    // initialise values
    let instruction = iMemory(SIGNALS._0000000000000000)
    let memoryIn = dMemory(SIGNALS._0000000000000000)
    let isHalt = SIGNALS._0

    // store initial state
    const stateHistory: ComputerState[] = [{
        aRegister: SIGNALS._0000000000000000,
        dRegister: SIGNALS._0000000000000000,
        pcRegister: SIGNALS._0000000000000000,
        instruction: iMemory(SIGNALS._0000000000000000),
        iMemory: [],
        dMemory: [],
    }]

    let address = SIGNALS._0000000000000000
    for (let i = 0; i < MEMORY_RANGE; i++) {
        stateHistory[0].iMemory.push(iMemory(address))
        stateHistory[0].dMemory.push(dMemory(address))
        address = inc16(address)
    }

    return (message?: string) => {
        if (message === 'getStateHistory') {
            return stateHistory
        } else if (isEquals(isHalt, SIGNALS._1)) {
            return false
        } else {
            let {
                memoryOut,
                memoryAddress,
                isWriteMemory,
                pcRegister,
                isHalt: _isHalt,
                _aRegister,
                _dRegister,
                _pcRegister,
            } = CPU({ instruction, memoryIn, isReset: SIGNALS._0 })

            memoryIn = dMemory(memoryAddress, memoryOut, isWriteMemory)
            instruction = iMemory(pcRegister)
            isHalt = _isHalt

            const currentIMemory = []
            const currentDMemory = []
            let address = SIGNALS._0000000000000000
            for (let i = 0; i < MEMORY_RANGE; i++) {
                currentIMemory.push(iMemory(address))
                currentDMemory.push(dMemory(address))
                address = inc16(address)
            }

            stateHistory.push({
                aRegister: _aRegister(),
                dRegister: _dRegister(),
                pcRegister: _pcRegister(),
                instruction: iMemory(_pcRegister()),
                iMemory: currentIMemory,
                dMemory: currentDMemory,
            })

            return true
        }
    }
}

export const debugComputer = (states: ComputerState[]) => {
    let stateIndex = 0
    const maxStateIndex = states.length

    function render() {
        const state = states[stateIndex]
        console.clear()
        console.log('Left: go to previous state')
        console.log('Right: go to next state')
        console.log('CTRL+C: quit\n')
        console.log(`   State: ${stateIndex} ${stateIndex === maxStateIndex - 1 ? '(HALT)' : ''}`)
        console.log(`   CPU A register:      ${toString(state.aRegister)}`)
        console.log(`   CPU D register:      ${toString(state.dRegister)}`)
        console.log(`   CPU program counter: ${toString(state.pcRegister)} [${toNumber(state.pcRegister)}]`)
        console.log(`   Current instruction: ${toString(state.instruction)}\n`)

        console.log('   ---------------------\t---------------------')
        console.log('   Instruction memory   \tData memory          ')
        console.log('   ---------------------\t---------------------')
        for (let i = 0 ; i < MEMORY_RANGE; i++) {
            const _i = String(i).padStart(2, '0')
            if (i === toNumber(state.pcRegister)) {
                console.log(`-> [${_i}] ${toString(state.iMemory[i])}\t[${_i}]${toString(state.dMemory[i])}`)
            } else {
                console.log(`   [${_i}] ${toString(state.iMemory[i])}\t[${_i}]${toString(state.dMemory[i])}`)
            }
        }

    }

    render()

    const readline = require('readline')
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);
    process.stdin.on('keypress', (str, key) => {
          if (key.ctrl && key.name === 'c') {
            console.clear();
                process.exit();
          } else if (key.name === 'left' && stateIndex !== 0) {
              stateIndex = stateIndex - 1;
            render();
        } else if (key.name === 'right' && stateIndex !== (maxStateIndex - 1)) {
            stateIndex = stateIndex + 1;
            render();
        }
    });
}
