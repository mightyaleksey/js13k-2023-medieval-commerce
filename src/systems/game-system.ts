import { Direction, Grab, Haul, State, Tile, Walk } from '@/components'
import { NPC } from '@/entities/npc'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/elements'

import { Layers } from '@/utils/layers'
import {
  States,
  startX, startY,
  shoppingX, shoppingY,
  crossX, crossY,
  doneX, doneY
} from '@/utils/states'
import { Tiles } from '@/utils/tiles'
import { invariant } from '@/utils/validate'
import { findInstance, isInstance, removeInstance } from '@/utils/helpers'
import { getElapsedFrames } from '@/utils/collision'

// npc logic
// - idle -> go to table
// - reached table -> make a request
// - request made -> wait
//   - wait time too long - leave
//   - got resource - pick - leave

export class GameSystem extends System {
  entities?: Array<NPC | Sack>

  constructor () {
    super()

    this._requiredEntities = [NPC, Sack]
  }

  update (elapsedFrames: number, totalFrames: number) {
    const sacks = this.entities!.filter(sack =>
      isInstance(sack, Sack))

    this.entities!.forEach(npc => {
      if (!isInstance(npc, NPC)) return

      const direction = npc.components[1] as Direction
      const state = npc.components[2] as State
      const tile = npc.components[0] as Tile
      invariant(isInstance(state, State))

      const walk = findInstance(npc.components, Walk)

      switch (state.stage) {
        case States.Idle: {
          if (state.startFrame === 0) state.startFrame = totalFrames
          if (getElapsedFrames(totalFrames, state.startFrame) > 50) {
            state.startFrame = 0
            state.stage = States.Start
          }
          break
        }

        case States.Start: {
          state.stage = States.GoShopping
          state.startFrame = 0
          tile.x = startX
          tile.y = startY
          break
        }

        case States.GoShopping: {
          if (walk != null) break

          if (tile.y < shoppingY) {
            npc.components.push(
              new Walk(shoppingX, tile.y + 1, tile)
            )
          }

          if (
            tile.x === shoppingX &&
            tile.y === shoppingY
          ) {
            // shopping table reached
            if (state.startFrame === 0) state.startFrame = totalFrames
            // wait a bit before making request
            if (getElapsedFrames(totalFrames, state.startFrame) > 25) {
              direction.angle = 3
              state.stage = States.Wait
              state.startFrame = 0

              npc.components.push(
                new Tile(shoppingX - 1, shoppingY, Layers.Visual, Tiles.I_SACK_SALT)
              )
            }
          }

          break
        }

        case States.Wait: {
          // todo add waiting time
          // todo add rewards
          if (state.startFrame === 0) state.startFrame = totalFrames

          const requestedSack = npc.components.find(tile =>
            isInstance(tile, Tile) &&
            (tile as Tile).layer === Layers.Visual) as Tile

          const availableSack = sacks.find(sack => {
            const tile = sack.components[0] as Tile
            return (
              tile.x === requestedSack.x &&
              tile.y === requestedSack.y &&
              tile.tileID === requestedSack.tileID
            )
          })
          if (availableSack != null) {
            state.stage = States.GoHome
            state.startFrame = 0

            npc.components.push(
              new Grab()
            )

            removeInstance(npc.components, requestedSack)
          }

          break
        }

        case States.GoHome: {
          const haul = findInstance(npc.components, Haul)
          if (haul == null) break
          if (walk != null) break

          if (tile.y < crossY) {
            npc.components.push(
              new Walk(crossX, tile.y + 1, tile)
            )
          } else if (tile.x < doneX) {
            npc.components.push(
              new Walk(tile.x + 1, doneY, tile)
            )
          } else {
            state.stage = States.Done
            state.startFrame = 0
          }

          break
        }
      }
    })
  }
}
