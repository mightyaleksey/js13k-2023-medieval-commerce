import { Player } from './entities/player'
import { Provider } from './entities/provider'
import { Surface } from './entities/surface'

import { ControllerSystem } from './systems/controller-system'
import { DelaySystem } from './systems/delay-system'
import { DirectionSystem } from './systems/direction-system'
import { GameSystem } from './systems/game-system'
import { HaulSystem } from './systems/haul-system'
import { LoggerSystem } from './systems/logger-system'
import { RenderSystem } from './systems/render-system'
import { SupplySystem } from './systems/supply-system'
import { TradeSystem } from './systems/trade-system'
import { WalkSystem } from './systems/walk-system'

import { GameController } from './utils/game-controller'
import game from './state/game'

const fps = 48 // 21ms per frame

const gameController = new GameController(
  [Surface, Player, Provider],
  [
    ControllerSystem, DelaySystem, DirectionSystem,
    GameSystem, SupplySystem, TradeSystem,
    HaulSystem, WalkSystem, RenderSystem,
    LoggerSystem
  ]
)

function animate (
  fn: (frames: number) => boolean | void,
  startTime = Date.now()
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

function gameLoop (elapsedFrames: number) {
  gameController.update(elapsedFrames)
}

animate(gameLoop)
