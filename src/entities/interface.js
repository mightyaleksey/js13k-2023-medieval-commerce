/* @flow */
import { Entity } from '@/utils/game-elements'

import { Menu } from '../components'

export class Interface extends Entity {
  // eslint-disable-next-line no-undef
  components: [menu?: Menu]

  constructor () {
    super()
    this.components = []
  }
}
