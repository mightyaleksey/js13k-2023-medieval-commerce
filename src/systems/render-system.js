/* @flow */
import type { TilesDataType } from '@/utils/tiles'

import { System } from '@/utils/game-elements'
import { Tile } from '../components'

import { bgColor, gameMapWidth, gameMapHeight, genTileData } from '@/utils/tiles'
import { invariant } from '@/utils/guard'

const borderWidth = 2

export class RenderSystem extends System<Tile, void> {
  _canvas: HTMLCanvasElement
  _canvasContext: CanvasRenderingContext2D

  _borderLeft: number
  _borderTop: number
  _clientTileWidth: number
  _isReady: boolean
  _tilesData: TilesDataType

  constructor () {
    super()
    this._requiredComponents = [Tile]

    const canvas = document.querySelector('#canvas')
    invariant(canvas instanceof window.HTMLCanvasElement)
    this._canvas = canvas

    // normalize viewport
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    const clientTileWidth = this._clientTileWidth =
      Math.round((canvas.clientWidth - borderWidth * 2) / gameMapWidth)

    this._borderLeft = ((canvas.clientWidth - clientTileWidth * gameMapWidth) / 2) >> 0
    this._borderTop = ((canvas.clientHeight - clientTileWidth * gameMapHeight) / 2) >> 0

    this._isReady = false
    this._tilesData = genTileData(
      'tiles.png',
      clientTileWidth,
      img => { this._isReady = true }
    )

    this._canvasContext = canvas.getContext('2d')
    this._canvasContext.imageSmoothingEnabled = false
  }

  update () {
    if (!this._isReady) return

    const canvas = this._canvas
    const canvasContext = this._canvasContext

    const borderLeft = this._borderLeft
    const borderTop = this._borderTop
    const clientTileWidth = this._clientTileWidth
    const tilesData = this._tilesData

    canvasContext.fillStyle = bgColor
    canvasContext.fillRect(
      0, 0,
      canvas.width, canvas.height
    )

    this.components
      .sort((a, b) => a.layer !== b.layer
        ? a.layer - b.layer
        : a.y - b.y)
      .forEach(tile => {
        const offsetX = borderLeft + clientTileWidth * tile.x
        const offsetY = borderTop + clientTileWidth * tile.y

        const image = tilesData[tile.tileID]

        canvasContext.drawImage(
          image,
          offsetX, offsetY
        )
      })
  }
}
