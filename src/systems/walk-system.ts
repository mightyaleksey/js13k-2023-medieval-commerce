import { NPC } from '@/entities/npc'
import { Player } from '@/entities/player'
import { Provider } from '@/entities/provider'
import { Tile, Walk } from '../components'
import { System } from '@/utils/elements'

import {
  genObstacleKey, genObstacleMap,
  getAngle, getElapsedFrames,
  offsetX, offsetY
} from '@/utils/collision'
import { findInstance, isInstance, removeInstance } from '@/utils/helpers'

// animate character movement
// detect collisions
export class WalkSystem extends System {
  _walkSpeed: number // tiles per frame
  _walkStep: number
  _walkTreshold: number

  components?: Array<Tile | Walk>
  entities?: Array<NPC | Player | Provider>

  constructor () {
    super()

    this._requiredComponents = [Tile, Walk]
    this._requiredEntities = [NPC, Player, Provider]

    this._walkSpeed = 0.05 // 20 frames per tile
    this._walkStep = 0.2
    this._walkTreshold = 1.5 * this._walkSpeed
  }

  update (elapsedFrames: number, totalFrames: number) {
    const walkComponents = this.components!.filter(component =>
      isInstance(component, Walk)) as Walk[]
    if (walkComponents.length === 0) return

    const obstacleMap = genObstacleMap(this.components!)
    walkComponents.forEach(walk => {
      // check collisions
      if (!walk.isValidated) {
        walk.isBlocked = obstacleMap[genObstacleKey(walk)] === 1
        walk.isValidated = true
        walk.startFrame = totalFrames
      }

      // movement
      const angle = getAngle(walk, walk.tile)
      const walkDelta = this._walkSpeed * elapsedFrames

      if (
        walk.isBlocked &&
        getElapsedFrames(totalFrames, walk.startFrame) >
          this._walkStep / this._walkSpeed
      ) {
        // reverse direction if hit obstacle
        const destination =
          (angle % 2 === 0 ? walk.y : walk.x) +
          (angle === 1 || angle === 2 ? -1 : 1)
        const nextValue =
          (angle % 2 === 0 ? walk.tile.y : walk.tile.x) +
          (angle === 1 || angle === 2 ? -1 : 1) * walkDelta
        walk.tile[angle % 2 === 0 ? 'y' : 'x'] =
          this._walkTreshold > Math.abs(destination - nextValue)
            ? destination
            : nextValue
        return
      }

      const destination =
        (angle % 2 === 0 ? walk.y : walk.x)
      const nextValue =
        angle % 2 === 0
          ? walk.tile.y + offsetY[angle] * walkDelta
          : walk.tile.x + offsetX[angle] * walkDelta

      walk.tile[angle % 2 === 0 ? 'y' : 'x'] =
        this._walkTreshold > Math.abs(destination - nextValue)
          ? destination
          : nextValue
    })

    // clean up walk elements
    this.entities!.forEach(entity => {
      const walk = findInstance(entity.components, Walk)
      if (walk == null) return

      const deltaX = walk.x - walk.tile.x
      const deltaY = walk.y - walk.tile.y
      const deltaZ = Math.abs(deltaX + deltaY)
      const isDestinationReached =
        (deltaX === 0 && deltaY === 0) ||
        (walk.isBlocked && (deltaZ === 0 || deltaZ === 1 || deltaZ === 2))

      if (isDestinationReached) {
        removeInstance(entity.components, walk)
      }
    })
  }
}
