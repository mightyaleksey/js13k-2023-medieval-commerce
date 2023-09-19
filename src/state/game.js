/* @flow */
import type { StatesType } from '@/utils/constants'

import { States } from '@/utils/constants'

class Game {
  state: StatesType

  constructor () {
    this.state = States.Running
  }
}

export default (new Game(): Game)
