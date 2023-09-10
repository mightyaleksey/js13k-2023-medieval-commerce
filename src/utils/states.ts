export const startX = 12
export const startY = -1
export const shoppingX = 12
export const shoppingY = 9
export const crossX = 12
export const crossY = 13
export const doneX = 18
export const doneY = 13

export const States = {
  Idle: 0,
  Start: 1, // reset state
  GoShopping: 2,
  Wait: 3,
  GoHome: 4,
  Done: 5
} as const

export type StateType = typeof States[keyof typeof States]
