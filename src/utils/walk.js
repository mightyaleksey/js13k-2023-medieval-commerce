/* @flow */
import { Component } from './game-elements'
import { Tile, Walk } from '../components'

import { gameMapWidth, gameMapHeight, isObstacleTile } from './tiles'
import { isInstanceOf } from './helpers'

// maps angle to coordinate offset
export const offsetX = [0, 1, 0, -1]
export const offsetY = [-1, 0, 1, 0]

export function getAngle (
  destination: Tile | Walk,
  start: Tile | Walk
): number {
  const dx = destination.x - start.x // greater than zero, move right
  const dy = destination.y - start.y // greater than zero, move down
  if (dx > 0) return 1
  if (dy > 0) return 2
  if (dx < 0) return 3
  return 0
}

// frame range [0, 1000], after 1000 it is reset to 0
// expected delta (output) range [0, 20]
export function getDeltaFrames (
  currentFrame: number,
  startFrame: number
): number {
  const delta = currentFrame - startFrame
  if (delta < 0) return delta + 1000
  return delta
}

/**
 *   -2 0      7
 * -2        x
 *      xxxxx▓xx
 *  0  x░░░░░░░░x
 *  1  x░░░░░░░░x
 *  2  x░░░░░░░░x
 *  3 x▓░░░░░░░░▓x
 *     xxxxxxxxxx
 */

export function genObstacleKey (
  x: number,
  y: number
): number {
  return (2 + x) + (2 + y) * (4 + gameMapWidth)
}

export function genObstacleMap (
  components: $ReadOnlyArray<Component>
): $ReadOnlyArray<number> {
  const mapSize = (4 + gameMapWidth) * (3 + gameMapHeight)
  const obstacleMap = (new Array(mapSize): number[]).fill(0)

  return components.reduce(
    (map, component) => {
      if (
        isInstanceOf(component, Tile) &&
        isObstacleTile(component)
      ) {
        map[
          genObstacleKey(
            Math.round(component.x),
            Math.round(component.y)
          )
        ] = 1
      }

      return map
    },
    obstacleMap
  )
}
