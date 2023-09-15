/* @flow */
import { Entity } from '@/utils/game-elements'
import { Direction, Tile, Walk } from '../components'

import { Layers, Tiles } from '@/utils/tiles'

export class Character extends Entity {
  /* eslint-disable no-undef */
  components: [
    tile: Tile,
    direction: Direction,
    walk?: Walk
  ]
  /* eslint-enable no-undef */

  constructor () {
    super()

    this.components = [
      new Tile(8, 8, Layers.Objects, Tiles.CHARACTER_00),
      new Direction()
    ]
  }
}
