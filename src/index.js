/* @flow */
import { GameSystem } from './systems/game-system'
import { LoggerSystem } from './systems/logger-system'
import { HaulSystem } from './systems/haul-system'
import { PlayerSystem } from './systems/player-system'
import { RenderSystem } from './systems/render-system'
import { WalkSystem } from './systems/walk-system'
import { Sack } from './entities/sack'
import { World } from './entities/world'

import { GameController } from './utils/game-controller'

const gameController = new GameController(
  [RenderSystem, WalkSystem, HaulSystem,
    GameSystem, PlayerSystem],
  [World, Sack]
)

// env variables https://vitejs.dev/guide/env-and-mode.html#env-variables-and-modes
// $FlowIgnore[incompatible-type] DEV is a value defined by vite
if (import.meta.env.DEV) {
  // add logger for the dev environment
  // $FlowIgnore[prop-missing] _systems is read only array
  gameController._systems.push(new LoggerSystem())
}

function gameLoop (elapsedFrames: number) {
  gameController.update(elapsedFrames)
}

// 21ms per frame
const fps = 48

function animate (
  fn: number => mixed,
  startTime: number = Date.now()
) {
  const currentTime = Date.now()
  const elapsedFrames = (currentTime - startTime) * fps / 1000
  const result = fn(elapsedFrames) // wrap with try catch?

  if (result !== false) {
    window.requestAnimationFrame(() => {
      animate(fn, currentTime)
    })
  }
}

animate(gameLoop)
