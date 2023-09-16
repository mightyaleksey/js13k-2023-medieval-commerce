/* @flow */
import { Character } from '@/entities/character'
import { System } from '@/utils/game-elements'
import { Walk } from '../components'

import controls from '@/state/controls'

export class PlayerSystem extends System<void, Character> {
  constructor () {
    super()
    this._requiredEntities = [Character]
  }

  update () {
    const player = this.entities[0]
    // console.log(player.components)
    const isMoving =
      controls.isDown ||
      controls.isLeft ||
      controls.isRight ||
      controls.isUp
    const walk =
      player.components[2]

    if (isMoving && walk == null) {
      const tile = player.components[0]
      const x = tile.x + (controls.isLeft ? -1 : controls.isRight ? 1 : 0)
      const y = tile.y + (controls.isUp ? -1 : controls.isDown ? 1 : 0)
      player.components[2] = new Walk(x, y)
    }
  }
}
