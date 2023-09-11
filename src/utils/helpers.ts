import { Component, Entity, System } from './elements'

import { invariant, nullthrows } from './validate'

export function isInstance (
  instance: Component | Entity | System,
  factory: typeof Component | typeof Entity | typeof System
): boolean {
  return instance instanceof factory
}

export function isInstanceOfAny (
  instance: Component | Entity | System,
  factories: Array<typeof Component> | Array<typeof Entity> | Array<typeof System>
): boolean {
  return factories.some(factory => isInstance(instance, factory))
}

export function findInstance<T extends typeof Component> (
  collection: Component[],
  factory: T
): InstanceType<T> | null {
  return collection.find(component =>
    isInstance(component, factory)) as InstanceType<T> | null
}

export function removeInstance (
  collection: Component[],
  instance: Component
) {
  invariant(typeof instance === 'object', 'invalid instance provided')
  const elemIndex = collection.findIndex(elem => elem === instance)
  invariant(elemIndex > -1, 'failed to remove instance')
  collection.splice(elemIndex, 1)
}

export function difference <T> (
  left: T[],
  right: T[]
): T[] {
  return left.filter(elem => !right.includes(elem))
}

export function iterate (
  start: number,
  end: number | ((step: number) => void),
  fn?: (step: number) => void
) {
  if (typeof end === 'function') {
    fn = end
    end = start
    start = 0
  }

  for (let i = 0; i < end - start; ++i) {
    nullthrows(fn)(start + i)
  }
}

export function range (start: number, end?: number): number[] {
  if (typeof end !== 'number') {
    end = start
    start = 0
  }

  const elements = new Array(end - start)
  for (let i = 0; i < elements.length; ++i) {
    elements[i] = start + i
  }

  return elements
}
