/* @flow */
import type { LayersType, TilesType } from '@/utils/tiles'

import { Component } from './utils/game-elements'

export class Tile extends Component {
  x: number
  y: number
  layer: LayersType
  tileID: TilesType

  constructor (
    x: number,
    y: number,
    layer: LayersType,
    tileID: TilesType
  ) {
    super()
    this.x = x
    this.y = y
    this.layer = layer
    this.tileID = tileID
  }
}

export class Direction extends Component {
  angle: number

  constructor () {
    super()
    this.angle = 0
  }
}

export class Walk extends Component {
  x: number
  y: number

  constructor (
    x: number,
    y: number
  ) {
    super()
    this.x = x
    this.y = y
  }
}
