/* @flow */

type ActionType =
  | 'isUp'
  | 'isLeft'
  | 'isDown'
  | 'isRight'
  | 'isAction'
  | 'isEscape'

const actions: $ReadOnlyArray<ActionType> = [
  'isUp',
  'isLeft',
  'isDown',
  'isRight',
  'isAction',
  'isEscape'
]

const keys = [
  ['ArrowUp', 'w', 'ц'],
  ['ArrowLeft', 'a', 'ф'],
  ['ArrowDown', 's', 'ы'],
  ['ArrowRight', 'd', 'в'],
  ['Enter', ' '],
  ['Escape']
]

class Controls {
  keyMap: {
    [string]: ActionType
  }

  // can be modified, so we can distinguish
  // different attempts to press the button
  q: {
    [ActionType]: boolean
  }

  // represents keyboard state
  s: $ReadOnly<{
    [ActionType]: boolean
  }>

  constructor () {
    this.q = {}
    this.s = {}
    this.keyMap = actions.reduce(
      (m: {[string]: ActionType}, action, n) => {
        this.q[action] = false
        // $FlowIgnore[cannot-write]
        this.s[action] = false
        keys[n].forEach(key => {
          m[key] = action
        })
        return m
      },
      {}
    )

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      this.toggleKey(event, true)
    })

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      this.toggleKey(event, false)
    })
  }

  toggleKey (event: KeyboardEvent, state: boolean) {
    const action = this.keyMap[event.key]
    if (action == null) return

    this.q[action] = state
    // $FlowIgnore[cannot-write]
    this.s[action] = state
  }
}

export default (new Controls(): Controls)
