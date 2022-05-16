import { SixteenBitSignal } from "../signals";

export const program = [
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1         load 1 into A_REGISTER
    new SixteenBitSignal('1000 1100 0000 1000'),  // M=A        load A_REGISTER into MEMORY[A_REGISTER]
    new SixteenBitSignal('0000 0000 0000 0011'),  // @3         load 3 into A_REGISTER
    new SixteenBitSignal('1000 1100 0001 0000'),  // D=A        load A_REGISTER into D_REGISTER
    new SixteenBitSignal('0000 0000 0000 0010'),  // @2         load 2 into A_REGISTER
    new SixteenBitSignal('1000 0011 0000 1000'),  // M=D        load D_REGISTER into MEMORY[A_REGISTER]
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1         load 1 into A_REGISTER
    new SixteenBitSignal('1001 1100 0001 0000'),  // D=M        load MEMORY[A_REGISTER] into D_REGISTER
    new SixteenBitSignal('0000 0000 0000 0010'),  // @2         load 2 into A_REGISTER
    new SixteenBitSignal('1001 0100 1101 0000'),  // D=D-M      load D_REGISTER - MEMORY[A_REGSTER] into D_REGISTER
    new SixteenBitSignal('0000 0000 0001 0100'),  // @20        load 20 into A_REGISTER
    new SixteenBitSignal('1000 0011 0001 0001'),  // D;JGT      jump to instruction A_REGISTER if D_REGISTER > 0
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1         load 1 into A_REGISTER
    new SixteenBitSignal('1001 1100 0001 0000'),  // D=M        load MEMORY[A_REGISTER] into D_REGISTER
    new SixteenBitSignal('0000 0000 0000 0000'),  // @0         load 0 into A_REGISTER
    new SixteenBitSignal('1001 0000 1000 1000'),  // M=D+M      load D_REGISTER + MEMORY[A_REGISTER] into MEMORY[A_REGISTER]
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1         load 1 into A_REGISTER
    new SixteenBitSignal('1001 1101 1100 1000'),  // M=M+1      increment MEMORY[A_REGISTER]
    new SixteenBitSignal('0000 0000 0000 0110'),  // @6         load 6 into A_REGISTER
    new SixteenBitSignal('1000 1010 1000 0111'),  // 0;JMP      jump to instruction A_REGISTER
    new SixteenBitSignal('1000 1000 0000 0000'),  // HALT       halt
]
