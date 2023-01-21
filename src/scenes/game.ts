import * as Phaser from "phaser";
import Enemy from "../entities/Enemy";
import Map from "../entities/Map";
import Player from "../entities/Player";
import { SPRITE_FRAME_SIZE } from "../constants";
import Wepon from "../entities/Wepon";

export class Game extends Phaser.Scene {
  private enemy?: Enemy;
  private map?: Map;
  private player?: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private weponInterval: boolean;

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

    // enemy は定期で動く
    const timer = this.time.addEvent({
      delay: 2000,
      loop: true,
    });
    timer.callback = () => {
      this.enemy.moveEnemy(this.player.getCharactorState());
    };
  }

  update() {
    // wepon の更新判定
    if (this.cursors.space.isDown) {
      this.shootWepon();
      return;
    }
    // player の更新判定
    this.player.controlPlayer(this.cursors, this.map);
  }

  // 武器オブジェクトを呼び出し、設置・移動
  shootWepon(): void {
    if (this.weponInterval) return;

    this.weponInterval = true;

    const wepon = new Wepon(this.map.mapGroundLayer, this);
    wepon.shoot(this.player.getCharactorState());

    // 連打制御
    const timer = this.time.addEvent({
      delay: 500,
      loop: false,
    });
    timer.callback = () => {
      this.weponInterval = false;
    };
  }
}
