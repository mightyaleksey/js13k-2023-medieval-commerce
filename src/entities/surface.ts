import { Entity } from '@/utils/elements'

import { Tile } from '../components'
import { Layers } from '@/utils/layers'
import { Tiles } from '@/utils/tiles'

import { iterate } from '@/utils/helpers'

export class Surface extends Entity {
  constructor () {
    super()

    iterate(18, x => {
      this.components.push(
        new Tile(x, 3, Layers.Surface, Tiles.S_WATER_SHORE),
        new Tile(x, 4, Layers.Surface, Tiles.S_WATER_DEPTH),
        new Tile(x, 5, Layers.Surface, Tiles.S_WATER_SHORE_I)
      )

      x < 12 && // 0, 12
      this.components.push(
        new Tile(x, 13, Layers.Surface, x % 2 === 0
          ? Tiles.S_ROAD_HORIZONTAL
          : Tiles.S_ROAD_HORIZONTAL_I)
      )

      x > 12 && // 13, 18
      this.components.push(
        new Tile(x, 13, Layers.Surface, x % 2 === 0
          ? Tiles.S_ROAD_HORIZONTAL
          : Tiles.S_ROAD_HORIZONTAL_I)
      )

      x < 10 &&
      this.components.push(
        new Tile(x, 6, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL)
      )

      x !== 4 && x !== 5 && x < 10 &&
      this.components.push(
        new Tile(x, 12, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL)
      )
    })

    iterate(7, 13, y => {
      this.components.push(
        new Tile(12, y, Layers.Surface, y % 2 === 0
          ? Tiles.S_ROAD_VERTICAL
          : Tiles.S_ROAD_VERTICAL_I)
      )
    })

    iterate(3, 6, y => {
      this.components.push(
        new Tile(12, y, Layers.Surface, Tiles.E_BRIDGE)
      )
    })

    this.components.push(
      new Tile(12, 13, Layers.Surface, Tiles.S_ROAD_CROSS_T),
      new Tile(12, 2, Layers.Surface, Tiles.E_STORE_ENTRANCE_0),
      new Tile(12, 6, Layers.Surface, Tiles.E_STORE_ENTRANCE_0),

      new Tile(4, 12, Layers.Surface, Tiles.E_WOODEN_DOOR_LEFT),
      new Tile(5, 12, Layers.Surface, Tiles.E_WOODEN_DOOR_RIGHT),

      // objects
      new Tile(0, 1, Layers.Tops, Tiles.E_STORE_TOWER_1),
      new Tile(0, 2, Layers.ObjectsBelow, Tiles.E_STORE_TOWER_0),
      new Tile(1, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(2, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(3, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(4, 1, Layers.Tops, Tiles.E_STORE_TOWER_1),
      new Tile(4, 2, Layers.ObjectsBelow, Tiles.E_STORE_TOWER_0),
      new Tile(5, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(6, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(7, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(8, 1, Layers.Tops, Tiles.E_STORE_TOWER_1),
      new Tile(8, 2, Layers.ObjectsBelow, Tiles.E_STORE_TOWER_0),
      new Tile(9, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(10, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(11, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      // entrance
      new Tile(13, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(14, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(15, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(16, 1, Layers.Tops, Tiles.E_STORE_TOWER_1),
      new Tile(16, 2, Layers.ObjectsBelow, Tiles.E_STORE_TOWER_0),
      new Tile(17, 2, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      // after bridge
      new Tile(11, 6, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      new Tile(13, 6, Layers.ObjectsBelow, Tiles.E_STORE_WALL),
      // trees
      new Tile(1, 1, Layers.ObjectsBelow, Tiles.E_TREE_BIRCH),
      new Tile(2, 1, Layers.ObjectsBelow, Tiles.E_TREE_FIR),
      new Tile(3, 1, Layers.ObjectsBelow, Tiles.E_TREE_FIR),
      new Tile(8, 0, Layers.ObjectsBelow, Tiles.E_TREE_FIR),
      new Tile(9, 0, Layers.ObjectsBelow, Tiles.E_TREE_BIRCH),
      new Tile(11, 1, Layers.ObjectsBelow, Tiles.E_TREE_FIR),
      new Tile(13, 1, Layers.ObjectsBelow, Tiles.E_TREE_BIRCH),
      new Tile(15, 1, Layers.ObjectsBelow, Tiles.E_TREE_BIRCH),
      new Tile(15, 6, Layers.ObjectsBelow, Tiles.E_TREE_BIRCH),
      new Tile(17, 1, Layers.ObjectsBelow, Tiles.E_TREE_FIR),
      // wooden walls
      new Tile(2, 0, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL),
      new Tile(3, 0, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL),
      new Tile(15, 0, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL),
      new Tile(16, 0, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL),
      new Tile(17, 0, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL)
    )

    iterate(7, 12, y => {
      this.components.push(
        new Tile(0, y, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL)
      )
    })

    this.components.push(
      new Tile(9, 7, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL),
      new Tile(9, 10, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL),
      new Tile(9, 11, Layers.ObjectsBelow, Tiles.E_WOODEN_WALL),
      new Tile(11, 8, Layers.ObjectsBelow, Tiles.E_TABLE_1),
      new Tile(11, 9, Layers.ObjectsBelow, Tiles.E_TABLE_0),

      // tops
      new Tile(12, 0, Layers.Tops, Tiles.E_STORE_ENTRANCE_2),
      new Tile(12, 1, Layers.Tops, Tiles.E_STORE_ENTRANCE_1),
      new Tile(12, 5, Layers.Tops, Tiles.E_STORE_ENTRANCE_2),
      // roofs
      new Tile(9, 5, Layers.Tops, Tiles.T_WOODEN_ROOF_V),
      new Tile(9, 6, Layers.Tops, Tiles.T_WOODEN_ROOF_V),
      new Tile(9, 9, Layers.Tops, Tiles.T_WOODEN_ROOF_V),
      new Tile(9, 10, Layers.Tops, Tiles.T_WOODEN_ROOF_V),
      new Tile(9, 11, Layers.Tops, Tiles.T_WOODEN_ROOF_V)
    )

    iterate(5, 12, y => {
      this.components.push(
        new Tile(0, y, Layers.Tops, Tiles.T_WOODEN_ROOF_V),
        new Tile(0, y, Layers.Tops, Tiles.T_WOODEN_ROOF_V)
      )
    })

    iterate(1, 9, x => {
      this.components.push(
        new Tile(x, 5, Layers.Tops, Tiles.T_WOODEN_ROOF_H),
        new Tile(x, 11, Layers.Tops, Tiles.T_WOODEN_ROOF_H)
      )
    })

    /* map borders */

    iterate(-1, 19, x => {
      x !== 12 && this.components.push(
        new Tile(x, -1, Layers.ObjectsBelow, Tiles.S_BG)
      )

      this.components.push(
        new Tile(x, 14, Layers.ObjectsBelow, Tiles.S_BG)
      )
    })

    iterate(13, y => {
      this.components.push(
        new Tile(-1, y, Layers.ObjectsBelow, Tiles.S_BG),
        new Tile(18, y, Layers.ObjectsBelow, Tiles.S_BG)
      )
    })

    this.components.push(
      new Tile(12, -2, Layers.ObjectsBelow, Tiles.S_BG),
      new Tile(-2, 13, Layers.ObjectsBelow, Tiles.S_BG),
      new Tile(19, 13, Layers.ObjectsBelow, Tiles.S_BG)
    )
  }
}
