/* @flow */
import type { LayersType, TilesType } from '@/utils/tiles'

import { Component } from './utils/game-elements'

export class Tile extends Component {
  layer: LayersType
  tileID: TilesType
  x: number
  y: number

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
  isBlocked: boolean
  isVerified: boolean
  speed: number
  startFrame: number
  x: number
  y: number

  constructor (
    x: number,
    y: number
  ) {
    super()
    this.isBlocked = false
    this.isVerified = false
    this.speed = 0.05
    this.startFrame = 0
    this.x = x
    this.y = y
  }
}
