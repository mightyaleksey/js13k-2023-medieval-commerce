/* @flow */
import { Character } from '@/entities/character'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/game-elements'
import { Tile } from '../components'

import {
  Actions,
  genObstacleKey, genObstacleMap,
  offsetX, offsetY
} from '@/utils/walk'
import { isInstanceOf } from '@/utils/helpers'
import { nullthrows } from '@/utils/guard'

export class HaulSystem extends System<Tile, Character | Sack> {
  constructor () {
    super()
    this._requiredComponents = [Tile]
    this._requiredEntities = [Character, Sack]
  }

  update () {
    const sacks = this.entities.filter(sack => isInstanceOf(sack, Sack))
    const obstacleMap = genObstacleMap(this.components)
    // todo find a better way to exclude table tiles
    // $FlowFixMe[cannot-write]
    obstacleMap[genObstacleKey(11, 8)] = 0
    // $FlowFixMe[cannot-write]
    obstacleMap[genObstacleKey(11, 9)] = 0

    this.entities.forEach(character => {
      if (!isInstanceOf(character, Character)) return

      const [tile, direction, , haul, action] = character.components

      const angle = direction.angle
      const posX = tile.x + offsetX[angle]
      const posY = tile.y + offsetY[angle]

      if (haul.tile != null) {
        // update sack position (if hauled)
        const lift = -0.1
        const offset = 0.4

        const sackTile = haul.tile
        sackTile.x = tile.x + offsetX[angle] * offset
        sackTile.y = tile.y + lift + offsetY[angle] * offset
      }

      if (action.type === Actions.Grab) {
        // grab nearest sack
        const sack = sacks.find(s => {
          const sackTile = s.components[0]
          const dx = sackTile.x - posX
          const dy = sackTile.y - posY
          return dx * dx + dy * dy < 0.3
        })

        if (sack != null) {
          haul.tile = sack.components[0]
        }

        action.type = Actions.Idle
      }

      if (action.type === Actions.Drop) {
        // drop sack
        const sackTile = nullthrows(haul.tile)

        // todo add collision detection
        const tx = Math.round(posX)
        const ty = Math.round(posY)
        const targetDistance =
          (tx - posX) * (tx - posX) +
          (ty - posY) * (ty - posY)

        if (
          targetDistance < 0.1 &&
          obstacleMap[genObstacleKey(tx, ty)] !== 1
        ) {
          sackTile.x = tx
          sackTile.y = ty
          haul.tile = null
        }

        action.type = Actions.Idle
      }
    })
  }
}
