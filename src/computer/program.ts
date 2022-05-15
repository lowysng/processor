import { SixteenBitSignal } from "../signals";

export const program = [
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1
    new SixteenBitSignal('1000 1100 0000 1000'),  // M=A
    new SixteenBitSignal('0000 0000 0000 0011'),  // @3
    new SixteenBitSignal('1000 1100 0001 0000'),  // D=A
    new SixteenBitSignal('0000 0000 0000 0010'),  // @2
    new SixteenBitSignal('1000 0011 0000 1000'),  // M=D
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1
    new SixteenBitSignal('1001 1100 0001 0000'),  // D=M
    new SixteenBitSignal('0000 0000 0000 0010'),  // @2
    new SixteenBitSignal('1001 0100 1101 0000'),  // D=D-M
    new SixteenBitSignal('0000 0000 0001 0100'),  // @20
    new SixteenBitSignal('1000 0011 0001 0001'),  // D;JGT
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1
    new SixteenBitSignal('1001 1100 0001 0000'),  // D=M
    new SixteenBitSignal('0000 0000 0000 0000'),  // @0
    new SixteenBitSignal('1001 0000 1000 1000'),  // M=D+M
    new SixteenBitSignal('0000 0000 0000 0001'),  // @1
    new SixteenBitSignal('1001 1101 1100 1000'),  // M=M+1
    new SixteenBitSignal('0000 0000 0000 0110'),  // @6
    new SixteenBitSignal('1000 1010 1000 0111'),  // 0;JMP
    new SixteenBitSignal('1000 1000 0000 0000'),  // HALT
]
