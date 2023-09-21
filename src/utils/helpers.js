/* @flow */
import type { Character } from '@/entities/character'
import type { Sack } from '@/entities/sack'
import type { TilesType } from './tiles'

import { nullthrows } from './guard'

export function genEntity<T: Character | Sack> (
  Factory: Class<T>,
  x: number,
  y: number,
  tileID?: TilesType
): T {
  const entity = new Factory()
  const tile = entity.components[0]
  if (tileID != null) tile.tileID = tileID
  tile.x = x
  tile.y = y
  return entity
}

export function isInstanceOf<T> (
  instance: mixed,
  factory: Class<T>
): instance is T { // eslint-disable-line
  return instance instanceof factory
}

export function difference <T> (
  left: T[],
  right: T[]
): T[] {
  return left.filter(leftElem => !right.includes(leftElem))
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

export function random (
  start: number,
  end?: number
): number {
  if (typeof end !== 'number') {
    end = start
    start = 0
  }

  return Math.round(
    Math.random() * (end - start)
  ) + start
}
