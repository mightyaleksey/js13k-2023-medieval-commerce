import { nullthrows } from './validate'

export const bgColor = '#472d3c'
export const gameMapWidth = 18
export const gameMapHeight = 14
// adds extra to support negative numbers for map borders
export const gameMapLength = (gameMapWidth + 4) * (gameMapHeight + 3)
export const gameTileWidth = 16

export const Tiles = {
  S_WATER_SHORE: 0,
  S_WATER_SHORE_I: 2000,
  S_WATER_DEPTH: 1,
  E_STORE_ENTRANCE_2: 2,
  E_TREE_FIR: 3,
  S_BG: 4,

  I_PLAYER: 6,
  I_NPC_0: 7,
  E_STORE_TOWER_1: 8,
  E_BRIDGE: 9,
  E_STORE_ENTRANCE_1: 10,
  E_TREE_BIRCH: 11,

  I_NPC_1: 14,
  I_NPC_2: 15,
  E_STORE_TOWER_0: 16,
  E_STORE_WALL: 17,
  E_STORE_ENTRANCE_0: 18,
  T_WOODEN_ROOF_H: 19,
  E_TABLE_1: 20,
  E_WOODEN_DOOR_LEFT: 21,
  I_SACK_GRAIN: 22,
  I_SACK_SALT: 23,
  S_ROAD_VERTICAL: 24,
  S_ROAD_VERTICAL_I: 2024,
  S_ROAD_HORIZONTAL: 1024,
  S_ROAD_HORIZONTAL_I: 3024,
  S_ROAD_CROSS: 25,
  S_ROAD_CROSS_T: 3025,
  E_WOODEN_WALL: 26,
  T_WOODEN_ROOF_V: 27,
  E_TABLE_0: 28,
  E_WOODEN_DOOR_RIGHT: 29
} as const

export type TileType = typeof Tiles[keyof typeof Tiles]

export type TileData = {
  [key: number]: HTMLImageElement
}

// getImageData with alpha: https://stackoverflow.com/a/15324845
export function genTileData (
  imageSrc: string,
  tileWidth: number,
  fn: (tileData: TileData) => void
): TileData {
  const tileData = {}
  const image = new Image()
  image.src = imageSrc
  image.onload = () => {
    const canvas = document.createElement('canvas')
    const ctx = nullthrows(canvas.getContext('2d'))
    ctx.imageSmoothingEnabled = false

    const halfTileWidth = tileWidth / 2

    Object.values(Tiles).forEach(tile => {
      const angle = Math.floor(tile / 1000)
      const coords = tile % 100
      const sourceX = gameTileWidth * (coords % 8)
      const sourceY = gameTileWidth * Math.floor(coords / 8)

      ctx.save()
      ctx.clearRect(0, 0, tileWidth, tileWidth)
      ctx.translate(halfTileWidth, halfTileWidth)
      ctx.rotate(angle * Math.PI / 2)
      ctx.translate(-halfTileWidth, -halfTileWidth)
      ctx.drawImage(
        image,
        sourceX, sourceY, gameTileWidth, gameTileWidth,
        0, 0, tileWidth, tileWidth
      )
      ctx.restore()

      // @ts-ignore
      tileData[tile] = new Image()
      // @ts-ignore
      tileData[tile].src = canvas.toDataURL('image/png')
    })

    fn(tileData)
  }

  return tileData
}
