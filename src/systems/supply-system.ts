import { Provider } from '@/entities/provider'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/elements'
import { Direction, Grab, Haul, State, Tile, Throw, Walk } from '../components'

import { States } from '@/utils/states'
import { Tiles } from '@/utils/tiles'
import { findInstance } from '@/utils/helpers'
import { getElapsedFrames, genObstacleMap, genObstacleKey } from '@/utils/collision'
import { nullthrows } from '@/utils/validate'

const waitBeforeStart = 10
const tilesToGenerate = [
  Tiles.I_SACK_SALT,
  Tiles.I_SACK_GRAIN
]

export class SupplySystem extends System {
  components?: Array<Tile | Walk>
  entities?: Array<Provider | Sack>

  constructor () {
    super()

    this._requiredComponents = [Tile, Walk]
    this._requiredEntities = [Provider]
  }

  update (elapsedFrames: number, totalFrames: number) {
    const provider = nullthrows(
      findInstance(this.entities!, Provider)
    )

    const tile = provider.components[0] as Tile
    const direction = provider.components[1] as Direction
    const state = provider.components[2] as State

    const walk = findInstance(provider.components, Walk)

    switch (state.stage) {
      case States.Idle: {
        if (state.startFrame === 0) state.startFrame = totalFrames
        if (getElapsedFrames(totalFrames, state.startFrame) > waitBeforeStart) {
          state.startFrame = 0
          state.stage = States.Start
        }

        break
      }

      case States.Start: {
        direction.angle = 0
        tile.x = -2
        tile.y = 10

        const sack = new Sack()
        const sackTile = sack.components[0] as Tile
        sackTile.x = -2
        sackTile.y = 9
        sackTile.tileID = tilesToGenerate[
          Math.round(Math.random() * (tilesToGenerate.length - 1))
        ]
        this.entities!.push(sack)

        provider.components.push(
          new Grab()
        )

        state.stage = States.GoStorage

        break
      }

      case States.GoStorage: {
        const haul = findInstance(provider.components, Haul)
        if (haul == null) break
        if (walk != null) break

        if (tile.y < 13) {
          tile.x = -1
          tile.y = 13
        }

        if (tile.x < 4) {
          provider.components.push(
            new Walk(tile.x + 1, tile.y, tile)
          )
        }

        if (tile.x === 4) {
          // x[1:8], y[7:11]
          const obstacleMap = genObstacleMap(this.components!)

          let x = Math.round(Math.random() * 7) + 1
          let y = Math.round(Math.random() * 3) + 8
          while (obstacleMap[genObstacleKey(x, y)] === 1) {
            x = Math.round(Math.random() * 7) + 1
            y = Math.round(Math.random() * 3) + 8
          }

          provider.components.push(
            new Throw(x, y)
          )

          state.stage = States.GoHome
        }

        break
      }

      case States.GoHome: {
        if (walk != null) break

        if (tile.x > -1) {
          provider.components.push(
            new Walk(tile.x - 1, tile.y, tile)
          )
        }

        if (tile.x === -1) {
          state.stage = States.Done
          state.startFrame = 0
        }

        break
      }

      case States.Done: {
        const obstacleMap = genObstacleMap(this.components!)
        let space = 0
        for (let x = 1; x <= 8; ++x) {
          for (let y = 8; y <= 11; ++y) {
            if (obstacleMap[genObstacleKey(x, y)] !== 1) space++
          }
        }

        if (space > 10) {
          state.stage = States.Start
        }

        break
      }
    }
  }
}
