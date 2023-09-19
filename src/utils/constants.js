/* @flow */
export opaque type StatesType = number
export type StatesKeyType =
  | 'Running'

export const States: {[StatesKeyType]: StatesType} = {
  Running: 3
}
