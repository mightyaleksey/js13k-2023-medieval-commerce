import { Entity } from '@/utils/elements'

import { Direction, State, Tile } from '../components'
import { Layers } from '@/utils/layers'
import { Tiles } from '@/utils/tiles'

import { States } from '@/utils/states'

export class NPC extends Entity {
  constructor () {
    super()

    this.components.push(
      new Tile(0, -2, Layers.Objects, Tiles.I_NPC_0),
      new Direction(0),
      new State(States.Idle)
    )
  }
}
