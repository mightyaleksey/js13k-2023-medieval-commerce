import { NPC } from '@/entities/npc'
import { Player } from '@/entities/player'
import { Sack } from '@/entities/sack'
import { Component, Entity, System } from '@/utils/elements'

export class LoggerSystem extends System {
  _container: HTMLPreElement
  _lastOutput: number

  entities?: Array<NPC | Player | Sack>

  constructor () {
    super()

    this._container = document.createElement('pre')
    // @ts-ignore
    this._container.style = 'font-size: 14px; margin: 1rem;'
    this._lastOutput = Date.now()

    this._requiredEntities = [NPC, Player, Sack]

    document.body.append(this._container)
  }

  update () {
    // const player = this.entities![0]
    const content = this.entities!.map(entity => serializeObject(entity, '')).join('\n\n')
    this._container.innerHTML = content
  }
}

function serializeObject (input: Component | Entity, indent: string): string {
  if (input instanceof Component) {
    const props = Object.keys(input).map(key => {
      // @ts-ignore
      const value = input[key]
      const valueStr = typeof value === 'object' ? '{...}' : String(value)
      return `${key}: ${valueStr}`
    })

    return `${indent}${input.constructor.name} { ${props.join(', ')} }`
  }

  if (input instanceof Entity) {
    const props = input.components.map(component => serializeObject(component, '  '))
    return [input.constructor.name + ' ['].concat(props, ']').join('\n')
  }

  return ''
}
