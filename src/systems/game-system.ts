import { Header, Paragraph } from '../components'
import { Menu } from '@/entities/menu'
import { Entity, System } from '@/utils/elements'

import { GameStates } from '@/utils/states'
import {
  introText,
  headerText,
  helpText,
  defeatText,
  victoryText
} from '@/utils/texts'
import game from '@/state/game'

export class GameSystem extends System {
  entities?: Menu[]

  constructor () {
    super()

    this._requiredEntities = [Menu]
  }

  update () {
    switch (game.stage) {
      case GameStates.PrepareIntro: {
        game.fame = 50
        game.silver = 0
        game.stage = GameStates.Intro
        addMenu(this.entities!, introText)
        break
      }

      case GameStates.PrepareHelp: {
        game.stage = GameStates.Help
        addMenu(this.entities!, helpText)
        break
      }

      case GameStates.Game: {
        if (game.fame < 0) {
          // defeat
          game.stage = GameStates.Defeat
          addMenu(this.entities!, defeatText)
        }

        if (game.silver === 300) {
          // victory
          game.stage = GameStates.Victory
          addMenu(this.entities!, victoryText)
        }

        break
      }
    }
  }
}

function addMenu (entities: Entity[], text: string) {
  const menu = new Menu()
  menu.components.push(
    new Header(headerText),
    new Paragraph(text)
  )
  entities.push(menu)
}
