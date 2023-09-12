import type { GameStatesType } from '@/utils/states'

import { GameStates } from '@/utils/states'

class Game {
  stage: GameStatesType

  fame: number
  silver: number

  constructor () {
    this.stage = GameStates.PrepareIntro

    this.fame = 100
    this.silver = 0
  }
}

export default new Game()
