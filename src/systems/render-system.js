/* @flow */
import { System } from '@/utils/game-elements'
import { Tile } from '../components'

export class RenderSystem extends System<Tile, void> {
  constructor () {
    super()
    this._requiredComponents = [Tile]
  }

  update () {
    this.components.forEach(tile => {
      // do
    })
  }
}
