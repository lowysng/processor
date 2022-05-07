import { makeComputer, debugComputer, ComputerState } from './computer'

const computer = makeComputer()
while (computer()) {}

const stateHistory = computer('getStateHistory') as ComputerState[]
debugComputer(stateHistory)
