// @ts-ignore
import * as t from '../tiles/tilemap_13k_23.json'
import { Resource } from './core/ecs/component'

export const WAGON = 25
export const SACK = 56
export const GRASS = 0
export const MEN = [67, 68, 70, 72, 74, 74, 75]
export const P_SELL = 59
export const P_SPAWN = 59
export const TREE_BOTTOM = 6
export const TREE_TOP = 2
export const TREE_SMALL = 11

export const I_COIN = 46

export const I_AXE = 53

// @ts-ignore
export const resourcesSprites: Record<Resource, number> = {
  wood: 50,
  box: 61,
  barrel: 66,
  water: 90
}

export const convertResToSprite = (res: Resource): number => {
  return resourcesSprites[res]
}

type MapSchema = {
  // FIXME remove  tileswide... etc
  layers:
    {tiles: [
      number,
      number,
      number,
      number?
    ][]
  }[]

}
const tilemap: MapSchema = t

export type TileInfo = {
  x: number;
  y: number;
  rot?: number;
  flipX?: boolean;
  tile: number;
}
type Map = {
  'floor': TileInfo[];
  'walls': TileInfo[];
  'top': TileInfo[];
}

const m = {
  floor: [],
  walls: [],
  top: []
}

for (const layer of tilemap.layers) {
  for (const t of layer.tiles) {
    const [tile, x, y, rot] = t
    // @ts-ignore
    m[layer.name].push({ x, y, rot, tile })
  }
}

export const map: Map = {
  floor: m.floor,
  walls: m.walls,
  top: m.top
}
