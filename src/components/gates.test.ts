import { SIGNALS, EightBitSignal, SixteenBitSignal } from '../signals'
import { 
    nand,
    not,
    not16,
    and,
    and16,
    or,
    or16,
    or8way,
    xor,
    multiplexor,
    multiplexor4way,
    demultiplexor,
    demultiplexor4way,
} from './gates'

describe('nand', () => {
    test('nand(0,0) should return 1', () => {
        expect(nand(SIGNALS._0, SIGNALS._0).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('nand(0,1) should return 1', () => {
        expect(nand(SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('nand(1,0) should return 1', () => {
        expect(nand(SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('nand(1,1) should return 0', () => {
        expect(nand(SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._0)).toBeTruthy()
    })
})

describe('not', () => {
    test('not(0) should return 1', () => {
        expect(not(SIGNALS._0).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('not(1) should return 0', () => {
        expect(not(SIGNALS._1).isEquals(SIGNALS._0)).toBeTruthy()
    })

    const input = new SixteenBitSignal('1100 0101 1010 1001')
    const output = new SixteenBitSignal('0011 1010 0101 0110')
    test('not16(1100 0101 1010 1001) should return 0011 1010 0101 0110', () => {
        expect(not16(input).isEquals(output)).toBeTruthy()
    })
})

describe('and', () => {
    test('and(0,0) should return 0', () => {
        expect(and(SIGNALS._0, SIGNALS._0).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('and(0,1) should return 0', () => {
        expect(and(SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('and(1,0) should return 0', () => {
        expect(and(SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('and(1,1) should return 1', () => {
        expect(and(SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._1)).toBeTruthy()
    })

    const input1 = new SixteenBitSignal('1100 0101 1010 1001')
    const input2 = new SixteenBitSignal('1001 0010 0011 1111')
    const output = new SixteenBitSignal('1000 0000 0010 1001')
    test('and16(1100 0101 1010 1001, 1001 0010 0011 1111) should return 1000 0000 0010 1001', () => {
        expect(and16(input1, input2).isEquals(output)).toBeTruthy()
    })
})

describe('or', () => {
    test('or(0,0) should return 0', () => {
        expect(or(SIGNALS._0, SIGNALS._0).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('or(0,1) should return 1', () => {
        expect(or(SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('or(1,0) should return 1', () => {
        expect(or(SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('or(1,1) should return 1', () => {
        expect(or(SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._1)).toBeTruthy()
    })

    test('or8way(0000 0000) should return 0', () => {
        expect(or8way(SIGNALS._00000000).isEquals(SIGNALS._0)).toBeTruthy()
    })

    test('or8way(0000 0100) should return 1', () => {
        expect(or8way(new EightBitSignal('0000 0100')).isEquals(SIGNALS._1)).toBeTruthy()
    })

    const input1 = new SixteenBitSignal('1100 0101 1010 1001')
    const input2 = new SixteenBitSignal('1001 0010 0011 1111')
    const output = new SixteenBitSignal('1101 0111 1011 1111')
    test('or16(1100 0101 1010 1001, 1001 0010 0011 1111) should return 1101 0111 1011 1111', () => {
        expect(or16(input1, input2).isEquals(output)).toBeTruthy()
    })
})

describe('xor', () => {
    test('xor(0,0) should return 0', () => {
        expect(xor(SIGNALS._0, SIGNALS._0).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('xor(0,1) should return 1', () => {
        expect(xor(SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('xor(1,0) should return 1', () => {
        expect(xor(SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('xor(1,1) should return 0', () => {
        expect(xor(SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._0)).toBeTruthy()
    })
})

describe('multiplexor', () => {
    test('multiplexor(0,0,0) should return 0', () => {
        expect(multiplexor(SIGNALS._0, SIGNALS._0, SIGNALS._0).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(0,0,1) should return 0', () => {
        expect(multiplexor(SIGNALS._0, SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(0,1,0) should return 0', () => {
        expect(multiplexor(SIGNALS._0, SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(0,1,1) should return 1', () => {
        expect(multiplexor(SIGNALS._0, SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('multiplexor(1,0,0) should return 0', () => {
        expect(multiplexor(SIGNALS._1, SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(1,0,1) should return 0', () => {
        expect(multiplexor(SIGNALS._1, SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._0)).toBeTruthy()
    })
    test('multiplexor(1,1,0) should return 1', () => {
        expect(multiplexor(SIGNALS._1, SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._1)).toBeTruthy()
    })
    test('multiplexor(1,1,1) should return 1', () => {
        expect(multiplexor(SIGNALS._1, SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._1)).toBeTruthy()
    })

    const a = SIGNALS._0000000000000000
    const b = SIGNALS._1111111111111111
    const c = new SixteenBitSignal('0000 0000 1111 1111')
    const d = new SixteenBitSignal('1111 1111 0000 0000')

    test('multiplexor16(a,b,0) should return a', () => {
        expect(multiplexor(a, b, SIGNALS._0).isEquals(a)).toBeTruthy()
    })
    test('multiplexor16(a,b,1) should return b', () => {
        expect(multiplexor(a, b, SIGNALS._1).isEquals(b)).toBeTruthy()
    })

    test('multiplexor4way16(a,b,c,d,00) should return a', () => {
        expect(multiplexor4way(a, b, c, d, SIGNALS._00).isEquals(a)).toBeTruthy()
    })
    test('multiplexor4way16(a,b,c,d,01) should return b', () => {
        expect(multiplexor4way(a, b, c, d, SIGNALS._01).isEquals(b)).toBeTruthy()
    })
    test('multiplexor4way16(a,b,c,d,10) should return c', () => {
        expect(multiplexor4way(a, b, c, d, SIGNALS._10).isEquals(c)).toBeTruthy()
    })
    test('multiplexor4way16(a,b,c,d,11) should return d', () => {
        expect(multiplexor4way(a, b, c, d, SIGNALS._11).isEquals(d)).toBeTruthy()
    })
})

describe('demultiplexor', () => {
    test('demultiplexor(0,0) should return 00', () => {
        expect(demultiplexor(SIGNALS._0, SIGNALS._0).isEquals(SIGNALS._00)).toBeTruthy()
    })
    test('demultiplexor(0,1) should return 00', () => {
        expect(demultiplexor(SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._00)).toBeTruthy()
    })
    test('demultiplexor(1,0) should return 10', () => {
        expect(demultiplexor(SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._10)).toBeTruthy()
    })
    test('demultiplexor(1,1) should return 01', () => {
        expect(demultiplexor(SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._01)).toBeTruthy()
    })

    test('demultiplexor4way(0, 00) should return 0000', () => {
        expect(demultiplexor4way(SIGNALS._0, SIGNALS._00).isEquals(SIGNALS._0000)).toBeTruthy()
    })
    test('demultiplexor4way(1, 00) should return 1000', () => {
        expect(demultiplexor4way(SIGNALS._1, SIGNALS._00).isEquals(SIGNALS._1000)).toBeTruthy()
    })
    test('demultiplexor4way(1, 01) should return 0100', () => {
        expect(demultiplexor4way(SIGNALS._1, SIGNALS._01).isEquals(SIGNALS._0100)).toBeTruthy()
    })
    test('demultiplexor4way(1, 10) should return 0010', () => {
        expect(demultiplexor4way(SIGNALS._1, SIGNALS._10).isEquals(SIGNALS._0010)).toBeTruthy()
    })
    test('demultiplexor4way(1, 11) should return 0001', () => {
        expect(demultiplexor4way(SIGNALS._1, SIGNALS._11).isEquals(SIGNALS._0001)).toBeTruthy()
    })
})
