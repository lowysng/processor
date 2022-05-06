import { Bit, SIGNALS } from './signals'
import { demultiplexor } from './gates'

console.log(demultiplexor(SIGNALS._0, SIGNALS._0))
console.log(demultiplexor(SIGNALS._0, SIGNALS._1))
console.log(demultiplexor(SIGNALS._1, SIGNALS._0))
console.log(demultiplexor(SIGNALS._1, SIGNALS._1))
