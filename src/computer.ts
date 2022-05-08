import { inc16, makeCPU, makeRAM64K } from './chips'
import { SIGNALS, isEquals, SixteenBitSignal, toString, toNumber, makeSignal } from './signals'

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

    const instructions = [
        makeSignal('0000 0000 0000 0001') as SixteenBitSignal,  // @1
        makeSignal('1000 1100 0000 1000') as SixteenBitSignal,  // M=A
        makeSignal('0000 0000 0000 0011') as SixteenBitSignal,  // @3
        makeSignal('1000 1100 0001 0000') as SixteenBitSignal,  // D=A
        makeSignal('0000 0000 0000 0010') as SixteenBitSignal,  // @2
        makeSignal('1000 0011 0000 1000') as SixteenBitSignal,  // M=D
        makeSignal('0000 0000 0000 0001') as SixteenBitSignal,  // @1
        makeSignal('1001 1100 0001 0000') as SixteenBitSignal,  // D=M
        makeSignal('0000 0000 0000 0010') as SixteenBitSignal,  // @2
        makeSignal('1001 0100 1101 0000') as SixteenBitSignal,  // D=D-M
        makeSignal('0000 0000 0001 0100') as SixteenBitSignal,  // @20
        makeSignal('1000 0011 0001 0001') as SixteenBitSignal,  // D;JGT
        makeSignal('0000 0000 0000 0001') as SixteenBitSignal,  // @1
        makeSignal('1001 1100 0001 0000') as SixteenBitSignal,  // D=M
        makeSignal('0000 0000 0000 0000') as SixteenBitSignal,  // @0
        makeSignal('1001 0000 1000 1000') as SixteenBitSignal,  // M=D+M
        makeSignal('0000 0000 0000 0001') as SixteenBitSignal,  // @1
        makeSignal('1001 1101 1100 1000') as SixteenBitSignal,  // M=M+1
        makeSignal('0000 0000 0000 0110') as SixteenBitSignal,  // @6
        makeSignal('1000 1010 1000 0111') as SixteenBitSignal,  // 0;JMP
        makeSignal('1000 1000 0000 0000') as SixteenBitSignal,  // HALT
    ]

    // load instruction into instruction memory
    let iMemoryAddress = SIGNALS._0000000000000000
    instructions.forEach((instruction) => {
        iMemory(iMemoryAddress, instruction, SIGNALS._1)
        iMemoryAddress = inc16(iMemoryAddress)
    })

    // store initial state for debugging
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

    // initialise values
    let instruction = iMemory(SIGNALS._0000000000000000)
    let memoryIn = dMemory(SIGNALS._0000000000000000)
    let isHalt = SIGNALS._0

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

            // store current state for debugging
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
