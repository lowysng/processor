import { inc16, makeCPU, makeRAM64K } from './chips'
import {
    SIGNALS,
    SixteenBitSignal,
    makeSignal,
    toString,
    isEquals,
} from './signals'

const makeComputer = () => {
    const CPU = makeCPU()
    const iMemory = makeRAM64K()
    const dMemory = makeRAM64K()

    const instructions = [
        makeSignal('0000 0000 0000 0001') as SixteenBitSignal,
        makeSignal('1000 1100 0000 1000') as SixteenBitSignal,
        makeSignal('0000 0000 0000 0011') as SixteenBitSignal,
        makeSignal('1000 1100 0001 0000') as SixteenBitSignal,
        makeSignal('0000 0000 0000 0010') as SixteenBitSignal,
        makeSignal('1000 0011 0000 1000') as SixteenBitSignal,
        makeSignal('0000 0000 0000 0001') as SixteenBitSignal,
        makeSignal('1001 1100 0001 0000') as SixteenBitSignal,
        makeSignal('0000 0000 0000 0010') as SixteenBitSignal,
        makeSignal('1001 0100 1101 0000') as SixteenBitSignal,
        makeSignal('0000 0000 0001 0100') as SixteenBitSignal,
        makeSignal('1000 0011 0001 0001') as SixteenBitSignal,
        makeSignal('0000 0000 0000 0001') as SixteenBitSignal,
        makeSignal('1001 1100 0001 0000') as SixteenBitSignal,
        makeSignal('0000 0000 0000 0000') as SixteenBitSignal,
        makeSignal('1001 0000 1000 1000') as SixteenBitSignal,
        makeSignal('0000 0000 0000 0001') as SixteenBitSignal,
        makeSignal('1001 1101 1100 1000') as SixteenBitSignal,
        makeSignal('0000 0000 0000 0110') as SixteenBitSignal,
        makeSignal('1000 1010 1000 0111') as SixteenBitSignal,
        makeSignal('1000 1000 0000 0000') as SixteenBitSignal,
    ]

    let iMemoryAddress = SIGNALS._0000000000000000
    instructions.forEach((instruction) => {
        iMemory(iMemoryAddress, instruction, SIGNALS._1)
        iMemoryAddress = inc16(iMemoryAddress)
    })

    let instruction = iMemory(SIGNALS._0000000000000000)
    let memoryIn = dMemory(SIGNALS._0000000000000000)
    let isHalt = SIGNALS._0

    function print(memory) {
        let address = SIGNALS._0000000000000000
        for (let i = 0; i < 32; i++) {
            console.log(`address ${toString(address)} : ${toString(memory(address))}`)
            address = inc16(address)
        }
    }

    console.log('iMemory')
    print(iMemory)

    return () => {
        if (isEquals(isHalt, SIGNALS._1)) {
            console.log('HALT')
            return false
        } else {
            console.log(`STEP -> ${toString(instruction)}`)
            let {
                memoryOut,
                memoryAddress,
                isWriteMemory,
                pcRegister,
                isHalt: isHalt_,
            } = CPU({ instruction, memoryIn, isReset: SIGNALS._0 })

            memoryIn = dMemory(memoryAddress, memoryOut, isWriteMemory)
            instruction = iMemory(pcRegister)
            isHalt = isHalt_

            console.log('dMemory')
            print(dMemory)

            return true
        }
    }

}

const computer = makeComputer()

while (computer()) {

}
