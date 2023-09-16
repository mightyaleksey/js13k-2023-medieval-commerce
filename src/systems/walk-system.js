/* @flow */
import { Character } from '@/entities/character'
import { System } from '@/utils/game-elements'
import { Tile } from '../components'

import {
  genObstacleKey, genObstacleMap,
  getAngle, getDeltaFrames,
  offsetX, offsetY
} from '@/utils/walk'

const stepTreshold = 0.2
const walkTreshold = 1.5

export class WalkSystem extends System<Tile, Character> {
  constructor () {
    super()
    this._requiredComponents = [Tile]
    this._requiredEntities = [Character]
  }

  update (elapsedFrames: number, totalFrames: number) {
    const obstacleMap = genObstacleMap(this.components)

    // plan:
    // 1. validate walk components for collisions
    // 2. moves characters through the tiles towards walk coordinates
    // 3. remove walk component
    this.entities.forEach(character => {
      const [tile, direction, walk] = character.components
      if (!walk.isActive) return

      if (!walk.isVerified) {
        walk.isBlocked = obstacleMap[genObstacleKey(walk.x, walk.y)] === 1
        walk.isVerified = true
        walk.startFrame = totalFrames
      }

      const angle = direction.angle = getAngle(walk, tile)
      const walkDelta = walk.speed * elapsedFrames

      if (
        walk.isBlocked &&
        getDeltaFrames(totalFrames, walk.startFrame) > stepTreshold / walk.speed
      ) {
        // return back to original tile position after hitting obstacle
        if (angle % 2 === 0) {
          const ty = walk.y + (angle === 2 ? -1 : 1)
          const dy = tile.y + (angle === 2 ? -1 : 1) * walkDelta
          tile.y = walk.speed * walkTreshold > Math.abs(ty - dy) ? ty : dy
        } else {
          const tx = walk.x + (angle === 1 ? -1 : 1)
          const dx = tile.x + (angle === 1 ? -1 : 1) * walkDelta
          tile.x = walk.speed * walkTreshold > Math.abs(tx - dx) ? tx : dx
        }
      } else {
        if (angle % 2 === 0) {
          const dy = tile.y + offsetY[angle] * walkDelta
          tile.y = walk.speed * walkTreshold > Math.abs(walk.y - dy) ? walk.y : dy
        } else {
          const dx = tile.x + offsetX[angle] * walkDelta
          tile.x = walk.speed * walkTreshold > Math.abs(walk.x - dx) ? walk.x : dx
        }
      }

      // remove walk components when destination is reached
      const dx = walk.x - tile.x
      const dy = walk.y - tile.y
      const dz = Math.abs(dx + dy)

      const isDestinationReached =
        (dx === 0 && dy === 0) ||
        (walk.isBlocked && (dz === 0 || dz === 1 || dz === 2))

      if (isDestinationReached) {
        walk.isActive = false
      }
    })
  }
}
