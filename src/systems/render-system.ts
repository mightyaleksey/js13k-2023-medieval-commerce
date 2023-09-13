import type { TileData } from '@/utils/tiles'

import { Menu } from '@/entities/menu'
import { Header, Paragraph, Tile } from '../components'
import { System } from '@/utils/elements'
import game from '@/state/game'

import { Layers } from '@/utils/layers'
import { bgColor, gameMapHeight, gameMapWidth, genTileData } from '@/utils/tiles'
import { isInstance } from '@/utils/helpers'
import { nullthrows } from '@/utils/validate'

export class RenderSystem extends System {
  _canvas: HTMLCanvasElement
  _canvasContext: CanvasRenderingContext2D
  _tileData: TileData
  _tileWidth: number
  _isReady: boolean

  components?: Tile[]
  entities?: Menu[]

  constructor () {
    super()

    this._requiredComponents = [Tile]
    this._requiredEntities = [Menu]

    this._canvas = nullthrows(document.querySelector('#canvas')) as HTMLCanvasElement
    // normalize viewport
    this._canvas.width = this._canvas.clientWidth
    this._canvas.height = this._canvas.clientHeight

    const tileWidth = this._tileWidth =
      Math.round(this._canvas.width / gameMapWidth)

    this._isReady = false
    this._tileData = genTileData('tiles.png', tileWidth, _ => {
      this._isReady = true
    })

    const ctx = this._canvasContext =
      nullthrows(this._canvas.getContext('2d'))
    ctx.font = `${Math.round(tileWidth * 0.6)}px georgia`
    ctx.imageSmoothingEnabled = false
  }

  _renderScrim (
    x: number, y: number,
    w: number, h: number,
    opacity?: number
  ) {
    const ctx = this._canvasContext
    const tileWidth = this._tileWidth

    ctx.globalAlpha = opacity ?? 0.5
    ctx.fillStyle = bgColor
    ctx.fillRect(
      tileWidth * x, tileWidth * y,
      tileWidth * w, tileWidth * h
    )
    ctx.globalAlpha = 1
  }

  _renderText (
    x: number,
    y: number,
    text: string,
    textStyle?: 'b' | 'm' | 's',
    width?: number
  ) {
    const ctx = this._canvasContext
    const tileWidth = this._tileWidth

    const fontSize = (
      (textStyle === 'b'
        ? 1.4
        : textStyle === 'm'
          ? 0.7
          : 0.6
      ) * tileWidth
    ) >> 0

    ctx.fillStyle =
      textStyle === 'b' ? '#38d973' : '#e6e2da'
    ctx.font =
      textStyle === 'b'
        ? `bold ${fontSize}px georgia, serif`
        : textStyle === 'm'
          ? `small-caps ${fontSize}px helvetica, sans-serif`
          : `${fontSize}px georgia, serif`

    if (width == null) {
      ctx.fillText(
        text,
        (tileWidth * x) >> 0,
        (tileWidth * y) >> 0
      )
      return
    }

    const lines = text.split('\n')

    const cx = (tileWidth * x) >> 0
    let cy = (tileWidth * y) >> 0

    lines.forEach(currentLine => {
      const words = currentLine.split(' ')
      let line = ''

      for (let n = 0; n < words.length; ++n) {
        const testLine = line + words[n] + ' '
        if (ctx.measureText(testLine).width < tileWidth * width) {
          line = testLine
        } else {
          ctx.fillText(
            line,
            cx, cy
          )
          cy += fontSize * 1.3
          line = words[n] + ' '
        }
      }

      ctx.fillText(
        line,
        cx, cy
      )
      cy += fontSize * 1.3
    })
  }

  update () {
    if (!this._isReady) return

    const ctx = this._canvasContext
    const tileData = this._tileData
    const tileWidth = this._tileWidth

    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, this._canvas.width, this._canvas.height)

    // 191 elements
    // 491 filtering
    // 767 with sort
    // 955 layers x elements

    this.components!.sort((a, b) => a.layer - b.layer)
      .forEach(tile => {
        const offsetX = tileWidth * tile.x
        const offsetY = tileWidth * tile.y

        const imageTile = nullthrows(
          tileData[nullthrows(tile.tileID, 'No tileID')],
          'No tile for ' + tile.tileID
        )

        if (tile.layer === Layers.Visual) ctx.globalAlpha = 0.7

        ctx.drawImage(
          imageTile,
          offsetX, offsetY
        )

        if (tile.layer === Layers.Visual) ctx.globalAlpha = 1
      })

    this._renderScrim(
      0.4, 0.2,
      6.1, 0.9
    )

    this._renderText(
      0.5, 0.8,
      `silver: ${game.silver}`, 's'
    )

    this._renderText(
      3.7, 0.8,
      `fame: ${game.fame}`, 's'
    )

    const menu = this.entities![0]
    if (menu != null) {
      this._renderScrim(
        0, 0,
        gameMapWidth, gameMapHeight,
        // 0.5, 2.5,
        // gameMapWidth - 1, gameMapHeight - 5,
        0.85
      )

      menu.components.forEach(component => {
        if (isInstance(component, Header)) {
          this._renderText(
            1, 4,
            (component as Header).text, 'b'
          )
        }

        if (isInstance(component, Paragraph)) {
          this._renderText(
            1, 6,
            (component as Paragraph).text, 'm',
            gameMapWidth - 2
          )
        }
      })
    }
  }
}
