import { Direction, Grab, Haul, State, Tile, Walk } from '@/components'
import { NPC } from '@/entities/npc'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/elements'

import { Layers } from '@/utils/layers'
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

      const tile = npc.components[0] as Tile
      const direction = npc.components[1] as Direction
      const state = npc.components[2] as State
      invariant(isInstance(state, State))

      switch (state.stage) {
        case 'idle':
          if (state.startFrame === 0) state.startFrame = totalFrames
          if (getElapsedFrames(totalFrames, state.startFrame) > 50) {
            state.startFrame = 0
            state.stage = 'go-to-table'
          }
          break

        case 'go-to-table': {
          const walk = findInstance(npc.components, Walk)
          if (walk == null) {
            npc.components.push(
              new Walk(12, 9, tile)
            )
          }
          if (tile.x === 12 && tile.y === 9) {
            // table reached
            if (state.startFrame === 0) state.startFrame = totalFrames
            if (getElapsedFrames(totalFrames, state.startFrame) > 25) {
              direction.angle = 3
              npc.components.push(
                new Tile(11, 9, Layers.Visual, Tiles.I_SACK_SALT)
              )
              state.startFrame = 0
              state.stage = 'wait'
            }
          }
          break
        }

        case 'wait': {
          if (state.startFrame === 0) state.startFrame = totalFrames
          const expectedSack = npc.components.find(tile =>
            isInstance(tile, Tile) &&
            (tile as Tile).layer === Layers.Visual) as Tile
          const sack = sacks.find(sack => {
            const tile = sack.components[0] as Tile
            return (
              tile.x === expectedSack.x &&
              tile.y === expectedSack.y &&
              tile.tileID === expectedSack.tileID
            )
          })

          if (sack != null) {
            state.stage = 'leave'
            state.startFrame = 0

            npc.components.push(
              new Grab()
            )

            removeInstance(npc.components, expectedSack)
          }
          break
        }

        case 'leave': {
          const haul = findInstance(npc.components, Haul)
          if (haul == null) break

          const walk = findInstance(npc.components, Walk)
          if (walk == null) {
            const x = tile.y === 9 ? 12 : 18
            npc.components.push(
              new Walk(x, 13, tile)
            )
          }

          break
        }
      }
    })
  }
}
