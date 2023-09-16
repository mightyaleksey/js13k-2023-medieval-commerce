/* @flow */
import { Component } from './game-elements'
import { Tile, Walk } from '../components'

import { gameMapWidth, gameMapHeight, isObstacle } from './tiles'
import { isInstanceOf } from './helpers'

export const Actions = {
  Idle: 0,
  Grab: 1,
  Drop: 2
}

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
  component: Tile | Walk
): number {
  const x = Math.round(component.x)
  const y = Math.round(component.y)
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
        (isInstanceOf(component, Tile) &&
          isObstacle(component)) ||
        isInstanceOf(component, Walk)
      ) {
        map[genObstacleKey(component)] = 1
      }

      return map
    },
    obstacleMap
  )
}
