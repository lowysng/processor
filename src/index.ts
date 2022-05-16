import { Computer } from './computer'

const computer = new Computer()

while (computer.fetchExecute()) {
    console.log('executing!')
}

console.log('halt!')

computer.debug()
