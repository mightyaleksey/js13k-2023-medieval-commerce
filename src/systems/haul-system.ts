import { Delay, Direction, Drop, Grab, Haul, Throw, Tile } from '../components'
import { NPC } from '@/entities/npc'
import { Player } from '@/entities/player'
import { Provider } from '@/entities/provider'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/elements'

import { Layers } from '@/utils/layers'
import {
  isInstance,
  isInstanceOfAny,
  findInstance,
  removeInstance
} from '@/utils/helpers'
import { offsetX, offsetY } from '@/utils/collision'
import { invariant, nullthrows } from '@/utils/validate'

export class HaulSystem extends System {
  components?: Haul[]
  entities?: Array<NPC | Player | Provider | Sack>

  constructor () {
    super()

    this._requiredComponents = [Haul]
    this._requiredEntities = [NPC, Player, Provider, Sack]
  }

  update (elapsedFrames: number, totalFrames: number) {
    this.components!.forEach(haul => {
      // update sack position (if hauled)
      const angle = haul.direction.angle
      const lift = -0.1
      const offset = 0.4
      const x = haul.player.x + offsetX[angle] * offset
      const y = haul.player.y + lift + offsetY[angle] * offset

      haul.sack.x = x
      haul.sack.y = y
      haul.sack.layer = angle === 0
        ? Layers.ObjectsBelow
        : Layers.ObjectsAbove
    })

    const characters = this.entities!.filter(player =>
      isInstanceOfAny(player, [NPC, Player, Provider]))
    const sacks = this.entities!.filter(sack =>
      isInstance(sack, Sack) &&
      !characters.some(player => {
        const haul = findInstance(player.components, Haul)
        return haul != null && haul.sack === sack.components[0]
      }))

    // validate grab / drop actions
    characters.forEach(player => {
      const tile = player.components[0] as Tile
      invariant(isInstance(tile, Tile))
      const direction = player.components[1] as Direction
      invariant(isInstance(direction, Direction))

      // position where sack can be
      const posX = tile.x + offsetX[direction.angle]
      const posY = tile.y + offsetY[direction.angle]

      const grab = findInstance(player.components, Grab)
      if (grab != null) {
        const sack = sacks.find(sack => {
          const sackTile = sack.components[0] as Tile
          invariant(isInstance(sackTile, Tile))
          const dx = sackTile.x - posX
          const dy = sackTile.y - posY
          return dx * dx + dy * dy < 0.3
        })

        if (sack != null) {
          if (isInstance(player, Player)) {
            player.components.push(
              new Delay(10, totalFrames)
            )
          }

          player.components.push(
            new Haul(tile, sack.components[0] as Tile, direction)
          )
        }

        removeInstance(player.components, grab)
      }

      const drop = findInstance(player.components, Drop)
      if (drop != null) {
        const haul = nullthrows(
          findInstance(player.components, Haul)
        ) as Haul

        // todo add collision detection
        const targetX = Math.round(posX)
        const targetY = Math.round(posY)
        const targetDistance =
          (targetX - posX) * (targetX - posX) +
          (targetY - posY) * (targetY - posY)

        if (targetDistance < 0.1) {
          haul.sack.x = targetX
          haul.sack.y = targetY

          player.components.push(
            new Delay(10, totalFrames)
          )

          removeInstance(player.components, haul)
        }

        removeInstance(player.components, drop)
      }

      const throwSack = findInstance(player.components, Throw)
      if (throwSack != null) {
        const haul = nullthrows(
          findInstance(player.components, Haul)
        ) as Haul

        haul.sack.x = throwSack.x
        haul.sack.y = throwSack.y

        removeInstance(player.components, haul)
        removeInstance(player.components, throwSack)
      }
    })
  }
}
