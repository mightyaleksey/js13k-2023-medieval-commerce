import type { LayerType } from './utils/layers'
import type { StateType } from './utils/states'
import type { TileType } from './utils/tiles'

import { Component } from './utils/elements'

export class Tile extends Component {
  x: number
  y: number
  layer: LayerType
  tileID: TileType

  constructor (
    x: number,
    y: number,
    layer: LayerType,
    tileID: TileType
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

  constructor (angle: number) {
    super()

    this.angle = angle
  }
}

export class Delay extends Component {
  frames: number
  startFrame: number

  constructor (
    frames: number,
    startFrame: number
  ) {
    super()

    this.frames = frames
    this.startFrame = startFrame
  }
}

export class Drop extends Component {}

export class Grab extends Component {}

export class Haul extends Component {
  player: Tile
  sack: Tile
  direction: Direction

  constructor (
    player: Tile,
    sack: Tile,
    direction: Direction
  ) {
    super()

    this.player = player
    this.sack = sack
    this.direction = direction
  }
}

export class State extends Component {
  stage: StateType
  startFrame: number

  constructor (stage: StateType) {
    super()

    this.stage = stage
    this.startFrame = 0
  }
}

export class Walk extends Component {
  x: number
  y: number
  tile: Tile

  isBlocked: boolean
  isValidated: boolean
  startFrame: number

  constructor (x: number, y: number, tile: Tile) {
    super()

    this.x = x
    this.y = y
    this.tile = tile

    this.isBlocked = false
    this.isValidated = false
    this.startFrame = 0
  }
}
