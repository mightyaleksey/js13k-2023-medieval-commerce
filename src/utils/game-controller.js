/* @flow */
import { Component, Entity, System } from './game-elements'

import { isInstanceOf } from './helpers'

export class GameController {
  _components: Set<Component>
  _entities: $ReadOnlyArray<Entity>
  _systems: $ReadOnlyArray<System<any, any>>
  _totalFrames: number

  constructor (
    systems: $ReadOnlyArray<Class<System<any, any>>>,
    entities: $ReadOnlyArray<Class<Entity>>
  ) {
    this._entities = entities.map(EntityFactory => {
      const entity = new EntityFactory()
      return entity
    })

    this._systems = systems.map(SystemFactory => {
      const system = new SystemFactory()
      return system
    })

    this._totalFrames = 0

    this._updateComponentsRegistry()
    this._systems.forEach(s => this._updateSystem(s))
  }

  update (elapsedFrames: number) {
    const totalFrames = this._totalFrames / 10
    this._totalFrames = (this._totalFrames + (elapsedFrames * 10) >> 0) % 10000

    this._systems.forEach(system => {
      system.update(elapsedFrames, totalFrames)
    })
  }

  _updateComponentsRegistry () {
    this._components = new Set()
    this._entities.forEach(entity => entity.components.forEach(component => {
      this._components.add(component)
    }))
  }

  _updateSystem (system: System<any, any>) {
    if (
      system._requiredComponents != null &&
      system._requiredComponents.length > 0
    ) {
      system.components = []
      for (const component of this._components) {
        if (
          system._requiredComponents.some(c =>
            isInstanceOf(component, c))
        ) system.components.push(component)
      }
    }
  }
}
