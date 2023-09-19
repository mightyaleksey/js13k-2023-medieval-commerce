/* @flow */
import type { ActionsType } from './utils/constants'
import type { LayersType, TilesType } from '@/utils/tiles'

import { Actions } from './utils/constants'
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
  isActive: boolean
  isBlocked: boolean
  isVerified: boolean
  speed: number
  startFrame: number
  x: number
  y: number

  constructor () {
    super()
    this.isActive = false
    this.isBlocked = false
    this.isVerified = false
    this.speed = 0.05
    this.startFrame = 0
    this.x = 0
    this.y = 0
  }
}

export class Haul extends Component {
  tile: ?Tile

  constructor () {
    super()
    this.tile = null
  }
}

export class Action extends Component {
  type: ActionsType

  constructor () {
    super()
    this.type = Actions.Idle
  }
}
