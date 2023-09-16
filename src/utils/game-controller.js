/* @flow */
import { Component, Entity, System } from './game-elements'

import { difference, isInstanceOf } from './helpers'
import { invariant } from './guard'

export class GameController {
  _components: Set<Component>
  _entities: Array<Entity>
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
      const entitiesLength = system.entities.length
      const componentsLength = system.entities.map(e => e.components?.length ?? 0)
      system.update(elapsedFrames, totalFrames)

      if (
        entitiesLength !== system.entities.length
      ) {
        this._updateEntityRegistry(system)
        this._updateComponentsRegistry()
        this._systems.forEach(s => this._updateSystem(s))
      } else if (
        componentsLength.some((ct, n) => system.entities[n].length !== ct)
      ) {
        this._updateComponentsRegistry()
        this._systems.forEach(s => this._updateSystem(s))
      }
    })
  }

  _updateComponentsRegistry () {
    this._components = new Set()
    this._entities.forEach(entity => entity.components.forEach(component => {
      this._components.add(component)
    }))
  }

  _updateEntityRegistry (system: System<any, any>) {
    invariant(system._requiredEntities != null)

    const originalEntities = []
    this._entities.forEach(entity => {
      if (
        system._requiredEntities.some(e =>
          isInstanceOf(entity, e))
      ) originalEntities.push(entity)
    })

    const removedEntities = difference(originalEntities, system.entities)
    const createdEntities = difference(system.entities, originalEntities)

    // remove entities from the list
    let length = this._entities.length
    while (length--) {
      if (
        removedEntities.includes(this._entities[length])
      ) this._entities.splice(length, 1)
    }

    // add entities to the list
    this._entities.push(...createdEntities)
  }

  _updateSystem (system: System<any, any>) {
    if (
      system._requiredComponents != null &&
      system._requiredComponents.length > 0
    ) {
      system.components.length = 0 // delete elements
      for (const component of this._components) {
        if (
          system._requiredComponents.some(c =>
            isInstanceOf(component, c))
        ) system.components.push(component)
      }
    }

    if (
      system._requiredEntities != null &&
      system._requiredEntities.length > 0
    ) {
      system.entities.length = 0 // delete elements
      for (const entity of this._entities) {
        if (
          system._requiredEntities.some(e =>
            isInstanceOf(entity, e))
        ) system.entities.push(entity)
      }
    }
  }
}
