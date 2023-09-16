/* @flow */
import { Player } from '@/entities/character'
import { System } from '@/utils/game-elements'

import { Actions } from '@/utils/walk'
import controls from '@/state/controls'

export class PlayerSystem extends System<void, Player> {
  constructor () {
    super()
    this._requiredEntities = [Player]
  }

  update () {
    const [tile, , walk, , action] = this.entities[0].components

    const isMoving =
      controls.isDown ||
      controls.isLeft ||
      controls.isRight ||
      controls.isUp

    if (isMoving && !walk.isActive) {
      walk.isActive = true
      walk.isBlocked = false
      walk.isVerified = false

      walk.x = tile.x + (controls.isLeft ? -1 : controls.isRight ? 1 : 0)
      walk.y = tile.y + (controls.isUp ? -1 : controls.isDown ? 1 : 0)
    }

    if (controls.isAction) {
      action.type = Actions.Grab
    }
  }
}
