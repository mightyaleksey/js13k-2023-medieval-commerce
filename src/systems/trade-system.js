/* @flow */
import { Customer } from '@/entities/character'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/game-elements'
import { Tile } from '../components'

import { Actions, States } from '@/utils/constants'
import { Layers, Tiles } from '@/utils/tiles'
import { goTo } from '@/utils/walk'
import { isInstanceOf } from '@/utils/helpers'
import game from '@/state/game'

export class TradeSystem extends System<void, Customer | Sack> {
  constructor () {
    super()
    this._requiredEntities = [Customer, Sack]
  }

  update (elapsedFrames: number, totalFrames: number) {
    if (game.state !== States.Running) return

    const sacks = this.entities.filter(sack => isInstanceOf(sack, Sack))

    this.entities.forEach(customer => {
      if (!isInstanceOf(customer, Customer)) return

      const [tile, direction, walk, haul, action] = customer.components
      const isWizard = tile.tileID === Tiles.CHARACTER_10

      switch (action.type) {
        case Actions.Idle:
          tile.x = 12
          tile.y = -1
          action.elapsedFrames += elapsedFrames
          if (action.elapsedFrames < 100) break

          action.type = Actions.CustomerGoShopping
          break

        case Actions.CustomerGoShopping: {
          const ty = isWizard ? 9 : 8

          if (tile.y < ty) {
            goTo(walk, 12, tile.y + 1)
          }

          if (tile.y === ty) {
            action.elapsedFrames += elapsedFrames
            if (action.elapsedFrames < 15) break

            direction.angle = 3
            action.elapsedFrames = 0
            action.type = Actions.CustomerRequest
          }

          break
        }

        case Actions.CustomerRequest: {
          if (customer.components[5] == null) {
            const tileID = isWizard ? Tiles.SACK_SALT_00 : Tiles.SACK_GRAIN_00

            customer.components[5] =
              new Tile(tile.x - 1, tile.y, Layers.Effect, tileID)
          }

          const requestedSackTile = customer.components[5]
          const availableSack = sacks.find(sack => {
            const sackTile = sack.components[0]
            return (
              sackTile.tileID === requestedSackTile.tileID &&
              sackTile.x === requestedSackTile.x &&
              sackTile.y === requestedSackTile.y
            )
          })

          action.elapsedFrames += elapsedFrames
          if (availableSack == null && action.elapsedFrames < 100) break

          if (availableSack != null) {
            game.fame += 5
            game.silver += 10
            haul.tile = availableSack.components[0]
          } else {
            game.fame -= 10
          }

          // $FlowFixMe[prop-missing] components is read-only array (tuple)
          customer.components.pop()
          action.type = Actions.CustomerLeave
          break
        }

        case Actions.CustomerLeave:
          if (isWizard) {
            if (tile.y < 13) goTo(walk, 12, tile.y + 1)
            else if (tile.x < 18) goTo(walk, 18, 13)
          } else {
            if (tile.x < 13) goTo(walk, tile.x + 1, 8)
            else if (tile.y < 12) goTo(walk, 13, tile.y + 1)
            else if (tile.x < 17) goTo(walk, tile.x + 1, 12)
            else if (tile.y < 13) goTo(walk, 17, tile.y + 1)
            else if (tile.x < 18) goTo(walk, tile.x + 1, 13)
          }

          if (tile.x === 18) {
            if (haul.tile != null) {
              // remove sack
              const sackTile = haul.tile
              const sackIndex = this.entities.findIndex(sack => sack.components[0] === sackTile)
              this.entities.splice(sackIndex, 1)

              haul.tile = null
            }

            action.type = Actions.Idle
          }

          break
      }
    })
  }
}
