import { OneBitSignal, SIGNALS } from "./Signal";

describe('isEquals', () => {
    it('should return false', () => {
        expect(SIGNALS._00.isEquals(SIGNALS._11)).not.toBeTruthy()
    })
    it('should return true', () => {
        expect(SIGNALS._00.isEquals(SIGNALS._00)).toBeTruthy()
    })
    it('should return false', () => {
        expect(SIGNALS._00.isEquals(SIGNALS._1)).not.toBeTruthy()
    })
})

describe('atIndex', () => {
    it('should return 1', () => {
        const bit = SIGNALS._010.atIndex(1)
        const signal = new OneBitSignal([bit])
        expect(signal.isEquals(SIGNALS._1)).toBeTruthy()
    })
})

describe('slice', () => {
    it('should return 1', () => {
        const sliced = SIGNALS._0010.slice(2,3)
        expect(sliced.isEquals(SIGNALS._1)).toBeTruthy()
    })
    it('should return 01', () => {
        const sliced = SIGNALS._0010.slice(1,3)
        expect(sliced.isEquals(SIGNALS._01)).toBeTruthy()
    })
})

describe('concatenate', () => {
    it('should return 0000', () => {
        const concatenated = SIGNALS._00.concatenate(SIGNALS._00)
        expect(concatenated.isEquals(SIGNALS._0000)).toBeTruthy()
    })
    it('should return 0001', () => {
        const concatenated = SIGNALS._000.concatenate(SIGNALS._1)
        expect(concatenated.isEquals(SIGNALS._0001)).toBeTruthy()
    })
    it('should return 101', () => {
        const concatenated = SIGNALS._1.concatenate(SIGNALS._0, SIGNALS._1)
        expect(concatenated.isEquals(SIGNALS._101)).toBeTruthy()
    })
    it('should return 010', () => {
        const concatenated = SIGNALS._0.concatenate(SIGNALS._1).concatenate(SIGNALS._0)
        expect(concatenated.isEquals(SIGNALS._010)).toBeTruthy()
    })
    it('should return 00', () => {
        const concatenated = SIGNALS._00.concatenate()
        expect(concatenated.isEquals(SIGNALS._00)).toBeTruthy()
    })
})

const isOne = (signal: OneBitSignal): boolean => {
    const bit = signal.atIndex(0)
    return new OneBitSignal([bit]).isEquals(SIGNALS._1)
}

describe('some', () => {
    it('should return true', () => {
        const bool = SIGNALS._0001.some(isOne)
        expect(bool).toBeTruthy()
    })
    it('should return false', () => {
        const bool = SIGNALS._0000.some(isOne)
        expect(bool).not.toBeTruthy()
    })
})

describe('every', () => {
    it('should return false', () => {
        const bool = SIGNALS._0001.every(isOne)
        expect(bool).not.toBeTruthy()
    })
    it('should return true', () => {
        const bool = SIGNALS._1111.every(isOne)
        expect(bool).toBeTruthy()
    })
})

describe('map', () => {
    const not = (signal: OneBitSignal): OneBitSignal => {
        if (signal.isEquals(SIGNALS._0)) {
            return SIGNALS._1
        } else {
            return SIGNALS._0
        }
    }
    it('should return 010', () => {
        const mapped = SIGNALS._101.map(not)
        expect(mapped.isEquals(SIGNALS._010)).toBeTruthy()
    })
})

describe('mapAgainst', () => {
    const and = (
        signal: OneBitSignal,
        otherSignal: OneBitSignal,
    ): OneBitSignal => {
        if (signal.isEquals(SIGNALS._1) && otherSignal.isEquals(SIGNALS._1)) {
            return SIGNALS._1
        } else {
            return SIGNALS._0
        }
    }
    it('should return 010', () => {
        const andd = SIGNALS._111.mapAgainst(SIGNALS._010, and)
        expect(andd.isEquals(SIGNALS._010)).toBeTruthy()
    })
})

describe('toString', () => {
    it('should return \'0001\'', () => {
        const string = SIGNALS._0001.toString()
        expect(string === '0001').toBeTruthy()
    })
})

describe('toDecimal', () => {
    it('should return 6', () => {
        const decimal = SIGNALS._0110.toDecimal()
        expect(decimal === 6).toBeTruthy()
    })
    it('should return -1', () => {
        const decimal = SIGNALS._1111.toDecimal()
        expect(decimal === -1).toBeTruthy()
    })
})
