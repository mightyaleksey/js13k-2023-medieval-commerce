/* @flow */

/**
 * Up:     38, 87
 * Right:  39, 68
 * Down:   40, 83
 * Left:   37, 65
 * Action: 13, 32
 * Escape: 27
 */

export const KEY_UP = 0
export const KEY_RIGHT = 1
export const KEY_DOWN = 2
export const KEY_LEFT = 3
export const KEY_ACTION = 4
export const KEY_ESCAPE = 5

const KEY_MAP = [
  [38, 87],
  [39, 68],
  [40, 83],
  [37, 65],
  [13, 32],
  [27]
]

class Controls {
  _progState: [number, number, number, number, number, number]
  _userState: [number, number, number, number, number, number]

  constructor () {
    const progState = this._progState = [0, 0, 0, 0, 0, 0]
    const userState = this._userState = [0, 0, 0, 0, 0, 0]

    document.addEventListener('keydown', (event: KeyboardEvent) => {
      setKey(event, 1)
    })

    document.addEventListener('keyup', (event: KeyboardEvent) => {
      setKey(event, 0)
    })

    const keyMap = KEY_MAP.reduce((m: {[number]: number}, keyCodes, index) => {
      keyCodes.forEach(keyCode => { m[keyCode] = index })
      return m
    }, {})

    function setKey (event: KeyboardEvent, value: 0|1) {
      const code = keyMap[event.keyCode]
      if (typeof code !== 'number') return

      progState[code] = value
      userState[code] = value
    }
  }

  wasMoving (): boolean {
    return (
      this._progState[0] +
      this._progState[1] +
      this._progState[2] +
      this._progState[3]
    ) > 0
  }

  wasOnHold (code: 0|1|2|3|4|5): boolean {
    return this._progState[code] === 1
  }

  wasPressed (code: 0|1|2|3|4|5): boolean {
    return (
      this._progState[code] === 1 &&
      this._userState[code] === 1 &&
      !(this._userState[code] = 0)
    )
  }
}

export default (new Controls(): Controls)
