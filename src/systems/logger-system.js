/* @flow */
import { Character } from '@/entities/character'
import { Sack } from '@/entities/sack'
import { Component, Entity, System } from '@/utils/game-elements'

import { bgColor } from '@/utils/tiles'
import { isInstanceOf } from '@/utils/helpers'
import { invariant } from '@/utils/guard'

export class LoggerSystem extends System<void, Character | Sack> {
  _container: HTMLPreElement

  constructor () {
    super()
    this._requiredEntities = [Character, Sack]

    this._container = document.createElement('pre')
    invariant(this._container instanceof window.HTMLPreElement)
    this._container.style = [
      'max-width: 30rem;',
      'padding: 1rem;',
      'font-size: 14px;',
      'white-space: pre-wrap;',
      `background-color: ${bgColor};`,
      'color: white;',
      'opacity: 0.7;',
      'position: absolute;',
      'top: 50%;',
      'transform: translateY(-50%);'
    ].join('')

    document.body?.append(this._container)
  }

  update () {
    const content = this.entities.map(serializeObject).join('\n\n')
    this._container.innerHTML = content
  }
}

function serializeObject (
  input: Component | Entity,
  indent: mixed
): string {
  if (typeof indent !== 'string') indent = ''

  if (isInstanceOf(input, Component)) {
    const props = Object.keys(input).map(key => {
      // @ts-ignore
      const value = input[key]
      const valueStr = typeof value === 'object' ? '{...}' : String(value)
      return `${key}: ${valueStr}`
    })

    return `${indent}${input.constructor.name} { ${props.join(', ')} }`
  }

  if (isInstanceOf(input, Entity)) {
    const props = input.components.map(component => serializeObject(component, '  '))
    return [input.constructor.name + ' ['].concat(props, ']').join('\n')
  }

  return ''
}
