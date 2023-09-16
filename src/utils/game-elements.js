/* @flow */

export class Component {}

export class Entity {
  components: any
}

export class System <C: ?Component, E: ?Entity> {
  _requiredComponents: Array<Class<C>>
  components: Array<C>
  _requiredEntities: Array<Class<E>>
  entities: Array<E>

  constructor () {
    this.components = []
    this.entities = []
  }

  update (elapsedFrames: number, totalFrames: number) {}
}
