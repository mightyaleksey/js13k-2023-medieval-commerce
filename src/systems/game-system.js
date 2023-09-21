/* @flow */
import { Carrier, Character, Customer, Player } from '@/entities/character'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/game-elements'

import { States } from '@/utils/constants'
import { Tiles } from '@/utils/tiles'
import { genEntity, iterate } from '@/utils/helpers'
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

        iterate(5, 9, x => {
          const tileID = x < 7 ? Tiles.SACK_GRAIN_00 : Tiles.SACK_SALT_00
          const sack = genEntity(Sack, x, 7, tileID)
          this.entities.push(sack)
        })

        // todo add helper to generate entity with custom tile
        const customer = genEntity(Customer, 12, -1, Tiles.CHARACTER_10)
        this.entities.push(customer)

        this.entities.push(
          new Carrier(),
          new Player()
        )

        break
      }
    }
  }
}
