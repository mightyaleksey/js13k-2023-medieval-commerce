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

    iterate(18, x => {
      components.push(
        new Tile(x, 3, Layers.Surface, Tiles.WATER_SHORE_00),
        new Tile(x, 4, Layers.Surface, Tiles.WATER_DEPTH_00),
        new Tile(x, 5, Layers.Surface, Tiles.WATER_SHORE_02)
      )
    })
  }
}
