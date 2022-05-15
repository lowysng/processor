import {
    Bit,
    OneBitTuple,
    TwoBitTuple,
    ThreeBitTuple,
    FourBitTuple,
    SixBitTuple,
    EightBitTuple,
    SixteenBitTuple,
} from "./Bit"

export class Signal {
    private bits: Bit[]

    constructor(bits: Bit[] | string, length) {
        if (typeof bits === 'string') {
            bits = bits
                .replace(/\s+/g, '')    // remove whitespace
                .split('')
                .map(char => {
                    if (char === '0') return Bit.ZERO
                    if (char === '1') return Bit.ONE
                    throw new Error(`invalid char: ${bits}`)
                })
        }

        if (bits.length !== length) {
            throw new Error(`invalid length: ${bits.length}, ${length}`)
        }

        this.bits = bits
    }

    narrow(signal: Signal): Signal {
        switch (signal.bits.length) {
            case 1:
                return new OneBitSignal(signal.bits as OneBitTuple)
            case 2:
                return new TwoBitSignal(signal.bits as TwoBitTuple)
            case 3:
                return new ThreeBitSignal(signal.bits as ThreeBitTuple)
            case 4:
                return new FourBitSignal(signal.bits as FourBitTuple)
            case 6:
                return new SixBitSignal(signal.bits as SixBitTuple)
            case 8:
                return new EightBitSignal(signal.bits as EightBitTuple)
            case 16:
                return new SixteenBitSignal(signal.bits as SixteenBitTuple)
        }
    }

    isEquals(otherSignal: Signal): boolean {
        if (this.bits.length !== otherSignal.bits.length) {
            return false
        }
        return this.bits.every((bit, index) => bit === otherSignal.bits[index])
    }

    atIndex(index: number): Bit {
        return this.bits[index]
    }

    slice(start: number, end?: number): Signal {
        const sliced = this.bits.slice(start, end)
        return this.narrow(new Signal(sliced, sliced.length))
    }

    concatenate(...signals: Signal[]): Signal {
        let bits: Bit[] = [...this.bits]
        signals.forEach(signal => {
            bits = bits.concat(signal.bits)
        })
        return this.narrow(new Signal(bits, bits.length))
    }

    some(predicate: (s: OneBitSignal) => boolean): boolean {
        if (this.bits.some(bit => {
            const oneBitSignal = new OneBitSignal([bit])
            return predicate(oneBitSignal)
        })) {
            return true
        } else {
            return false
        }
    }

    every(predicate: (s: OneBitSignal) => boolean): boolean {
        if (this.bits.every(bit => {
            const oneBitSignal = new OneBitSignal([bit])
            return predicate(oneBitSignal)
        })) {
            return true
        } else {
            return false
        }
    }

    map(mapper: (s: OneBitSignal) => OneBitSignal): Signal {
        const mapped = this.bits.map(bit => {
            const oneBitSignal = new OneBitSignal([bit])
            return mapper(oneBitSignal).bits[0]
        })
        return this.narrow(new Signal(mapped, mapped.length))
    }

    mapAgainst(otherSignal: Signal, mapper: (s1: OneBitSignal, s2: OneBitSignal) => OneBitSignal): Signal {
        const mapped = this.bits.map((bit, index) => {
            const oneBitSignal = new OneBitSignal([bit])
            const otherOneBitSignal = new OneBitSignal([otherSignal.bits[index]])
            return mapper(oneBitSignal, otherOneBitSignal).bits[0]
        })
        return this.narrow(new Signal(mapped, mapped.length))
    }

    toString(): string {
        return this.bits.map(bit => {
            if (bit === Bit.ZERO) return '0'
            if (bit === Bit.ONE) return '1'
        }).join('')
    }

    toDecimal(): number {
        let sum = 0
        let j = 0
        for (let i = this.bits.length - 1; i >= 1; i--) {
            if (this.bits[i] === Bit.ONE) {
                sum += 2 ** j
            }
            j += 1
        }
        if (this.bits[0] === Bit.ONE) {
            sum += -1 * (2 ** j)
        }
        return sum
    }
}

export class OneBitSignal extends Signal {
    constructor(bits: OneBitTuple | string) {
        super(bits, 1)
    }
}

export class TwoBitSignal extends Signal {
    constructor(bits: TwoBitTuple | string) {
        super(bits, 2)
    }
}

export class ThreeBitSignal extends Signal {
    constructor(bits: ThreeBitTuple | string) {
        super(bits, 3)
    }
}

export class FourBitSignal extends Signal {
    constructor(bits: FourBitTuple | string) {
        super(bits, 4)
    }
}

export class SixBitSignal extends Signal {
    constructor(bits: SixBitTuple | string) {
        super(bits, 6)
    }
}

export class EightBitSignal extends Signal {
    constructor(bits: EightBitTuple | string) {
        super(bits, 8)
    }
}

export class SixteenBitSignal extends Signal {
    constructor(bits: SixteenBitTuple | string) {
        super(bits, 16)
    }
}

const _0: OneBitSignal = new OneBitSignal('0')
const _1: OneBitSignal = new OneBitSignal('1')

const _00: TwoBitSignal = new TwoBitSignal('00')
const _01: TwoBitSignal = new TwoBitSignal('01')
const _10: TwoBitSignal = new TwoBitSignal('10') 
const _11: TwoBitSignal = new TwoBitSignal('11') 

const _000: ThreeBitSignal = new ThreeBitSignal('000') 
const _001: ThreeBitSignal = new ThreeBitSignal('001') 
const _010: ThreeBitSignal = new ThreeBitSignal('010') 
const _011: ThreeBitSignal = new ThreeBitSignal('011') 
const _100: ThreeBitSignal = new ThreeBitSignal('100') 
const _101: ThreeBitSignal = new ThreeBitSignal('101') 
const _110: ThreeBitSignal = new ThreeBitSignal('110') 
const _111: ThreeBitSignal = new ThreeBitSignal('111') 

const _0000: FourBitSignal = new FourBitSignal('0000') 
const _0001: FourBitSignal = new FourBitSignal('0001') 
const _0010: FourBitSignal = new FourBitSignal('0010') 
const _0110: FourBitSignal = new FourBitSignal('0110')
const _0100: FourBitSignal = new FourBitSignal('0100') 
const _1000: FourBitSignal = new FourBitSignal('1000') 
const _1111: FourBitSignal = new FourBitSignal('1111') 

const _00000000: EightBitSignal = new EightBitSignal('0000 0000') 
const _11111111: EightBitSignal = new EightBitSignal('1111 1111') 

const _0000000000000000: SixteenBitSignal = new SixteenBitSignal('0000 0000 0000 0000') 
const _0000000000000001: SixteenBitSignal = new SixteenBitSignal('0000 0000 0000 0001') 
const _0000000000000010: SixteenBitSignal = new SixteenBitSignal('0000 0000 0000 0010') 
const _0000000011111111: SixteenBitSignal = new SixteenBitSignal('0000 0000 1111 1111') 
const _1111111100000000: SixteenBitSignal = new SixteenBitSignal('1111 1111 0000 0000') 
const _1111111111111110: SixteenBitSignal = new SixteenBitSignal('1111 1111 1111 1110') 
const _1111111111111111: SixteenBitSignal = new SixteenBitSignal('1111 1111 1111 1111') 

export const SIGNALS = {
    _0,
    _1,
    _00,
    _01,
    _10,
    _11,
    _000,
    _001,
    _010,
    _011,
    _100,
    _101,
    _110,
    _111,
    _0000,
    _0001,
    _0010,
    _0110,
    _0100,
    _1000,
    _1111,
    _00000000,
    _11111111,
    _0000000000000000,
    _0000000000000001,
    _0000000000000010,
    _0000000011111111,
    _1111111100000000,
    _1111111111111110,
    _1111111111111111,
}
