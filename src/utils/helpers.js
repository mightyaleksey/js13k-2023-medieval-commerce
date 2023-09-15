/* @flow */
import { nullthrows } from './guard'

export function isInstanceOf<T> (
  instance: mixed,
  factory: Class<T>
): instance is T { // eslint-disable-line
  return instance instanceof factory
}

export function iterate (
  start: number,
  end: number | (number => void),
  fn?: number => void
) {
  if (typeof end === 'function') {
    fn = end
    end = start
    start = 0
  }

  for (let i = 0; i < end - start; ++i) {
    nullthrows(fn)(start + i)
  }
}

export function range (
  start: number,
  end?: number
): number[] {
  if (typeof end !== 'number') {
    end = start
    start = 0
  }

  const elements: number[] = new Array(end - start)
  for (let i = 0; i < elements.length; ++i) {
    elements[i] = start + i
  }

  return elements
}
