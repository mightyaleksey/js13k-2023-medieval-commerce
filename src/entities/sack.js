/* @flow */
import { Entity } from '@/utils/game-elements'
import { Tile } from '../components'

import { Layers, Tiles } from '@/utils/tiles'

export class Sack extends Entity {
  components: [Tile]

  constructor () {
    super()
    this.components = [
      new Tile(8, 9, Layers.Object, Tiles.SACK_SALT_00)
    ]
  }
}
