import { Component, Entity, System } from './elements'

import { difference, isInstance, isInstanceOfAny } from './helpers'
import { invariant } from './validate'

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
  _components: Component[]
  _entities: Entity[]
  _systems: System[]

  _perf: {[name: string]: number}
  _totalFrames: number

  constructor (
    entities: Array<typeof Entity>,
    systems: Array<typeof System>
  ) {
    this._components = []
    this._entities = entities.map(EntityFactory => {
      const entity = new EntityFactory()
      invariant(isInstance(entity, Entity))
      this._components.push(...entity.components)

      return entity
    })

    this._systems = systems.map(SystemFactory => {
      const system = new SystemFactory()
      invariant(isInstance(system, System))

      this._updateSystem(system)

      return system
    })

    this._perf = {}
    this._totalFrames = 0
  }

  _updateComponents () {
    this._components = []
    this._entities.forEach(entity => {
      this._components.push(
        ...entity.components
      )
    })
    this._systems.forEach(system =>
      this._updateSystem(system))
  }

  _updateEntities (system: System) {
    invariant(system._requiredEntities != null,
      'system should define required entities in advance')
    const originalEntities = this._entities.filter(entity =>
      isInstanceOfAny(entity, system._requiredEntities!))

    const deletedEntities = difference(originalEntities, system.entities!)
    const createdEntities = difference(system.entities!, originalEntities)

    // remove entities from the list
    let length = this._entities.length
    while (length--) {
      if (deletedEntities.includes(this._entities[length])) {
        this._entities.splice(length, 1)
      }
    }

    // add entities to the list
    this._entities.push(...createdEntities)
    this._updateComponents()
  }

  _updateSystem (system: System) {
    if (system._requiredComponents != null) {
      system.components = this._components.filter(component =>
        isInstanceOfAny(component, system._requiredComponents!))
    }

    if (system._requiredEntities != null) {
      system.entities = this._entities.filter(entity =>
        isInstanceOfAny(entity, system._requiredEntities!))
    }
  }

  update (elapsedFrames: number) {
    const totalFrames = this._totalFrames / 10

    this._systems.forEach(system => {
      const startTime = Date.now()

      const entitiesLength = system.entities?.length
      const componentsLengthList = system.entities?.map(e => e.components.length)
      system.update(elapsedFrames, totalFrames, this._perf)

      if (
        entitiesLength != null &&
        entitiesLength !== system.entities?.length
      ) {
        // entities list was updated
        this._updateEntities(system)
      } else if (
        componentsLengthList != null &&
        componentsLengthList.some((ct, n) =>
          system.entities?.[n].components.length !== ct)
      ) {
        // list components inside entity was changed
        this._updateComponents()
      }

      this._perf[system.constructor.name] = Date.now() - startTime
    })

    this._totalFrames = (this._totalFrames + (elapsedFrames * 10) >> 0) % 10000
  }
}
