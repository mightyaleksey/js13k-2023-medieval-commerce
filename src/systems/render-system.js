/* @flow */
import type { TilesDataType } from '@/utils/tiles'

import { Interface } from '@/entities/interface'

import { Menu, Tile } from '../components'
import { System } from '@/utils/game-elements'

import {
  Layers,
  bgColor,
  gameMapWidth, gameMapHeight,
  compareTiles, genTileData
} from '@/utils/tiles'
import { invariant } from '@/utils/guard'
import game from '@/state/game'

const borderWidth = 2

export class RenderSystem extends System<Tile, Interface> {
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
    this._requiredEntities = [Interface]

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

  _renderScrim (
    x: number, y: number,
    w: number, h: number,
    opacity?: number
  ) {
    const canvasContext = this._canvasContext
    const clientTileWidth = this._clientTileWidth

    canvasContext.globalAlpha = opacity ?? 0.5
    canvasContext.fillStyle = bgColor
    canvasContext.fillRect(
      clientTileWidth * x, clientTileWidth * y,
      clientTileWidth * w, clientTileWidth * h
    )
    canvasContext.globalAlpha = 1
  }

  _renderText (
    x: number,
    y: number,
    text: string,
    textStyle?: 'b' | 'm' | 's',
    width?: number
  ) {
    const canvasContext = this._canvasContext
    const clientTileWidth = this._clientTileWidth

    const fontSize = (
      (textStyle === 'b'
        ? 1.4
        : textStyle === 'm'
          ? 0.7
          : 0.6
      ) * clientTileWidth
    ) >> 0

    canvasContext.fillStyle =
      textStyle === 'b' ? '#38d973' : '#e6e2da'
    canvasContext.font =
      textStyle === 'b'
        ? `bold ${fontSize}px georgia, serif`
        : textStyle === 'm'
          ? `small-caps ${fontSize}px helvetica, sans-serif`
          : `${fontSize}px georgia, serif`

    if (width == null) {
      canvasContext.fillText(
        text,
        (clientTileWidth * x) >> 0,
        (clientTileWidth * y) >> 0
      )
      return
    }

    const lines = text.split('\n')

    const cx = (clientTileWidth * x) >> 0
    let cy = (clientTileWidth * y) >> 0

    lines.forEach(currentLine => {
      const words = currentLine.split(' ')
      let line = ''

      for (let n = 0; n < words.length; ++n) {
        const testLine = line + words[n] + ' '
        if (canvasContext.measureText(testLine).width < clientTileWidth * width) {
          line = testLine
        } else {
          canvasContext.fillText(
            line,
            cx, cy
          )
          cy += fontSize * 1.3
          line = words[n] + ' '
        }
      }

      canvasContext.fillText(
        line,
        cx, cy
      )
      cy += fontSize * 1.3
    })
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
      .sort(compareTiles)
      .forEach(tile => {
        const offsetX = borderLeft + clientTileWidth * tile.x
        const offsetY = borderTop + clientTileWidth * tile.y

        const image = tilesData[tile.tileID]
        invariant(image != null, 'Invalid tileID')

        if (tile.layer === Layers.Effect) canvasContext.globalAlpha = 0.8

        canvasContext.drawImage(
          image,
          offsetX, offsetY
        )

        if (tile.layer === Layers.Effect) canvasContext.globalAlpha = 1
      })

    // render stats
    this._renderScrim(0.4, 0.2, 6.1, 0.9)
    this._renderText(0.5, 0.8, `silver: ${game.silver}`, 's')
    this._renderText(3.7, 0.8, `fame: ${game.fame}`, 's')

    // $FlowFixMe[incompatible-type]
    const menu: ?Menu = this.entities[0]?.components[0]
    if (menu != null) {
      this._renderScrim(0, 0, gameMapWidth, gameMapHeight, 0.85)
      this._renderText(1, 4, menu.title, 'b')
      this._renderText(1, 6, menu.body, 'm', gameMapWidth - 2)
    }
  }
}
