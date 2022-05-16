import { SIGNALS } from '../signals'
import {
    Register,
    RAM64K,
    ProgramCounter,
} from './memory'

describe('register', () => {
    const register = new Register()
    test('register.probe() should return 0000 0000 0000 0000', () => {
        expect(register.probe().isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...register.probe(1111 1111 1111 1111, 0) should return 0000 0000 0000 0000', () => {
        expect(register.probe(SIGNALS._1111111111111111, SIGNALS._0).isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...register.probe(1111 1111 1111 1111, 1) should return 1111 1111 1111 1111', () => {
        expect(register.probe(SIGNALS._1111111111111111, SIGNALS._1).isEquals(SIGNALS._1111111111111111)).toBeTruthy()
    })
    test('...register.probe(0000 0000 0000 0000, 0) should return 1111 1111 1111 1111', () => {
        expect(register.probe(SIGNALS._0000000000000000, SIGNALS._0).isEquals(SIGNALS._1111111111111111)).toBeTruthy()
    })
    test('...register.probe() should return 1111 1111 1111 1111', () => {
        expect(register.probe().isEquals(SIGNALS._1111111111111111)).toBeTruthy()
    })
    test('...register.probe(0000 0000 0000 0000, 1) should return 0000 0000 0000 0000', () => {
        expect(register.probe(SIGNALS._0000000000000000, SIGNALS._1).isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...register.probe() should return 0000 0000 0000 0000', () => {
        expect(register.probe().isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
})

describe ('RAM64K', () => {
    const RAM = new RAM64K()
    test('RAM.probe(0000 0000 0000 0000) should return 0000 0000 0000 0000', () => {
        expect(RAM.probe(SIGNALS._0000000000000000).isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...RAM.probe(0000 0000 0000 0001) should return 0000 0000 0000 0000', () => {
        expect(RAM.probe(SIGNALS._0000000000000001).isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...RAM.probe(0000 0000 0000 0010) should return 0000 0000 0000 0000', () => {
        expect(RAM.probe(SIGNALS._0000000000000010).isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...RAM.probe(0000 0000 0000 0000, 1111 1111 1111 1111, 0) should return 0000 0000 0000 0000', () => {
        expect(RAM.probe(
            SIGNALS._0000000000000000,
            SIGNALS._1111111111111111,
            SIGNALS._0,
        ).isEquals(SIGNALS._0000000000000000)).toBeTruthy()
    })
    test('...RAM.probe(0000 0000 0000 0000, 1111 1111 1111 1111, 1) should return 1111 1111 1111 1111', () => {
        expect(RAM.probe(
            SIGNALS._0000000000000000,
            SIGNALS._1111111111111111,
            SIGNALS._1,
        ).isEquals(SIGNALS._1111111111111111)).toBeTruthy()
    })
    test('...RAM.probe(0000 0000 0000 0000) should return 1111 1111 1111 1111', () => {
        expect(RAM.probe(SIGNALS._0000000000000000).isEquals(SIGNALS._1111111111111111)).toBeTruthy()
    })
})
