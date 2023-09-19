/* @flow */
import { Carrier, Character, Player } from '@/entities/character'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/game-elements'

import { States } from '@/utils/constants'
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

      case States.Preset:
        // set initial game state
        game.state = States.Running
        this.entities.push(
          new Carrier(),
          new Player(),
          new Sack()
        )

        break
    }
  }
}
