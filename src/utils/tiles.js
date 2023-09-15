/* @flow */
import { Tile } from '../components'

import { invariant } from './guard'

export const bgColor = '#472d3c'
export const gameMapWidth = 18
export const gameMapHeight = 14
export const gameTileWidth = 16

export const Layers: {
  Surface: 1,
  Objects: 4
} = {
  Surface: 1,
  Objects: 4
}

export type LayersType = $Values<typeof Layers>

export function isObstacle (tile: Tile): boolean {
  return tile.layer % 2 === 0
}

export const Tiles: {
  WATER_SHORE_00: 0,
  WATER_SHORE_02: 2000,
  WATER_DEPTH_00: 1,
  STONE_ENTRANCE_20: 2,
  TREE_FIR_00: 3,
  BG_00: 4,

  CHARACTER_00: 6,
  CHARACTER_10: 7,
  STORE_TOWER_10: 8,
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
} = {
  WATER_SHORE_00: 0,
  WATER_SHORE_02: 2000,
  WATER_DEPTH_00: 1,
  STONE_ENTRANCE_20: 2,
  TREE_FIR_00: 3,
  BG_00: 4,

  CHARACTER_00: 6,
  CHARACTER_10: 7,
  STORE_TOWER_10: 8,
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

export type TilesType = $Values<typeof Tiles>

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
