/* @flow */

export function invariant (condition: mixed, message?: string) {
  if (!condition) {
    throw new Error(message ?? 'Invariant violation')
  }
}

export function nullthrows<T> (value: ?T, message?: string): T {
  if (value == null) {
    throw new Error(message ?? 'Got unexpected null')
  }

  return value
}
