/* @flow */
import { Carrier } from '@/entities/character'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/game-elements'
import { Tile } from '../components'

import { Actions, States } from '@/utils/constants'
import { Tiles } from '@/utils/tiles'
import { genObstacleKey, genObstacleMap, goTo } from '@/utils/walk'
import { genEntity, isInstanceOf, random } from '@/utils/helpers'
import { nullthrows } from '@/utils/guard'
import game from '@/state/game'

const tilesToGenerate = [
  Tiles.SACK_SALT_00,
  Tiles.SACK_GRAIN_00
]

export class SupplySystem extends System<Tile, Carrier | Sack> {
  constructor () {
    super()
    this._requiredComponents = [Tile]
    this._requiredEntities = [Carrier, Sack]
  }

  update (elapsedFrames: number, totalFrames: number) {
    if (game.state !== States.Running) return

    // $FlowFixMe[incompatible-type]
    const carrier: Carrier = nullthrows(
      this.entities.find(carrier => isInstanceOf(carrier, Carrier))
    )

    const [tile, , walk, haul, action] = carrier.components

    switch (action.type) {
      case Actions.Idle: {
        tile.x = -1
        tile.y = 13
        action.elapsedFrames += elapsedFrames
        if (action.elapsedFrames < 10) break

        // generate sack
        const tileID = tilesToGenerate[random(tilesToGenerate.length - 1)]
        const sack = genEntity(Sack, -2, 13, tileID)
        this.entities.push(sack)

        haul.tile = sack.components[0]

        action.elapsedFrames = 0
        action.type = Actions.CarrierGoStorage
        break
      }

      case Actions.CarrierGoStorage:
        if (tile.x < 4) {
          goTo(walk, tile.x + 1, 13)
        }

        if (tile.x === 4) {
          // x[1:8], y[7:11]
          const obstacleMap = genObstacleMap(this.components)

          let x = random(1, 8)
          let y = random(8, 11)
          while (obstacleMap[genObstacleKey(x, y)] === 1) {
            x = random(1, 8)
            y = random(8, 11)
          }

          // throw sack
          // todo add animation
          const sackTile = nullthrows(haul.tile)
          sackTile.x = x
          sackTile.y = y
          haul.tile = null

          action.type = Actions.CarrierLeave
        }

        break

      case Actions.CarrierLeave:
        if (tile.x > -1) {
          goTo(walk, tile.x - 1, 13)
        }

        if (tile.x === -1) {
          const obstacleMap = genObstacleMap(this.components)

          let space = 0
          for (let x = 1; x <= 8; ++x) {
            for (let y = 8; y <= 11; ++y) {
              if (obstacleMap[genObstacleKey(x, y)] !== 1) space++
            }
          }

          if (space > 10) {
            action.type = Actions.Idle
          }
        }

        break
    }
  }
}
