import { Header, Paragraph } from '../components'
import { Menu } from '@/entities/menu'
import { System } from '@/utils/elements'

import { GameStates } from '@/utils/states'
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
        game.stage = GameStates.Intro

        const menu = new Menu()
        menu.components.push(
          new Header('Medieval Commerce'),
          new Paragraph('f')
        )
        this.entities!.push(menu)

        break
      }

      case GameStates.PrepareHelp: {
        game.stage = GameStates.Help

        const menu = new Menu()
        menu.components.push(
          new Header('Medieval Commerce'),
          new Paragraph([
            'Controls:',
            '',
            '• ←/↑/→/↓ or a/w/d/s: move',
            '• space/enter: pick or drop sack'
          ].join('\n'))
        )
        this.entities!.push(menu)

        break
      }
    }
  }
}

// new Paragraph('Super test to render with multiple lines and paragraphs.\n\nAsdasd asdalskdj asdlkasd sdsdsd sdsdsd asdasda dddkfk kjkjl sdsdd.')
