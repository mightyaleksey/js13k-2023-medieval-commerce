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
  isUp: boolean
  isLeft: boolean
  isDown: boolean
  isRight: boolean
  isAction: boolean
  isEscape: boolean

  keyMap: {
    [string]: ActionType
  }

  keyQ: {
    [ActionType]: boolean
  }

  constructor () {
    this.keyMap = actions.reduce(
      (m: {[string]: ActionType}, action, n) => {
        this[action] = false
        keys[n].forEach(key => {
          m[key] = action
        })
        return m
      },
      {}
    )

    this.keyQ = {
      isAction: false,
      isEscape: false
    }

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

    this[action] = state
    this.keyQ[action] = state
  }
}

export default (new Controls(): Controls)
