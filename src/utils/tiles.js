/* @flow */
import type { Tile } from '../components'

import { invariant } from './guard'

export const bgColor = '#472d3c'
export const gameMapWidth = 18
export const gameMapHeight = 14
export const gameTileWidth = 16

export opaque type LayersType = number
export type LayersKeyType =
  | 'Object'
  | 'ObjectSmall'
  | 'Sky'
  | 'Surface'

export const Layers: {[LayersKeyType]: LayersType} = {
  Surface: 1,
  ObjectSmall: 2,
  Object: 4,
  Sky: 9
}

export opaque type TilesType = number
export type TilesKeyType =
  | 'WATER_SHORE_00'
  | 'WATER_SHORE_02'
  | 'WATER_DEPTH_00'
  | 'STONE_ENTRANCE_20'
  | 'TREE_FIR_00'
  | 'BG_00'
  | 'CHARACTER_00'
  | 'CHARACTER_10'
  | 'STONE_TOWER_10'
  | 'BRIDGE_00'
  | 'STONE_ENTRANCE_10'
  | 'TREE_BIRCH_00'
  | 'CHARACTER_20'
  | 'CHARACTER_30'
  | 'STONE_TOWER_00'
  | 'STONE_WALL_00'
  | 'STONE_ENTRANCE_00'
  | 'WOODEN_ROOF_H0'
  | 'TABLE_10'
  | 'WOODEN_DOOR_L0'
  | 'SACK_GRAIN_00'
  | 'SACK_SALT_00'
  | 'ROAD_00'
  | 'ROAD_01'
  | 'ROAD_02'
  | 'ROAD_03'
  | 'ROAD_CROSS_00'
  | 'ROAD_CROSS_01'
  | 'WOODEN_WALL_00'
  | 'WOODEN_ROOF_V0'
  | 'TABLE_00'
  | 'WOODEN_DOOR_R0'

export const Tiles: {[TilesKeyType]: TilesType} = {
  WATER_SHORE_00: 0,
  WATER_SHORE_02: 2000,
  WATER_DEPTH_00: 1,
  STONE_ENTRANCE_20: 2,
  TREE_FIR_00: 3,
  BG_00: 4,

  CHARACTER_00: 6,
  CHARACTER_10: 7,
  STONE_TOWER_10: 8,
  BRIDGE_00: 9,
  STONE_ENTRANCE_10: 10,
  TREE_BIRCH_00: 11,

  CHARACTER_20: 14,
  CHARACTER_30: 15,
  STONE_TOWER_00: 16,
  STONE_WALL_00: 17,
  STONE_ENTRANCE_00: 18,
  WOODEN_ROOF_H0: 19,
  TABLE_10: 20,
  WOODEN_DOOR_L0: 21,
  SACK_GRAIN_00: 22,
  SACK_SALT_00: 23,
  ROAD_00: 24,
  ROAD_01: 1024,
  ROAD_02: 2024,
  ROAD_03: 3024,
  ROAD_CROSS_00: 3025,
  ROAD_CROSS_01: 25,
  WOODEN_WALL_00: 26,
  WOODEN_ROOF_V0: 27,
  TABLE_00: 28,
  WOODEN_DOOR_R0: 29
}

export type TilesDataType = {
  [TilesType]: HTMLImageElement
}

// getImageData with alpha: https://stackoverflow.com/a/15324845
export function genTileData (
  imageURL: string,
  clientTileWidth: number,
  callback: (TilesDataType, HTMLImageElement) => mixed
): TilesDataType {
  const image = new window.Image()
  image.src = imageURL
  image.onload = () => {
    const canvas = document.createElement('canvas')
    canvas.width = clientTileWidth
    canvas.height = clientTileWidth
    const canvasContext = canvas.getContext('2d')
    canvasContext.imageSmoothingEnabled = false
    const halfWidth = clientTileWidth / 2

    Object.values(Tiles).forEach(tileID => {
      invariant(typeof tileID === 'number')
      const angle = Math.floor(tileID / 1000)
      const position = tileID % 100
      const sourceX = gameTileWidth * (position % 8)
      const sourceY = gameTileWidth * ((position / 8) >> 0)

      canvasContext.save()
      canvasContext.clearRect(0, 0, clientTileWidth, clientTileWidth)
      canvasContext.translate(halfWidth, halfWidth)
      canvasContext.rotate(angle * Math.PI / 2)
      canvasContext.translate(-halfWidth, -halfWidth)
      canvasContext.drawImage(
        image,
        sourceX, sourceY, gameTileWidth, gameTileWidth,
        0, 0, clientTileWidth, clientTileWidth
      )
      canvasContext.restore()

      // $FlowFixMe[incompatible-type]
      tilesData[tileID] = new window.Image()
      // $FlowFixMe[incompatible-type]
      tilesData[tileID].src = canvas.toDataURL('image/png')
    })

    callback(tilesData, image)
  }

  const tilesData: TilesDataType = {}
  return tilesData
}

function isCharacterTile (tile: Tile): boolean {
  return (
    tile.tileID === Tiles.CHARACTER_00 ||
    tile.tileID === Tiles.CHARACTER_10 ||
    tile.tileID === Tiles.CHARACTER_20 ||
    tile.tileID === Tiles.CHARACTER_30
  )
}

export function isObstacleTile (tile: Tile): boolean {
  return tile.layer % 2 === 0
}

export function compareTiles (
  left: Tile,
  right: Tile
): number {
  if (left.layer !== right.layer) return left.layer - right.layer
  if (left.x !== right.x) {
    if (isCharacterTile(left)) return -1
    if (isCharacterTile(right)) return 1
  }
  return left.y - right.y
}
