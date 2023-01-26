﻿import * as Phaser from "phaser";
import Enemy from "../entities/Enemy";
import Map from "../entities/Map";
import Player from "../entities/Player";
import { SPRITE_FRAME_SIZE } from "../constants";
import Wepon from "../entities/Wepon";
import { fontStyle } from "../utils/text";
import { CharacterState, Text } from "../types/game";

export class Game extends Phaser.Scene {
  private enemies: Enemy[];
  private map?: Map;
  private player?: Player;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private shootInterval: boolean;
  private gameOver: boolean;

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.gameOver = false;
    this.enemies = [];
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
    const enemy = new Enemy(this.map, this);
    this.enemies.push(enemy);

    this.enemies.forEach((enemy) => {
      enemy.startMove(this.player);
    });
  }

  update() {
    if (this.gameOver) return;

    // wepon の更新判定
    if (this.cursors.space.isDown) {
      this.shootWepon();
      return;
    }
    // player の更新判定
    this.player.controlPlayer(this.cursors, this.map);

    // 敵と人のHIT判定
    this.enemies.forEach((enemy) => {
      if (
        this.judgeHit(
          this.player.getCharactorState(),
          enemy.getCharactorState()
        )
      ) {
        this.changeToGameOver();
      }
    });

    // TODO: 敵の残数を見て、出現させる
  }

  // 武器オブジェクトを呼び出し、設置・移動
  shootWepon(): void {
    if (this.shootInterval) return;

    this.shootInterval = true;

    const wepon = new Wepon(this.map.mapGroundLayer, this);
    wepon.setGround(this.player.getCharactorState());

    const hitWeponAndEnemy = () => {
      this.enemies.forEach((enemy, i) => {
        if (
          this.judgeHit(wepon.getCharactorState(), enemy.getCharactorState())
        ) {
          // TODO: スコアアップ

          // 武器の削除
          wepon.destroy();

          // 敵の削除
          enemy.destroy();
          this.enemies.splice(i, 1);
        }
      });
    };

    // 武器の進行
    wepon.startMove(hitWeponAndEnemy);

    // 連打制御
    const shootIntervalTimer = this.time.addEvent({
      delay: 500,
      loop: false,
    });
    shootIntervalTimer.callback = () => {
      this.shootInterval = false;
    };
  }

  changeToGameOver() {
    this.gameOver = true;

    this.player.setTint(0xff0000);

    const background = this.add.rectangle(0, 0, 800, 600, 0x333333, 0.6);
    background.setScale(2);

    const gameOverText: Text = this.add.text(
      400,
      250,
      "GAME OVER",
      fontStyle("#FF0000", "100px")
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setDepth(1);

    const retryText: Text = this.add.text(
      400,
      500,
      "RETRY",
      fontStyle("#FFF", "70px")
    );
    retryText.setOrigin(0.5);
    retryText.setDepth(1);

    retryText.setInteractive({
      useHandCursor: true,
    });

    retryText.on("pointerover", () => {
      retryText.setStyle({ color: "#F11C32" });
    });

    retryText.on("pointerout", () => {
      retryText.setStyle({ color: "#FFF" });
    });

    retryText.on("pointerdown", () => {
      this.scene.start("preload");
    });
  }

  // 衝突判定
  judgeHit(
    characterAState: CharacterState,
    characterBState: CharacterState
  ): boolean {
    return (
      characterAState.tilePos.tx === characterBState.tilePos.tx &&
      characterAState.tilePos.ty === characterBState.tilePos.ty
    );
  }
}
