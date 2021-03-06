import {
    SIGNALS,
    OneBitSignal,
    SixteenBitSignal,
} from '../signals'
import { inc16 } from './functional-units'

export class Register {
    private latch: SixteenBitSignal = SIGNALS._0000000000000000

    probe(
        input?: SixteenBitSignal,
        isLoad?: OneBitSignal,
    ): SixteenBitSignal {
        if (input && isLoad && isLoad.isEquals(SIGNALS._1)) {
            this.latch = input
        }
        return this.latch
    }
}

export class RAM64K {
    private registers: Register[] = []

    probe(
        address: SixteenBitSignal,
        input?: SixteenBitSignal,
        isLoad?: OneBitSignal,
    ): SixteenBitSignal {
        if (this.registers[address.toDecimal()] === undefined) {
            this.registers[address.toDecimal()] = new Register()
        }
        const register = this.registers[address.toDecimal()]
        return register.probe(input, isLoad)
    }

    takeSnapshot(range: number): string[] {
        let strings: string[] = []
        let address: SixteenBitSignal = SIGNALS._0000000000000000
        for (let i = 0; i < range; i++) {
            strings.push(this.probe(address).toString())
            address = inc16(address)
        }
        return strings
    }
}

export class ProgramCounter {
    private latch: SixteenBitSignal = SIGNALS._0000000000000000

    probe(
        input?: SixteenBitSignal,
        isIncrement?: OneBitSignal,
        isLoad?: OneBitSignal,
        isReset?: OneBitSignal,
    ): SixteenBitSignal {
        if (isReset && isReset.isEquals(SIGNALS._1)) {
            this.latch = SIGNALS._0000000000000000
        } else if (isLoad && isLoad.isEquals(SIGNALS._1)) {
            this.latch = input
        } else if (isIncrement && isIncrement.isEquals(SIGNALS._1)) {
            this.latch = inc16(this.latch)
        }
        return this.latch
    }
}
