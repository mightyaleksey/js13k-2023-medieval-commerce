/* @flow */
import { Carrier, Character, Customer, Player } from '@/entities/character'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/game-elements'

import { States } from '@/utils/constants'
import { Tiles } from '@/utils/tiles'
import game from '@/state/game'

export class GameSystem extends System<void, Character | Sack> {
  constructor () {
    super()
    this._requiredEntities = [Character, Sack]
  }

  update () {
    switch (game.state) {
      case States.CleanUp:
        // clean up game state
        game.state = States.Preset
        this.entities.length = 0

        break

      case States.Preset: {
        // set initial game state
        game.fame = 50
        game.silver = 0
        game.state = States.Running

        const customer = new Customer()
        const customerTile = customer.components[0]
        customerTile.tileID = Tiles.CHARACTER_10
        customerTile.x = 12
        customerTile.y = -1

        this.entities.push(
          customer,
          new Carrier(),
          new Player(),
          new Sack()
        )

        break
      }
    }
  }
}
