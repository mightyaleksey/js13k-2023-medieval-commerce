/* @flow */
import { Entity } from '@/utils/game-elements'
import { Action, Direction, Haul, Tile, Walk } from '../components'

import { Layers, Tiles } from '@/utils/tiles'

export class Character extends Entity {
  components: [Tile, Direction, Walk, Haul, Action]

  constructor () {
    super()
    this.components = [
      new Tile(8, 8, Layers.Object, Tiles.CHARACTER_00),
      new Direction(),
      new Walk(),
      new Haul(),
      new Action()
    ]
  }
}

export class Carrier extends Character {
  constructor () {
    super()

    const carrierTile = this.components[0]
    carrierTile.tileID = Tiles.CHARACTER_20
    carrierTile.x = -1
    carrierTile.y = 13
  }
}

export class Player extends Character {}
