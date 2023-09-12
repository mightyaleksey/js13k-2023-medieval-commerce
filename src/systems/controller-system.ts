import { Delay, Drop, Grab, Haul, Tile, Walk } from '../components'
import { Menu } from '@/entities/menu'
import { Player } from '@/entities/player'
import { System } from '@/utils/elements'

import { GameStates } from '@/utils/states'
import { findInstance, removeInstance } from '@/utils/helpers'
import { nullthrows } from '@/utils/validate'
import controls from '@/state/controls'
import game from '@/state/game'

// animate character movement
// detect collisions
export class ControllerSystem extends System {
  entities?: Array<Menu | Player>

  constructor () {
    super()

    this._requiredEntities = [Menu, Player]
  }

  update (elapsedFrames: number, totalFrames: number) {
    const player = nullthrows(findInstance(this.entities!, Player))
    const tile = player.components[0] as Tile

    if (
      game.stage === GameStates.Intro ||
      game.stage === GameStates.Help
    ) {
      if (controls.isAction) {
        const delay = findInstance(player.components, Delay)
        if (delay != null) return

        game.stage = game.stage === GameStates.Intro
          ? GameStates.PrepareHelp
          : GameStates.Game

        player.components.push(
          new Delay(10, totalFrames)
        )

        const menu = nullthrows(findInstance(this.entities!, Menu))
        removeInstance(this.entities!, menu)
      }
    }

    if (game.stage === GameStates.Game) {
      const isMoving =
        controls.isDown ||
        controls.isLeft ||
        controls.isRight ||
        controls.isUp
      const walk =
        findInstance(player.components, Walk)

      if (isMoving && walk == null) {
        const x = tile.x + (controls.isLeft ? -1 : controls.isRight ? 1 : 0)
        const y = tile.y + (controls.isUp ? -1 : controls.isDown ? 1 : 0)

        // create Walk component with the destination
        player.components.push(
          new Walk(x, y, tile)
        )
      }

      if (controls.isAction) {
        const delay = findInstance(player.components, Delay)
        if (delay == null) {
          const haul = findInstance(player.components, Haul)

          if (haul != null) {
            player.components.push(
              new Drop()
            )
          } else {
            player.components.push(
              new Grab()
            )
          }
        }
      }
    }
  }
}
