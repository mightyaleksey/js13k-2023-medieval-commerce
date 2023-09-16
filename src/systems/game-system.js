/* @flow */
import { Player } from '@/entities/character'
import { System } from '@/utils/game-elements'

export class GameSystem extends System<void, Player> {
  constructor () {
    super()
    this._requiredEntities = [Player]
  }

  update () {
    if (this.entities.length === 0) {
      this.entities.push(
        new Player()
      )
    }
  }
}
