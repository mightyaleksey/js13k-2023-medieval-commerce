/* @flow */
import { System } from '@/utils/game-elements'
import { Walk } from '../components'

export class WalkSystem extends System<Walk, void> {
  constructor () {
    super()
    this._requiredComponents = [Walk]
  }

  update () {}
}
