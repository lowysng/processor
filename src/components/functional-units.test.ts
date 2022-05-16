import {
    SIGNALS,
    SixBitSignal,
    SixteenBitSignal
} from '../signals'
import {
    fullAdder,
    add16,
    inc16,
    ALU,
} from './functional-units'

describe('full adder', () => {
    test('fullAdder(0,0,0) should return 00', () => {
        expect(fullAdder(SIGNALS._0, SIGNALS._0, SIGNALS._0).isEquals(SIGNALS._00)).toBeTruthy()
    })
    test('fullAdder(0,0,1) should return 01', () => {
        expect(fullAdder(SIGNALS._0, SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._01)).toBeTruthy()
    })
    test('fullAdder(0,1,0) should return 01', () => {
        expect(fullAdder(SIGNALS._0, SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._01)).toBeTruthy()
    })
    test('fullAdder(0,1,1) should return 10', () => {
        expect(fullAdder(SIGNALS._0, SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._10)).toBeTruthy()
    })
    test('fullAdder(1,0,0) should return 01', () => {
        expect(fullAdder(SIGNALS._1, SIGNALS._0, SIGNALS._0).isEquals(SIGNALS._01)).toBeTruthy()
    })
    test('fullAdder(1,0,1) should return 10', () => {
        expect(fullAdder(SIGNALS._1, SIGNALS._0, SIGNALS._1).isEquals(SIGNALS._10)).toBeTruthy()
    })
    test('fullAdder(1,1,0) should return 10', () => {
        expect(fullAdder(SIGNALS._1, SIGNALS._1, SIGNALS._0).isEquals(SIGNALS._10)).toBeTruthy()
    })
    test('fullAdder(1,1,1) should return 11', () => {
        expect(fullAdder(SIGNALS._1, SIGNALS._1, SIGNALS._1).isEquals(SIGNALS._11)).toBeTruthy()
    })
})

describe('add16', () => {
    test('add16(0000 0000 0000 0000, 0000 0000 0000 0001) should return 0000 0000 0000 0001', () => {
        expect(add16(
            SIGNALS._0000000000000000,
            SIGNALS._0000000000000001,
        ).isEquals(SIGNALS._0000000000000001)).toBeTruthy()
    })
    test('add16(0000 0000 1111 0000, 0000 0000 0000 0101) should return 0000 0000 1111 0101', () => {
        expect(add16(
            new SixteenBitSignal('0000 0000 1111 0000'),
            new SixteenBitSignal('0000 0000 0000 0101'),
        ).isEquals(new SixteenBitSignal('0000 0000 1111 0101'))).toBeTruthy()
    })
    test('add16(1101 1100 0101 1010, 0000 0000 0000 1101) should return 1101 1100 0110 0111', () => {
        expect(add16(
            new SixteenBitSignal('1101 1100 0101 1010'),
            new SixteenBitSignal('0000 0000 0000 1101'),
        ).isEquals(new SixteenBitSignal('1101 1100 0110 0111'))).toBeTruthy()
    })
    test('add16(1111 1111 1111 1110, 0000 0000 0000 0001) should return 1111 1111 1111 1111', () => {
        expect(add16(
            new SixteenBitSignal('1111 1111 1111 1110'),
            new SixteenBitSignal('0000 0000 0000 0001'),
        ).isEquals(new SixteenBitSignal('1111 1111 1111 1111'))).toBeTruthy()
    })
})

describe('inc16', () => {
    test('inc16(0000 0000 0000 0000 should return 0000 0000 0000 0001', () => {
        expect(inc16(
            SIGNALS._0000000000000000
        ).isEquals(SIGNALS._0000000000000001)).toBeTruthy()
    })
    test('inc16(0000 0000 1111 1111 should return 0000 0001 0000 0000', () => {
        expect(inc16(
            SIGNALS._0000000011111111
        ).isEquals(new SixteenBitSignal('0000 0001 0000 0000'))).toBeTruthy()
    })
    test('inc16(1111 1111 1111 1111 should return 0000 0000 0000 0000', () => {
        expect(inc16(
            SIGNALS._1111111111111111
        ).isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
})

describe('ALU', () => {
    const aRegister = SIGNALS._1111111100000000
    const dRegister = SIGNALS._0000000011111111

    const tests = [
        { name: 'ALU(a,d,101010) should return 0000 0000 0000 0000 10', input: { x: dRegister, y: aRegister, control: new SixBitSignal('101010') }, expectedOutput: { out: new SixteenBitSignal('0000 0000 0000 0000'), isZero: SIGNALS._1, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,111111) should return 0000 0000 0000 0001 00', input: { x: dRegister, y: aRegister, control: new SixBitSignal('111111') }, expectedOutput: { out: new SixteenBitSignal('0000 0000 0000 0001'), isZero: SIGNALS._0, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,111010) should return 1111 1111 1111 1111 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('111010') }, expectedOutput: { out: new SixteenBitSignal('1111 1111 1111 1111'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
        { name: 'ALU(a,d,001100) should return 0000 0000 1111 1111 00', input: { x: dRegister, y: aRegister, control: new SixBitSignal('001100') }, expectedOutput: { out: new SixteenBitSignal('0000 0000 1111 1111'), isZero: SIGNALS._0, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,110000) should return 1111 1111 0000 0000 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('110000') }, expectedOutput: { out: new SixteenBitSignal('1111 1111 0000 0000'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
        { name: 'ALU(a,d,001101) should return 1111 1111 0000 0000 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('001101') }, expectedOutput: { out: new SixteenBitSignal('1111 1111 0000 0000'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
        { name: 'ALU(a,d,110001) should return 0000 0000 1111 1111 00', input: { x: dRegister, y: aRegister, control: new SixBitSignal('110001') }, expectedOutput: { out: new SixteenBitSignal('0000 0000 1111 1111'), isZero: SIGNALS._0, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,001111) should return 1111 1111 0000 0001 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('001111') }, expectedOutput: { out: new SixteenBitSignal('1111 1111 0000 0001'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
        { name: 'ALU(a,d,110011) should return 0000 0001 0000 0000 00', input: { x: dRegister, y: aRegister, control: new SixBitSignal('110011') }, expectedOutput: { out: new SixteenBitSignal('0000 0001 0000 0000'), isZero: SIGNALS._0, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,011111) should return 0000 0001 0000 0000 00', input: { x: dRegister, y: aRegister, control: new SixBitSignal('011111') }, expectedOutput: { out: new SixteenBitSignal('0000 0001 0000 0000'), isZero: SIGNALS._0, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,110111) should return 1111 1111 0000 0001 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('110111') }, expectedOutput: { out: new SixteenBitSignal('1111 1111 0000 0001'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
        { name: 'ALU(a,d,001110) should return 0000 0000 1111 1110 00', input: { x: dRegister, y: aRegister, control: new SixBitSignal('001110') }, expectedOutput: { out: new SixteenBitSignal('0000 0000 1111 1110'), isZero: SIGNALS._0, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,110010) should return 1111 1110 1111 1111 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('110010') }, expectedOutput: { out: new SixteenBitSignal('1111 1110 1111 1111'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
        { name: 'ALU(a,d,000010) should return 1111 1111 1111 1111 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('000010') }, expectedOutput: { out: new SixteenBitSignal('1111 1111 1111 1111'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
        { name: 'ALU(a,d,010011) should return 0000 0001 1111 1111 00', input: { x: dRegister, y: aRegister, control: new SixBitSignal('010011') }, expectedOutput: { out: new SixteenBitSignal('0000 0001 1111 1111'), isZero: SIGNALS._0, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,000111) should return 1111 1110 0000 0001 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('000111') }, expectedOutput: { out: new SixteenBitSignal('1111 1110 0000 0001'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
        { name: 'ALU(a,d,000000) should return 0000 0000 0000 0000 10', input: { x: dRegister, y: aRegister, control: new SixBitSignal('000000') }, expectedOutput: { out: new SixteenBitSignal('0000 0000 0000 0000'), isZero: SIGNALS._1, isNegative: SIGNALS._0 }},
        { name: 'ALU(a,d,010101) should return 1111 1111 1111 1111 01', input: { x: dRegister, y: aRegister, control: new SixBitSignal('010101') }, expectedOutput: { out: new SixteenBitSignal('1111 1111 1111 1111'), isZero: SIGNALS._0, isNegative: SIGNALS._1 }},
    ]

    tests.forEach(({ name, input, expectedOutput }) => {
        test(name, () => {
            const { out, isZero, isNegative } = ALU(input)
            expect(out.isEquals(expectedOutput.out)).toBeTruthy()
            expect(isZero.isEquals(expectedOutput.isZero)).toBeTruthy()
            expect(isNegative.isEquals(expectedOutput.isNegative)).toBeTruthy()
        })
    })

})
