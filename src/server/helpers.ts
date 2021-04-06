import { Transition, Weather } from '../common/types'

export const now = (): number => {
  return Math.floor(Date.now() / 1000)
}

export const weightedElement = (input: Array<Transition>): Transition => {
  let i;

  const weights = []

  for (i=0; i<input.length; i++) {
    weights[i] = input[i].chance + (weights[i - 1] || 0)
  }

  const random = Math.random() * weights[weights.length - 1]

  return input[weights.findIndex(el => el > random)]
}


export const randomArrElement = (array: Weather[]): Weather => {
  return array[Math.floor(Math.random() * array.length)]
}
