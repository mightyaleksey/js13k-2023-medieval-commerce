/* @flow */
import { System } from './game-elements'

export class GameController {
  _systems: $ReadOnlyArray<System<any, any>>
  _totalFrames: number

  constructor (
    systems: $ReadOnlyArray<Class<System<any, any>>>
  ) {
    this._systems = systems.map(SystemFactory => {
      const system = new SystemFactory()
      return system
    })

    this._totalFrames = 0
  }

  update (elapsedFrames: number) {
    const totalFrames = this._totalFrames / 10
    this._totalFrames = (this._totalFrames + (elapsedFrames * 10) >> 0) % 10000

    this._systems.forEach(system => {
      system.update(elapsedFrames, totalFrames)
    })
  }
}
