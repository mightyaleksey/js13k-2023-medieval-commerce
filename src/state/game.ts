class Game {
  isPaused: boolean

  fame: number
  silver: number

  constructor () {
    this.isPaused = false

    this.fame = 100
    this.silver = 0
  }
}

export default new Game()
