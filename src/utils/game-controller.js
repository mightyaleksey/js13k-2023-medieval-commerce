/* @flow */
import { Component, Entity, System } from './game-elements'

import { difference, isInstanceOf } from './helpers'
import { invariant } from './guard'

/**
 * GameController acts as a glue between systems and entities and components.
 *
 * Rules:
 * 1. Entities and systems are stateless.
 * 2. State is represented by compnents.
 * 3. Component's list (addition, removal) changes only possible
 * inside systems with "_requiredEntity" being set.
 * 4. System.constructor has no access to entities or components.
 * 5. System.update has access to entities or components
 * if "_requiredComponent" or "_requiredEntity" are specified.
 * 6. System.update receives elapsedFrames and totalFrames as argument.
 * Speed is 48 frames per second, 1 frame ~ 21ms
 *
 * How to:
 * 1. Any changes are introduced on the entity level through the components.
 * 2. Components represent the app state.
 * 3. Any process is implmeneted through the components.
 */

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
    const totalFrames = this._totalFrames / 100
    this._totalFrames = (this._totalFrames + (elapsedFrames * 100) >> 0) % 100000

    this._systems.forEach(system => {
      const entitiesLength = system.entities.length
      const entityComponentsLength = system.entities.map(e => e.components?.length ?? 0)
      system.update(elapsedFrames, totalFrames)

      if (
        entitiesLength !== system.entities.length
      ) {
        this._updateEntityRegistry(system)
        this._updateComponentsRegistry()
        this._systems.forEach(s => this._updateSystem(s))
      } else if (
        entityComponentsLength.some((ct, n) => system.entities[n].length !== ct)
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
    invariant(
      system._requiredEntities != null &&
      system._requiredEntities.length > 0
    )

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
