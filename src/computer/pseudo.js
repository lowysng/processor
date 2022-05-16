function sumOfIntegersUpToN (n) {
    let sum = 0
    let current = 1
    while (true) {
        if (current - n > 0) {
            return sum
        }
        sum += current
        current += 1
    }
}
