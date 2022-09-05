import * as Phaser from "phaser";
import Enemy from "../entities/Enemy";
import Map from "../entities/Map";
import Player from "../entities/Player";

export class Game extends Phaser.Scene {
  private enemy?: Enemy;
  private map?: Map;
  private player?: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  preload() {
    this.load.image("mapTiles", `../../public/images/map_tile.png`);
    this.load.spritesheet("katopan", "../../public/images/katopan.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("demon", "../../public/images/demon.png", {
      frameWidth: 32,
      frameHeight: 32,
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
    if (this.player.isWalking) return; // 追加

    this.player.controlPlayer(this.cursors, this.map);

    if (!this.player.isWalking) return;
    this.enemy.moveEnemy(this.player);
  }
}
