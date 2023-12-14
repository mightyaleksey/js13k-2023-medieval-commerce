/* @flow */
import type { StatesType } from '@/utils/constants'

import { Menu } from '../components'
import { Interface } from '@/entities/interface'
import { Player } from '@/entities/character'
import { System } from '@/utils/game-elements'

import { Actions, States } from '@/utils/constants'
import { offsetX, offsetY, getAngleFromInput, goTo } from '@/utils/walk'
import { isInstanceOf } from '@/utils/helpers'
import controls, { KEY_ACTION, KEY_ESCAPE } from '@/state/controls'
import game from '@/state/game'

const transitions: {[StatesType]: StatesType} = {
  // $FlowIgnore[invalid-computed-prop]
  [States.Intro1]: States.Intro2,
  // $FlowIgnore[invalid-computed-prop]
  [States.Intro2]: States.Running,
  // $FlowIgnore[invalid-computed-prop]
  [States.Paused]: States.Running,
  // $FlowIgnore[invalid-computed-prop]
  [States.Final]: States.CleanUp
}

export class PlayerSystem extends System<Menu, Interface | Player> {
  constructor () {
    super()
    this._requiredComponents = [Menu]
    this._requiredEntities = [Interface, Player]
  }

  update () {
    // $FlowFixMe[incompatible-type]
    const it: ?Interface = this.entities.find(it => isInstanceOf(it, Interface))

    switch (game.state) {
      case States.Intro1:
      case States.Intro2:
      case States.Paused:
      case States.Final: {
        if (controls.wasPressed(KEY_ACTION) || controls.wasPressed(KEY_ESCAPE)) {
          // $FlowIgnore[cannot-write]
          if (it != null) it.components.length = 0
          game.state = transitions[game.state]
        }
        break
      }

      case States.Running: {
        // control character
        // $FlowFixMe[incompatible-type]
        const player: Player = this.entities.find(player => isInstanceOf(player, Player))
        if (player == null) return

        const [tile, , walk, haul, action] = player.components

        if (controls.wasMoving() && !walk.isActive) {
          const angle = getAngleFromInput(controls)
          goTo(
            walk,
            tile.x + offsetX[angle],
            tile.y + offsetY[angle]
          )
        }

        if (controls.wasPressed(KEY_ACTION)) {
          action.type = haul.tile != null
            ? Actions.Drop
            : Actions.Grab
        }

        if (controls.wasPressed(KEY_ESCAPE)) {
          game.state = States.Paused
        }
        break
      }
    }
  }
}
