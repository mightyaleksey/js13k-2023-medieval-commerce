/* @flow */

export class Component {}

export class Entity {}

export class System <C: ?Component, E: ?Entity> {
  _requiredComponents: Array<Class<C>>
  components: Array<C>
  _requiredEntities: Array<Class<E>>
  entities: Array<E>

  update (elapsedFrames: number, totalFrames: number) {}
}
