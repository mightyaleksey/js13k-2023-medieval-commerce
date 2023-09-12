import { Direction, Grab, Haul, State, Tile, Walk } from '@/components'
import { NPC } from '@/entities/npc'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/elements'

import { Layers } from '@/utils/layers'
import {
  States,
  startX, startY,
  shoppingX, shoppingY0, shoppingY1,
  leavePath0, leavePath1
} from '@/utils/states'
import { Tiles } from '@/utils/tiles'
import { invariant, nullthrows } from '@/utils/validate'
import { findInstance, isInstance, removeInstance } from '@/utils/helpers'
import { getElapsedFrames } from '@/utils/collision'
import game from '@/state/game'

// npc logic
// - idle -> go to table
// - reached table -> make a request
// - request made -> wait
//   - wait time too long - leave
//   - got resource - pick - leave

// 21ms per frame
// 20 frames per tile
// full cycle min = waitBeforeStart + 10 * fpt + waitBeforeTrade + 10 * fpt
//                = 400 + waitBeforeStart + waitBeforeTrade
const waitBeforeStart = 100
const waitBeforeTrade = 15
const waitForTrade = 100
const fameBonus = 5
const silverBonus = 10

export class TradeSystem extends System {
  entities?: Array<NPC | Sack>

  constructor () {
    super()

    this._requiredEntities = [NPC, Sack]
  }

  update (elapsedFrames: number, totalFrames: number) {
    const npcs = this.entities!.filter(npc => isInstance(npc, NPC))
    const sacks = this.entities!.filter(sack =>
      isInstance(sack, Sack))

    npcs.forEach(npc => {
      const direction = npc.components[1] as Direction
      const state = npc.components[2] as State
      const tile = npc.components[0] as Tile
      invariant(isInstance(state, State))
      const isWizard = tile.tileID === Tiles.I_NPC_0

      const walk = findInstance(npc.components, Walk)

      switch (state.stage) {
        case States.Idle: {
          if (state.startFrame === 0) state.startFrame = totalFrames
          if (getElapsedFrames(totalFrames, state.startFrame) > waitBeforeStart) {
            state.startFrame = 0
            state.stage = States.Start
          }

          tile.x = -0
          tile.y = -2

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

          const shoppingY = isWizard ? shoppingY0 : shoppingY1
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
            if (getElapsedFrames(totalFrames, state.startFrame) > waitBeforeTrade) {
              direction.angle = 3
              state.stage = States.Wait
              state.startFrame = 0

              const tileID = isWizard
                ? Tiles.I_SACK_SALT
                : Tiles.I_SACK_GRAIN

              npc.components.push(
                new Tile(tile.x - 1, tile.y, Layers.Visual, tileID)
              )
            }
          }

          break
        }

        case States.Wait: {
          const requestedSack = npc.components.find(tile =>
            isInstance(tile, Tile) &&
            (tile as Tile).layer === Layers.Visual) as Tile

          if (state.startFrame === 0) state.startFrame = totalFrames
          if (getElapsedFrames(totalFrames, state.startFrame) > waitForTrade) {
            game.fame -= fameBonus * 2
            state.stage = States.GoHome
            state.startFrame = 0
            removeInstance(npc.components, requestedSack)
            break
          }

          const availableSack = sacks.find(sack => {
            const tile = sack.components[0] as Tile
            return (
              tile.x === requestedSack.x &&
              tile.y === requestedSack.y &&
              tile.tileID === requestedSack.tileID
            )
          })
          if (availableSack != null) {
            game.fame += fameBonus
            game.silver += silverBonus
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
          if (walk != null) break
          if (state.step === 0) state.step = 1

          const destination = isWizard
            ? leavePath0[state.step - 1]
            : leavePath1[state.step - 1]
          if (destination != null) {
            if (tile.x < destination[0]) {
              npc.components.push(
                new Walk(tile.x + 1, tile.y, tile)
              )
            } else if (tile.y < destination[1]) {
              npc.components.push(
                new Walk(tile.x, tile.y + 1, tile)
              )
            } else {
              state.step += 1
            }
            break
          }

          state.stage = States.Done
          state.startFrame = 0
          state.step = 0

          break
        }

        case States.Done: {
          const haul = findInstance(npc.components, Haul)
          if (haul != null) {
            const sack = sacks.find(sack => sack.components[0] === haul.sack)
            removeInstance(this.entities!, nullthrows(sack))
            removeInstance(npc.components, haul)
          }

          state.stage = States.Idle
          state.startFrame = 0

          break
        }
      }
    })

    if ( // add npc to the system
      (npcs.length === 0 &&
      totalFrames < 10) ||
      (npcs.length === 1 &&
      totalFrames > 400)
    ) {
      const npc = new NPC()
      if (npcs.length === 1) (npc.components[0] as Tile).tileID = Tiles.I_NPC_2
      this.entities!.push(
        npc
      )
    }
  }
}
