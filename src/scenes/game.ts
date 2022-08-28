import * as Phaser from "phaser";

export class Game extends Phaser.Scene {
  init() {
    console.log("Game Main");
  }

  preload() {
    console.log('Load assets.')
  }

  create() {
    console.log('create.')
  }

  update() {
    console.log('update')
  }
}
