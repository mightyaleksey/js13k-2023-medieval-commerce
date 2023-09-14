/* @flow */
import { RenderSystem } from './systems/render-system'
import { WalkSystem } from './systems/walk-system'

import { GameController } from './utils/game-controller'

const gameController = new GameController(
  [RenderSystem, WalkSystem]
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
