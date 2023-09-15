/* @flow */
import { Character } from '@/entities/character'
import { System } from '@/utils/game-elements'
import { Tile, Walk } from '../components'

import { genObstacleMap } from '@/utils/walk'

export class WalkSystem extends System<Tile | Walk, Character> {
  constructor () {
    super()
    this._requiredComponents = [Tile, Walk]
    this._requiredEntities = [Character]
  }

  update () {
    const obstacleMap = genObstacleMap(this.components)

    this.entities.forEach(character => {
      const walk = character.components[2]
      if (walk == null) return

      const tile = character.components[0]
    })
  }
}
