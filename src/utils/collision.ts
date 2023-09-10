import { Component } from './elements'
import { Tile, Walk } from '../components'

import { gameMapWidth, gameMapLength } from './tiles'
import { isInstance } from './helpers'

// maps angle to coordinate offset
export const offsetX = [0, 1, 0, -1]
export const offsetY = [-1, 0, 1, 0]

export function getAngle (to: Tile | Walk, from: Tile | Walk): number {
  const deltaX = to.x - from.x // greater than zero, move right
  const deltaY = to.y - from.y // greater than zero, move down
  if (deltaX > 0) return 1
  if (deltaY > 0) return 2
  if (deltaX < 0) return 3
  return 0
}

export function genObstacleKey (tile: Tile | Walk): number {
  // adds extra to support negative numbers for map borders
  return (tile.x + 2) + (tile.y + 2) * (gameMapWidth + 4)
}

export function genObstacleMap (components: Component[]): number[] {
  const obstacleMap = new Array(gameMapLength).fill(0)

  components.forEach(component => {
    if (
      isInstance(component, Tile) &&
      // checks obstacle layers (2,4,6)
      (component as Tile).layer % 2 === 0
    ) {
      const key = genObstacleKey(component as Tile)
      obstacleMap[key] = 1
    }
  })

  return obstacleMap
}

// frame range [0, 1000], after 1000 it is reset to 0
// expected delta (output) range [0, 20]
export function getElapsedFrames (currentFrame: number, startFrame: number): number {
  const delta = currentFrame - startFrame
  if (delta < 0) return delta + 1000
  return delta
}
