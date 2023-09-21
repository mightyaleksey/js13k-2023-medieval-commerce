/* @flow */
import { Entity } from '@/utils/game-elements'
import { Tile } from '../components'

import { Layers, Tiles } from '@/utils/tiles'
import { iterate } from '@/utils/helpers'

export class World extends Entity {
  components: $ReadOnlyArray<Tile>

  constructor () {
    super()

    const components =
    this.components = []

    // road
    iterate(-1, 19, z => {
      (z < 2 || (z > 6 && z < 13)) &&
      components.push(
        new Tile(12, z, Layers.Surface, z % 2 === 0
          ? Tiles.ROAD_00
          : Tiles.ROAD_02)
      )
      z !== 12 &&
      components.push(
        new Tile(z, 13, Layers.Surface, z % 2 === 0
          ? Tiles.ROAD_01
          : Tiles.ROAD_03)
      )
    })

    // water
    iterate(18, x => {
      components.push(
        new Tile(x, 3, Layers.Surface, Tiles.WATER_SHORE_00),
        new Tile(x, 4, Layers.Surface, Tiles.WATER_DEPTH_00),
        new Tile(x, 5, Layers.Surface, Tiles.WATER_SHORE_02)
      )
    })

    // road + bridge
    components.push(
      new Tile(12, 3, Layers.Surface, Tiles.BRIDGE_00),
      new Tile(12, 4, Layers.Surface, Tiles.BRIDGE_00),
      new Tile(12, 5, Layers.Surface, Tiles.BRIDGE_00),
      new Tile(12, 13, Layers.Surface, Tiles.ROAD_CROSS_00)
    )

    // walls
    iterate(18, x => {
      x !== 12 &&
      components.push(
        new Tile(x, 2, Layers.Object, x % 4 === 0
          ? Tiles.STONE_TOWER_00
          : Tiles.STONE_WALL_00)
      )

      x !== 12 && x % 4 === 0 &&
      components.push(
        new Tile(x, 1, Layers.Sky, Tiles.STONE_TOWER_10)
      )
    })

    // walls + entrance
    components.push(
      new Tile(11, 6, Layers.Object, Tiles.STONE_WALL_00),
      new Tile(13, 6, Layers.Object, Tiles.STONE_WALL_00),
      new Tile(12, 0, Layers.Sky, Tiles.STONE_ENTRANCE_20),
      new Tile(12, 1, Layers.Sky, Tiles.STONE_ENTRANCE_10),
      new Tile(12, 2, Layers.Surface, Tiles.STONE_ENTRANCE_00),
      new Tile(12, 5, Layers.Sky, Tiles.STONE_ENTRANCE_20),
      new Tile(12, 6, Layers.Surface, Tiles.STONE_ENTRANCE_00)
    )

    iterate(10, z => {
      components.push(
        new Tile(z, 6, Layers.Object, Tiles.WOODEN_WALL_00)
      )
      z !== 4 && z !== 5 &&
      components.push(
        new Tile(z, 12, Layers.Object, Tiles.WOODEN_WALL_00)
      )
      z < 5 &&
      components.push(
        new Tile(0, 7 + z, Layers.Object, Tiles.WOODEN_WALL_00)
      )

      z > 0 && z < 9 &&
      components.push(
        new Tile(z, 5, Layers.Sky, Tiles.WOODEN_ROOF_H0),
        new Tile(z, 11, Layers.Sky, Tiles.WOODEN_ROOF_H0)
      )

      z < 7 &&
      components.push(
        new Tile(0, 5 + z, Layers.Sky, Tiles.WOODEN_ROOF_V0)
      )
    })

    components.push(
      // wooden walls + roofs
      new Tile(9, 7, Layers.Object, Tiles.WOODEN_WALL_00),
      new Tile(9, 10, Layers.Object, Tiles.WOODEN_WALL_00),
      new Tile(9, 11, Layers.Object, Tiles.WOODEN_WALL_00),
      new Tile(4, 12, Layers.Surface, Tiles.WOODEN_DOOR_L0),
      new Tile(5, 12, Layers.Surface, Tiles.WOODEN_DOOR_R0),
      new Tile(9, 5, Layers.Sky, Tiles.WOODEN_ROOF_V0),
      new Tile(9, 6, Layers.Sky, Tiles.WOODEN_ROOF_V0),
      new Tile(9, 9, Layers.Sky, Tiles.WOODEN_ROOF_V0),
      new Tile(9, 10, Layers.Sky, Tiles.WOODEN_ROOF_V0),
      new Tile(9, 11, Layers.Sky, Tiles.WOODEN_ROOF_V0)
    )

    // polish touch
    components.push(
      // remaining walls
      new Tile(2, 0, Layers.Object, Tiles.WOODEN_WALL_00),
      new Tile(3, 0, Layers.Object, Tiles.WOODEN_WALL_00),
      new Tile(15, 0, Layers.Object, Tiles.WOODEN_WALL_00),
      new Tile(16, 0, Layers.Object, Tiles.WOODEN_WALL_00),
      new Tile(17, 0, Layers.Object, Tiles.WOODEN_WALL_00),
      // trees
      new Tile(1, 1, Layers.Object, Tiles.TREE_BIRCH_00),
      new Tile(2, 1, Layers.Object, Tiles.TREE_FIR_00),
      new Tile(3, 1, Layers.Object, Tiles.TREE_FIR_00),
      new Tile(8, 0, Layers.Object, Tiles.TREE_FIR_00),
      new Tile(9, 0, Layers.Object, Tiles.TREE_BIRCH_00),
      new Tile(11, 1, Layers.Object, Tiles.TREE_FIR_00),
      new Tile(13, 1, Layers.Object, Tiles.TREE_BIRCH_00),
      new Tile(15, 1, Layers.Object, Tiles.TREE_BIRCH_00),
      new Tile(17, 1, Layers.Object, Tiles.TREE_FIR_00),
      new Tile(15, 6, Layers.Object, Tiles.TREE_BIRCH_00),
      new Tile(16, 8, Layers.Object, Tiles.TREE_FIR_00),
      new Tile(14, 10, Layers.Object, Tiles.TREE_FIR_00),
      new Tile(15, 11, Layers.Object, Tiles.TREE_FIR_00),
      // table
      new Tile(11, 8, Layers.ObjectSmall, Tiles.TABLE_10),
      new Tile(11, 9, Layers.ObjectSmall, Tiles.TABLE_00)
    )

    // world borders
    iterate(-2, 20, z => {
      z > -1 && z < 18 && z !== 12 &&
      components.push(
        new Tile(z, -1, Layers.Object, Tiles.BG_00)
      )

      z > -2 && z < 19 &&
      components.push(
        new Tile(z, 14, Layers.Object, Tiles.BG_00)
      )

      z > -1 && z < 13 &&
      components.push(
        new Tile(-1, z, Layers.Object, Tiles.BG_00),
        new Tile(18, z, Layers.Object, Tiles.BG_00)
      )
    })

    components.push(
      new Tile(12, -2, Layers.Object, Tiles.BG_00),
      new Tile(-2, 13, Layers.Object, Tiles.BG_00),
      new Tile(19, 13, Layers.Object, Tiles.BG_00)
    )
  }
}
