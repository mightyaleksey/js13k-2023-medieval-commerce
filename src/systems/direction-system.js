/* @flow */
import { Character } from '@/entities/character'
import { System } from '@/utils/game-elements'

import { getAngle } from '@/utils/walk'

export class DirectionSystem extends System<void, Character> {
  constructor () {
    super()
    this._requiredEntities = [Character]
  }

  update () {
    this.entities.forEach(character => {
      const walk = character.components[2]
      if (walk != null) {
        const tile = character.components[0]
        const direction = character.components[1]
        direction.angle = getAngle(walk, tile)
      }
    })
  }
}
