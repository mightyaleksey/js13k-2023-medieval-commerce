/* @flow */
export opaque type ActionsType = number
export type ActionsKeyType =
  | 'Idle'
  | 'Grab'
  | 'Drop'

// todo add npc actions
export const Actions: {[ActionsKeyType]: ActionsType} = {
  Idle: 0,
  Grab: 1,
  Drop: 2
}

export opaque type StatesType = number
export type StatesKeyType =
  | 'Running'

export const States: {[StatesKeyType]: StatesType} = {
  Running: 3
}
