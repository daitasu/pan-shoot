import * as Phaser from "phaser";
import Enemy from "../entities/Enemy";
import Map from "../entities/Map";
import Player from "../entities/Player";
import { SPRITE_FRAME_SIZE } from "../constants";

export class Game extends Phaser.Scene {
  private enemy?: Enemy;
  private map?: Map;
  private player?: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image("mapTiles", `./images/map_tile.png`);
    this.load.image("chocopan", `./images/chocopan.png`);
    this.load.spritesheet("katopan", "./images/katopan.png", {
      frameWidth: SPRITE_FRAME_SIZE,
      frameHeight: SPRITE_FRAME_SIZE,
    });
    this.load.spritesheet("demon", "./images/demon.png", {
      frameWidth: SPRITE_FRAME_SIZE,
      frameHeight: SPRITE_FRAME_SIZE,
    });
  }

  create() {
    // map の読み込み
    this.map = new Map(this);

    // player の読み込み
    this.player = new Player(this.map.mapGroundLayer, this);

    // enemy の読み込み
    this.enemy = new Enemy(this.map.mapGroundLayer, this);
  }

  update() {
    if (this.player.isWalking) return;

    this.player.controlPlayer(this.cursors, this.map);

    if (!this.player.isWalking) return;
    this.enemy.moveEnemy(this.player);
  }
}
