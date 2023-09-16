/* @flow */
import { GameSystem } from './systems/game-system'
import { LoggerSystem } from './systems/logger-system'
import { PlayerSystem } from './systems/player-system'
import { RenderSystem } from './systems/render-system'
import { WalkSystem } from './systems/walk-system'
import { World } from './entities/world'

import { GameController } from './utils/game-controller'

const gameController = new GameController(
  [RenderSystem, WalkSystem,
    GameSystem, PlayerSystem,
    LoggerSystem],
  [World]
)

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
