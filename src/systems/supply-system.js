/* @flow */
import { Carrier } from '@/entities/character'
import { System } from '@/utils/game-elements'

import { Actions, States } from '@/utils/constants'
import { goTo } from '@/utils/walk'
import game from '@/state/game'

export class SupplySystem extends System<void, Carrier> {
  constructor () {
    super()
    this._requiredEntities = [Carrier]
  }

  update (elapsedFrames: number, totalFrames: number) {
    if (game.state !== States.Running) return

    const carrier = this.entities[0]
    const [, , walk, , action] = carrier.components

    switch (action.type) {
      case Actions.Idle:
        action.elapsedFrames += elapsedFrames
        if (action.elapsedFrames > 50) action.type = Actions.CarrierReveal
        break

      case Actions.CarrierReveal:
        goTo(walk, 0, 13)
        break
    }
  }
}
