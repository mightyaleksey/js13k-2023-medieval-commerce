/* flow */

const fps = 48 // 21ms per frame

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

function gameLoop (elapsedFrames: number) {
  // gameController.update(elapsedFrames)
}

animate(gameLoop)
