/* @flow */
import { Carrier, Character, Customer, Player } from '@/entities/character'
import { Interface } from '@/entities/interface'
import { Menu } from '../components'
import { Sack } from '@/entities/sack'
import { System } from '@/utils/game-elements'

import { States } from '@/utils/constants'
import { Tiles } from '@/utils/tiles'
import { genEntity, isInstanceOf, iterate } from '@/utils/helpers'
import { headerText, introText, helpText, defeatText, victoryText } from '@/utils/texts'
import { nullthrows } from '@/utils/guard'

import game from '@/state/game'

export class GameSystem extends System<void, Character | Interface | Sack> {
  constructor () {
    super()
    this._requiredEntities = [Character, Interface, Sack]
  }

  update () {
    // $FlowFixMe[incompatible-type]
    const it: ?Interface = this.entities.find(it => isInstanceOf(it, Interface))

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
        game.state = States.Intro1

        iterate(5, 9, x => {
          const tileID = x < 7 ? Tiles.SACK_GRAIN_00 : Tiles.SACK_SALT_00
          const sack = genEntity(Sack, x, 7, tileID)
          this.entities.push(sack)
        })

        const customer1 = genEntity(Customer, 12, -1, Tiles.CHARACTER_10)
        const customer2 = genEntity(Customer, 12, -1, Tiles.CHARACTER_30)
        customer2.components[4].elapsedFrames = -300
        this.entities.push(customer1, customer2)

        this.entities.push(
          new Carrier(),
          new Interface(),
          new Player()
        )

        break
      }

      case States.Intro1: {
        if (it?.components?.length === 0) {
          it.components[0] = new Menu(headerText, introText)
        }

        break
      }

      case States.Intro2:
      case States.Paused: {
        if (it?.components?.length === 0) {
          it.components[0] = new Menu(headerText, helpText)
        }

        break
      }

      case States.Running: {
        if (game.fame < 0) {
          nullthrows(it).components[0] = new Menu(headerText, defeatText)
          game.state = States.Final
        }

        if (game.silver === 200) {
          nullthrows(it).components[0] = new Menu(headerText, victoryText)
          game.state = States.Final
        }

        break
      }
    }
  }
}
