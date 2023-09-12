import { Entity } from '@/utils/elements'

import { Direction, Tile } from '../components'
import { Layers } from '@/utils/layers'
import { Tiles } from '@/utils/tiles'

export class Player extends Entity {
  constructor () {
    super()

    this.components.push(
      new Tile(8, 8, Layers.Objects, Tiles.I_PLAYER),
      new Direction(0)
    )
  }
}
