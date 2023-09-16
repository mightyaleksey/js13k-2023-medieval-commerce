/* @flow */
import { Entity } from '@/utils/game-elements'
import { Action, Direction, Haul, Tile, Walk } from '../components'

import { Layers, Tiles } from '@/utils/tiles'

export class Character extends Entity {
  components: [Tile, Direction, Walk, Haul, Action]

  constructor () {
    super()
    this.components = [
      new Tile(8, 8, Layers.Objects, Tiles.CHARACTER_00),
      new Direction(),
      new Walk(),
      new Haul(),
      new Action()
    ]
  }
}

export class Player extends Character {}
