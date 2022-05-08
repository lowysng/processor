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

console.log(sumOfIntegersUpToN(3))

// [00] 0000000000000001 @1         load 1 into A_REGISTER
// [01] 1000110000001000 M=A        load A_REGISTER into MEMORY[A_REGISTER]
// [02] 0000000000000011 @3         load 3 into A_REGISTER
// [03] 1000110000010000 D=A        load A_REGISTER into D_REGISTER
// [04] 0000000000000010 @2         load 2 into A_REGISTER
// [05] 1000001100001000 M=D        load D_REGISTER into MEMORY[A_REGISTER]
// [06] 0000000000000001 @1         load 1 into A_REGISTER
// [07] 1001110000010000 D=M        load MEMORY[A_REGISTER] into D_REGISTER
// [08] 0000000000000010 @2         load 2 into A_REGISTER
// [09] 1001010011010000 D=D-M      load D_REGISTER - MEMORY[A_REGSTER] into D_REGISTER
// [10] 0000000000010100 @20        load 20 into A_REGISTER
// [11] 1000001100010001 D;JGT      jump to instruction A_REGISTER if D_REGISTER > 0
// [12] 0000000000000001 @1         load 1 into A_REGISTER
// [13] 1001110000010000 D=M        load MEMORY[A_REGISTER] into D_REGISTER
// [14] 0000000000000000 @0         load 0 into A_REGISTER
// [15] 1001000010001000 M=D+M      load D_REGISTER + MEMORY[A_REGISTER] into MEMORY[A_REGISTER]
// [16] 0000000000000001 @1         load 1 into A_REGISTER
// [17] 1001110111001000 M=M+1      increment MEMORY[A_REGISTER]
// [18] 0000000000000110 @6         load 6 into A_REGISTER
// [19] 1000101010000111 0;JMP      jump to instruction A_REGISTER
// [20] 1000100000000000 HALT       halt
