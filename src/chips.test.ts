import {
    isEquals,
    makeSignal,
    SIGNALS,
    SixteenBitSignal
} from './signals'
import {
    fullAdder,
    add16,
    inc16,
    makeRegister,
    makeRAM64K,
    makeProgramCounter,
} from './chips'

describe('full adder', () => {
    test('fullAdder(0,0,0) should return 00', () => {
        expect(isEquals(fullAdder(SIGNALS._0, SIGNALS._0, SIGNALS._0), SIGNALS._00)).toBeTruthy()
    })
    test('fullAdder(0,0,1) should return 01', () => {
        expect(isEquals(fullAdder(SIGNALS._0, SIGNALS._0, SIGNALS._1), SIGNALS._01)).toBeTruthy()
    })
    test('fullAdder(0,1,0) should return 01', () => {
        expect(isEquals(fullAdder(SIGNALS._0, SIGNALS._1, SIGNALS._0), SIGNALS._01)).toBeTruthy()
    })
    test('fullAdder(0,1,1) should return 10', () => {
        expect(isEquals(fullAdder(SIGNALS._0, SIGNALS._1, SIGNALS._1), SIGNALS._10)).toBeTruthy()
    })
    test('fullAdder(1,0,0) should return 01', () => {
        expect(isEquals(fullAdder(SIGNALS._1, SIGNALS._0, SIGNALS._0), SIGNALS._01)).toBeTruthy()
    })
    test('fullAdder(1,0,1) should return 10', () => {
        expect(isEquals(fullAdder(SIGNALS._1, SIGNALS._0, SIGNALS._1), SIGNALS._10)).toBeTruthy()
    })
    test('fullAdder(1,1,0) should return 10', () => {
        expect(isEquals(fullAdder(SIGNALS._1, SIGNALS._1, SIGNALS._0), SIGNALS._10)).toBeTruthy()
    })
    test('fullAdder(1,1,1) should return 11', () => {
        expect(isEquals(fullAdder(SIGNALS._1, SIGNALS._1, SIGNALS._1), SIGNALS._11)).toBeTruthy()
    })
})

describe('add16', () => {
    test('add16(0000 0000 0000 0000, 0000 0000 0000 0001) should return 0000 0000 0000 0001', () => {
        expect(isEquals(add16(
            makeSignal('0000 0000 0000 0000') as SixteenBitSignal,
            makeSignal('0000 0000 0000 0001') as SixteenBitSignal,
        ), makeSignal('0000 0000 0000 0001'))).toBeTruthy()
    })
    test('add16(0000 0000 1111 0000, 0000 0000 0000 0101) should return 0000 0000 1111 0101', () => {
        expect(isEquals(add16(
            makeSignal('0000 0000 1111 0000') as SixteenBitSignal,
            makeSignal('0000 0000 0000 0101') as SixteenBitSignal,
        ), makeSignal('0000 0000 1111 0101'))).toBeTruthy()
    })
    test('add16(1101 1100 0101 1010, 0000 0000 0000 1101) should return 1101 1100 0110 0111', () => {
        expect(isEquals(add16(
            makeSignal('1101 1100 0101 1010') as SixteenBitSignal,
            makeSignal('0000 0000 0000 1101') as SixteenBitSignal,
        ), makeSignal('1101 1100 0110 0111'))).toBeTruthy()
    })
    test('add16(1111 1111 1111 1110, 0000 0000 0000 0001) should return 1111 1111 1111 1111', () => {
        expect(isEquals(add16(
            makeSignal('1111 1111 1111 1110') as SixteenBitSignal,
            makeSignal('0000 0000 0000 0001') as SixteenBitSignal,
        ), makeSignal('1111 1111 1111 1111'))).toBeTruthy()
    })
})

describe('inc16', () => {
    test('inc16(0000 0000 0000 0000 should return 0000 0000 0000 0001', () => {
        expect(isEquals(
            inc16(SIGNALS._0000000000000000),
            makeSignal('0000 0000 0000 0001'),
        )).toBeTruthy()
    })
    test('inc16(0000 0000 1111 1111 should return 0000 0001 0000 0000', () => {
        expect(isEquals(
            inc16(makeSignal('0000 0000 1111 1111') as SixteenBitSignal),
            makeSignal('0000 0001 0000 0000'),
        )).toBeTruthy()
    })
    test('inc16(1111 1111 1111 1111 should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            inc16(makeSignal('1111 1111 1111 1111') as SixteenBitSignal),
            makeSignal('0000 0000 0000 0000'),
        )).toBeTruthy()
    })
})

describe('register', () => {
    const register = makeRegister()
    test('register() should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            register(),
            SIGNALS._0000000000000000,
        )).toBeTruthy()
    })
    test('...register(1111 1111 1111 1111, 0) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            register(SIGNALS._1111111111111111, SIGNALS._0),
            SIGNALS._0000000000000000,
        )).toBeTruthy()
    })
    test('...register(1111 1111 1111 1111, 1) should return 1111 1111 1111 1111', () => {
        expect(isEquals(
            register(SIGNALS._1111111111111111, SIGNALS._1),
            SIGNALS._1111111111111111,
        )).toBeTruthy()
    })
    test('...register(0000 0000 0000 0000, 0) should return 1111 1111 1111 1111', () => {
        expect(isEquals(
            register(SIGNALS._0000000000000000, SIGNALS._0),
            SIGNALS._1111111111111111,
        )).toBeTruthy()
    })
    test('...register() should return 1111 1111 1111 1111', () => {
        expect(isEquals(
            register(),
            SIGNALS._1111111111111111,
        )).toBeTruthy()
    })
    test('...register(0000 0000 0000 0000, 1) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            register(SIGNALS._0000000000000000, SIGNALS._1),
            SIGNALS._0000000000000000,
        )).toBeTruthy()
    })
    test('...register() should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            register(),
            SIGNALS._0000000000000000,
        )).toBeTruthy()
    })
})

describe ('makeRAM64K', () => {
    const RAM = makeRAM64K()
    test('RAM(0000 0000 0000 0000) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0001) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000001),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0010) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000010),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0000, 1111 1111 1111 1111, 0) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000, SIGNALS._1111111111111111, SIGNALS._0),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0000, 1111 1111 1111 1111, 1) should return 1111 1111 1111 1111', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000, SIGNALS._1111111111111111, SIGNALS._1),
            SIGNALS._1111111111111111
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0000) should return 1111 1111 1111 1111', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000),
            SIGNALS._1111111111111111
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0001) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000001),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0010) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000010),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0000, 0000 0000 0000 0000, 0) should return 1111 1111 1111 1111', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000, SIGNALS._0000000000000000, SIGNALS._0),
            SIGNALS._1111111111111111
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0001, 0000 0000 0000 0010, 1) should return 0000 0000 0000 0010', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000001, SIGNALS._0000000000000010, SIGNALS._1),
            SIGNALS._0000000000000010
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0000) should return 1111 1111 1111 1111', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000),
            SIGNALS._1111111111111111
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0001) should return 0000 0000 0000 0010', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000001),
            SIGNALS._0000000000000010
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0010) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000010),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0000, 0000 0000 0000 0000, 0) should return 1111 1111 1111 1111', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000, SIGNALS._0000000000000000, SIGNALS._0),
            SIGNALS._1111111111111111
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0000, 0000 0000 0000 0000, 1) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000, SIGNALS._0000000000000000, SIGNALS._1),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0000) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000000),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0001) should return 0000 0000 0000 0010', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000001),
            SIGNALS._0000000000000010
        )).toBeTruthy()
    })
    test('...RAM(0000 0000 0000 0010) should return 0000 0000 0000 0000', () => {
        expect(isEquals(
            RAM(SIGNALS._0000000000000010),
            SIGNALS._0000000000000000
        )).toBeTruthy()
    })
})

describe('program counter', () => {
    const pc = makeProgramCounter()
    test('pc() should return 0000 0000 0000 0000', () => {
        expect(isEquals(pc(), SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 0, 0, 0) should return 0000 0000 0000 0000', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._0,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 1, 0, 0) should return 0000 0000 0000 0001', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._1,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._0000000000000001)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 0, 0, 0) should return 0000 0000 0000 0001', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._0,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._0000000000000001)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 1, 0, 0) should return 0000 0000 0000 0010', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._1,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._0000000000000010)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 0, 0, 0) should return 0000 0000 0000 0010', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._0,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._0000000000000010)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 1, 1, 0) should return 1111 1111 1111 1111', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._1,
            SIGNALS._1,
            SIGNALS._0,
        ), SIGNALS._1111111111111111)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 0, 0, 0) should return 1111 1111 1111 1111', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._0,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._1111111111111111)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 1, 0, 0) should return 0000 0000 0000 0000', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._1,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 1, 0, 0) should return 0000 0000 0000 0001', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._1,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._0000000000000001)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1111, 1, 1, 1) should return 0000 0000 0000 0000', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111111,
            SIGNALS._1,
            SIGNALS._1,
            SIGNALS._1,
        ), SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1110, 0, 1, 0) should return 1111 1111 1111 1110', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111110,
            SIGNALS._0,
            SIGNALS._1,
            SIGNALS._0,
        ), SIGNALS._1111111111111110)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1110, 1, 0, 0) should return 1111 1111 1111 1111', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111110,
            SIGNALS._1,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._1111111111111111)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1110, 0, 0, 0) should return 1111 1111 1111 1111', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111110,
            SIGNALS._0,
            SIGNALS._0,
            SIGNALS._0,
        ), SIGNALS._1111111111111111)).toBeTruthy()
    })
    test('...pc(1111 1111 1111 1110, 1, 1, 1) should return 0000 0000 0000 0000', () => {
        expect(isEquals(pc(
            SIGNALS._1111111111111110,
            SIGNALS._1,
            SIGNALS._1,
            SIGNALS._1,
        ), SIGNALS._0000000000000000)).toBeTruthy()
    })
})
