import { Delay } from '../components'
import { Player } from '@/entities/player'
import { System } from '@/utils/elements'

import { findInstance, removeInstance } from '@/utils/helpers'
import { getElapsedFrames } from '@/utils/collision'
import { nullthrows } from '@/utils/validate'

export class DelaySystem extends System {
  entities?: Player[]

  constructor () {
    super()

    this._requiredEntities = [Player]
  }

  update (elapsedFrames: number, totalFrames: number) {
    const player = nullthrows(this.entities)[0]
    const delay = findInstance(player.components, Delay)

    if (
      delay != null &&
      getElapsedFrames(totalFrames, delay.startFrame) > delay.frames
    ) {
      removeInstance(player.components, delay)
    }
  }
}
