/* @flow */
import { Character } from '@/entities/character'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/game-elements'

import { Actions, offsetX, offsetY } from '@/utils/walk'
import { isInstanceOf } from '@/utils/helpers'
import { nullthrows } from '@/utils/guard'

export class HaulSystem extends System<void, Character | Sack> {
  constructor () {
    super()
    this._requiredEntities = [Character, Sack]
  }

  update () {
    const sacks = this.entities.filter(sack => isInstanceOf(sack, Sack))

    this.entities.forEach(character => {
      if (!isInstanceOf(character, Character)) return

      const [tile, direction, , haul, action] = character.components

      const posX = tile.x + offsetX[direction.angle]
      const posY = tile.y + offsetY[direction.angle]

      if (haul.tile != null) {
        // update sack position (if hauled)
        const lift = -0.1
        const offset = 0.4

        const sackTile = haul.tile
        sackTile.x = tile.x + offsetX[direction.angle] * offset
        sackTile.y = tile.y + lift + offsetY[direction.angle] * offset
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

        if (targetDistance < 0.1) {
          sackTile.x = tx
          sackTile.y = ty
          haul.tile = null
        }

        action.type = Actions.Idle
      }
    })
  }
}
