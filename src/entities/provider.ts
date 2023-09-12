import { Entity } from '@/utils/elements'

import { Direction, State, Tile } from '../components'
import { Layers } from '@/utils/layers'
import { Tiles } from '@/utils/tiles'

import { States } from '@/utils/states'

export class Provider extends Entity {
  constructor () {
    super()

    this.components.push(
      new Tile(-2, 9, Layers.Objects, Tiles.I_NPC_1),
      new Direction(0),
      new State(States.Idle)
    )
  }
}
