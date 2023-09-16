/* @flow */
import { Character } from '@/entities/character'
import { System } from '@/utils/game-elements'

export class GameSystem extends System<void, Character> {
  constructor () {
    super()
    this._requiredEntities = [Character]
  }

  update () {
    if (this.entities.length === 0) {
      this.entities.push(
        new Character()
      )
    }
  }
}
