import { makeComputer, debugComputer, ComputerState } from './computer'

const computer = makeComputer()

while (computer()) {
    console.log('executing!')
}

console.log('halt!')

const stateHistory = computer('getStateHistory') as ComputerState[]
debugComputer(stateHistory)
