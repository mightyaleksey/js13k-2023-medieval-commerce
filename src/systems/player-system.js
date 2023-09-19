/* @flow */
import { Player } from '@/entities/character'
import { System } from '@/utils/game-elements'

import { Actions, States } from '@/utils/constants'
import controls from '@/state/controls'
import game from '@/state/game'

export class PlayerSystem extends System<void, Player> {
  constructor () {
    super()
    this._requiredEntities = [Player]
  }

  update () {
    if (game.state === States.Running) {
      // control character
      const [tile, , walk, haul, action] = this.entities[0].components

      const isMoving =
        controls.s.isDown ||
        controls.s.isLeft ||
        controls.s.isRight ||
        controls.s.isUp

      if (isMoving && !walk.isActive) {
        walk.isActive = true
        walk.isBlocked = false
        walk.isVerified = false

        walk.x = tile.x + (controls.s.isLeft ? -1 : controls.s.isRight ? 1 : 0)
        walk.y = tile.y + (controls.s.isUp ? -1 : controls.s.isDown ? 1 : 0)
      }

      if (
        controls.s.isAction &&
        controls.q.isAction
      ) {
        controls.q.isAction = false
        action.type = haul.tile != null
          ? Actions.Drop
          : Actions.Grab
      }
    }
  }
}
