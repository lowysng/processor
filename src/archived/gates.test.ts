import { SIGNALS, isEquals, makeSignal, EightBitSignal, SixteenBitSignal } from './signals'
import { 
    nand, not, not16, and, and16, or, or16, or8way, xor,
    multiplexor, multiplexor16, multiplexor4way16,
    demultiplexor, demultiplexor4way,
} from './gates'

describe('nand', () => {
    test('nand(0,0) should return 1', () => {
        expect(isEquals(nand(SIGNALS._0, SIGNALS._0), SIGNALS._1)).toBeTruthy()
    })
    test('nand(0,1) should return 1', () => {
        expect(isEquals(nand(SIGNALS._0, SIGNALS._1), SIGNALS._1)).toBeTruthy()
    })
    test('nand(1,0) should return 1', () => {
        expect(isEquals(nand(SIGNALS._1, SIGNALS._0), SIGNALS._1)).toBeTruthy()
    })
    test('nand(1,1) should return 0', () => {
        expect(isEquals(nand(SIGNALS._1, SIGNALS._1), SIGNALS._0)).toBeTruthy()
    })
})

describe('not', () => {
    test('not(0) should return 1', () => {
        expect(isEquals(not(SIGNALS._0), SIGNALS._1)).toBeTruthy()
    })
    test('not(1) should return 0', () => {
        expect(isEquals(not(SIGNALS._1), SIGNALS._0)).toBeTruthy()
    })

    const input = makeSignal('1100 0101 1010 1001') as SixteenBitSignal
    const output = makeSignal('0011 1010 0101 0110') as SixteenBitSignal
    test('not16(1100 0101 1010 1001) should return 0011 1010 0101 0110', () => {
        expect(isEquals(not16(input), output)).toBeTruthy()
    })
})

describe('and', () => {
    test('and(0,0) should return 0', () => {
        expect(isEquals(and(SIGNALS._0, SIGNALS._0), SIGNALS._0)).toBeTruthy()
    })
    test('and(0,1) should return 0', () => {
        expect(isEquals(and(SIGNALS._0, SIGNALS._1), SIGNALS._0)).toBeTruthy()
    })
    test('and(1,0) should return 0', () => {
        expect(isEquals(and(SIGNALS._1, SIGNALS._0), SIGNALS._0)).toBeTruthy()
    })
    test('and(1,1) should return 1', () => {
        expect(isEquals(and(SIGNALS._1, SIGNALS._1), SIGNALS._1)).toBeTruthy()
    })

    const input1 = makeSignal('1100 0101 1010 1001') as SixteenBitSignal
    const input2 = makeSignal('1001 0010 0011 1111') as SixteenBitSignal
    const output = makeSignal('1000 0000 0010 1001') as SixteenBitSignal
    test('and16(1100 0101 1010 1001, 1001 0010 0011 1111) should return 1000 0000 0010 1001', () => {
        expect(isEquals(and16(input1, input2), output)).toBeTruthy()
    })
})

describe('or', () => {
    test('or(0,0) should return 0', () => {
        expect(isEquals(or(SIGNALS._0, SIGNALS._0), SIGNALS._0)).toBeTruthy()
    })
    test('or(0,1) should return 1', () => {
        expect(isEquals(or(SIGNALS._0, SIGNALS._1), SIGNALS._1)).toBeTruthy()
    })
    test('or(1,0) should return 1', () => {
        expect(isEquals(or(SIGNALS._1, SIGNALS._0), SIGNALS._1)).toBeTruthy()
    })
    test('or(1,1) should return 1', () => {
        expect(isEquals(or(SIGNALS._1, SIGNALS._1), SIGNALS._1)).toBeTruthy()
    })

    test('or8way(0000 0000) should return 0', () => {
        expect(isEquals(or8way(SIGNALS._00000000), SIGNALS._0)).toBeTruthy()
    })

    test('or8way(0000 0100) should return 1', () => {
        expect(isEquals(or8way(makeSignal('0000 0100') as EightBitSignal), SIGNALS._1)).toBeTruthy()
    })

    const input1 = makeSignal('1100 0101 1010 1001') as SixteenBitSignal
    const input2 = makeSignal('1001 0010 0011 1111') as SixteenBitSignal
    const output = makeSignal('1101 0111 1011 1111') as SixteenBitSignal
    test('or16(1100 0101 1010 1001, 1001 0010 0011 1111) should return 1101 0111 1011 1111', () => {
        expect(isEquals(or16(input1, input2), output)).toBeTruthy()
    })
})

describe('xor', () => {
    test('xor(0,0) should return 0', () => {
        expect(isEquals(xor(SIGNALS._0, SIGNALS._0), SIGNALS._0)).toBeTruthy()
    })
    test('xor(0,1) should return 1', () => {
        expect(isEquals(xor(SIGNALS._0, SIGNALS._1), SIGNALS._1)).toBeTruthy()
    })
    test('xor(1,0) should return 1', () => {
        expect(isEquals(xor(SIGNALS._1, SIGNALS._0), SIGNALS._1)).toBeTruthy()
    })
    test('xor(1,1) should return 0', () => {
        expect(isEquals(xor(SIGNALS._1, SIGNALS._1), SIGNALS._0)).toBeTruthy()
    })
})

describe('multiplexor', () => {
    test('multiplexor(0,0,0) should return 0', () => {
        expect(isEquals(multiplexor(SIGNALS._0, SIGNALS._0, SIGNALS._0), SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(0,0,1) should return 0', () => {
        expect(isEquals(multiplexor(SIGNALS._0, SIGNALS._0, SIGNALS._1), SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(0,1,0) should return 0', () => {
        expect(isEquals(multiplexor(SIGNALS._0, SIGNALS._1, SIGNALS._0), SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(0,1,1) should return 0', () => {
        expect(isEquals(multiplexor(SIGNALS._0, SIGNALS._1, SIGNALS._1), SIGNALS._1)).toBeTruthy()
    })
    test('multiplexor(1,0,0) should return 0', () => {
        expect(isEquals(multiplexor(SIGNALS._1, SIGNALS._0, SIGNALS._0), SIGNALS._1)).toBeTruthy()
    })
    test('multiplexor(1,0,1) should return 0', () => {
        expect(isEquals(multiplexor(SIGNALS._1, SIGNALS._0, SIGNALS._1), SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(1,1,0) should return 1', () => {
        expect(isEquals(multiplexor(SIGNALS._1, SIGNALS._1, SIGNALS._0), SIGNALS._1)).toBeTruthy()
    })
    test('multiplexor(1,1,1) should return 1', () => {
        expect(isEquals(multiplexor(SIGNALS._1, SIGNALS._1, SIGNALS._1), SIGNALS._1)).toBeTruthy()
    })

    const a = SIGNALS._0000000000000000
    const b = SIGNALS._1111111111111111
    const c = makeSignal('0000 0000 1111 1111') as SixteenBitSignal
    const d = makeSignal('1111 1111 0000 0000') as SixteenBitSignal

    test('multiplexor16(a,b,0) should return a', () => {
        expect(isEquals(multiplexor16(a, b, SIGNALS._0), a)).toBeTruthy()
    })
    test('multiplexor16(a,b,1) should return b', () => {
        expect(isEquals(multiplexor16(a, b, SIGNALS._1), b)).toBeTruthy()
    })

    test('multiplexor4way16(a,b,c,d,00) should return a', () => {
        expect(isEquals(multiplexor4way16(a, b, c, d, SIGNALS._00), a)).toBeTruthy()
    })
    test('multiplexor4way16(a,b,c,d,01) should return b', () => {
    expect(isEquals(multiplexor4way16(a, b, c, d, SIGNALS._01), b)).toBeTruthy()
    })
    test('multiplexor4way16(a,b,c,d,10) should return c', () => {
        expect(isEquals(multiplexor4way16(a, b, c, d, SIGNALS._10), c)).toBeTruthy()
    })
    test('multiplexor4way16(a,b,c,d,11) should return d', () => {
        expect(isEquals(multiplexor4way16(a, b, c, d, SIGNALS._11), d)).toBeTruthy()
    })
})

describe('demultiplexor', () => {
    test('demultiplexor(0,0) should return 00', () => {
        expect(isEquals(demultiplexor(SIGNALS._0, SIGNALS._0), SIGNALS._00)).toBeTruthy()
    })
    test('demultiplexor(0,1) should return 00', () => {
        expect(isEquals(demultiplexor(SIGNALS._0, SIGNALS._1), SIGNALS._00)).toBeTruthy()
    })
    test('demultiplexor(1,0) should return 10', () => {
        expect(isEquals(demultiplexor(SIGNALS._1, SIGNALS._0), SIGNALS._10)).toBeTruthy()
    })
    test('demultiplexor(1,1) should return 01', () => {
        expect(isEquals(demultiplexor(SIGNALS._1, SIGNALS._1), SIGNALS._01)).toBeTruthy()
    })

    test('demultiplexor4way(0, 00) should return 0000', () => {
        expect(isEquals(demultiplexor4way(SIGNALS._0, SIGNALS._00), SIGNALS._0000)).toBeTruthy()
    })
    test('demultiplexor4way(1, 00) should return 1000', () => {
        expect(isEquals(demultiplexor4way(SIGNALS._1, SIGNALS._00), SIGNALS._1000)).toBeTruthy()
    })
    test('demultiplexor4way(1, 01) should return 0100', () => {
        expect(isEquals(demultiplexor4way(SIGNALS._1, SIGNALS._01), SIGNALS._0100)).toBeTruthy()
    })
    test('demultiplexor4way(1, 10) should return 0010', () => {
        expect(isEquals(demultiplexor4way(SIGNALS._1, SIGNALS._10), SIGNALS._0010)).toBeTruthy()
    })
    test('demultiplexor4way(1, 11) should return 0001', () => {
        expect(isEquals(demultiplexor4way(SIGNALS._1, SIGNALS._11), SIGNALS._0001)).toBeTruthy()
    })
})
