/* @flow */
import { Character } from '@/entities/character'
import { Component, Entity, System } from '@/utils/game-elements'

import { States } from '@/utils/constants'
import { bgColor } from '@/utils/tiles'
import { isInstanceOf } from '@/utils/helpers'
import { invariant } from '@/utils/guard'
import game from '@/state/game'

export class LoggerSystem extends System<void, Character> {
  _container: HTMLDivElement
  _textContainer: HTMLPreElement

  constructor () {
    super()
    this._requiredEntities = [Character]

    this._container = document.createElement('div')
    invariant(this._container instanceof window.HTMLDivElement)
    this._container.style = [
      'max-width: 30rem;',
      'padding: 1rem;',

      'position: absolute;',
      'top: 50%;',
      'transform: translateY(-50%);',

      'font-size: 14px;',
      `background-color: ${bgColor};`,
      'color: white;',
      'opacity: 0.7;'
    ].join('')

    this._textContainer = document.createElement('pre')
    invariant(this._textContainer instanceof window.HTMLPreElement)
    this._textContainer.style = [
      'margin: 0 0 1em;',
      'white-space: pre-wrap;'
    ].join('')

    this._container.append(this._textContainer)

    const playPause = createButton(
      'Play / Pause',
      () => {
        if ([States.Paused, States.Running].includes(game.state)) {
          game.state = game.state === States.Running
            ? States.Paused
            : States.Running
        }
      }
    )

    this._container.append(playPause)

    const reset = createButton(
      'Reset',
      () => {
        game.state = States.CleanUp
      }
    )

    this._container.append(reset)

    document.body?.append(this._container)
  }

  update () {
    const content = this.entities.map(serializeObject).join('\n\n')
    this._textContainer.innerHTML = content
  }
}

function createButton (
  title: string,
  handler: () => mixed
): HTMLButtonElement {
  const button = document.createElement('button')
  invariant(button instanceof window.HTMLButtonElement)
  button.innerHTML = title
  button.style = [
    'display: inline-block;',
    'margin: 0 .5em 0 0;',
    'padding: .2em .5em;',
    'border: 0;',

    'font-size: 1rem;',
    'background-color: #2e4840;',
    'color: white;'
  ].join('')

  button.addEventListener('click', handler)

  return button
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
