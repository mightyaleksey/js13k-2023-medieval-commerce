export const startX = 12
export const startY = -1

export const shoppingX = 12
export const shoppingY0 = 9
export const shoppingY1 = 8

export const leavePath0 = [
  [12, 13],
  [18, 13]
]

export const leavePath1 = [
  [13, 8],
  [13, 12],
  [17, 12],
  [17, 13],
  [18, 13]
]

export const States = {
  Idle: 0,
  Start: 1, // reset state
  GoShopping: 2,
  GoStorage: 3,
  Wait: 4,
  GoHome: 5,
  Done: 6
} as const

export type StateType = typeof States[keyof typeof States]

export const GameStates = {
  PrepareIntro: 0,
  Intro: 1,
  PrepareHelp: 2,
  Help: 3,
  Game: 4,
  Defeat: 5,
  Victory: 6
} as const

export type GameStatesType = typeof GameStates[keyof typeof GameStates]
