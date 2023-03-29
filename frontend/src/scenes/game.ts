import * as Phaser from "phaser";
import Enemy from "../entities/Enemy";
import Map from "../entities/Map";
import Player from "../entities/Player";
import { SPRITE_FRAME_SIZE } from "../constants";
import Wepon from "../entities/Wepon";
import { fontStyle } from "../utils/text";
import { CharacterState, Text } from "../types/game";
import GameManager from "../entities/GameManager";
import GameOverText from "../entities/text/GameOverText";
import RetryText from "../entities/text/RetryText";
import LoginForSaveText from "../entities/text/LoginForSaveText";

export class Game extends Phaser.Scene {
  private gameManager: GameManager;
  private enemies: Enemy[];
  private map: Map;
  private player: Player;
  private scoreText: Phaser.GameObjects.Text;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private shootInterval: boolean;
  private gameOver: boolean;

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.gameOver = false;
    this.enemies = [];
    sessionStorage.clear();
  }

  preload() {
    this.load.image("mapTiles", `./images/map_tile.png`);
    this.load.spritesheet("chocopan", `./images/chocopan.png`, {
      frameWidth: SPRITE_FRAME_SIZE,
      frameHeight: SPRITE_FRAME_SIZE,
    });
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
    /*
     * スコアの追加
     */
    this.scoreText = this.add.text(
      700,
      30,
      "Score: 0",
      fontStyle("#FFF", "24px")
    );
    this.scoreText.setOrigin(0.5);
    this.scoreText.setDepth(1);

    // gameManager の読み込み
    this.gameManager = new GameManager();

    // map の読み込み
    this.map = new Map(this);

    // player の読み込み
    this.player = new Player(this.map, this);

    // enemy の読み込み
    const enemy = new Enemy(
      this.map,
      this.gameManager.getEnemyMoveInterval(),
      this
    );
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
    if (!this.player.getCharactorState().isWalking) {
      this.gameManager.controlPlayer(this.cursors, this.player, this.map);
    }

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

    // 敵の残数を見て、出現させる
    if (this.enemies.length < this.gameManager.getEnemyMaxCount()) {
      const enemy = new Enemy(
        this.map,
        this.gameManager.getEnemyMoveInterval(),
        this
      );
      this.enemies.push(enemy);

      this.enemies.forEach((enemy) => {
        enemy.startMove(this.player);
      });
    }
  }

  // 武器オブジェクトを呼び出し、設置・移動
  shootWepon(): void {
    if (this.shootInterval) return;

    this.shootInterval = true;

    // 武器の設置
    const wepon = new Wepon(this.map, this.player.getCharactorState(), this);

    const hitWeponAndEnemy = () => {
      this.enemies.forEach((enemy, i) => {
        if (
          this.judgeHit(wepon.getCharactorState(), enemy.getCharactorState())
        ) {
          // スコアアップ
          this.gameManager.upScore();
          this.scoreText.setText("Score: " + this.gameManager.getScore());

          // 武器の削除
          wepon.destroy();

          // 敵の削除
          enemy.destroy();
          this.enemies.splice(i, 1);
        }
      });
    };

    if (wepon.getCharactorState().tilePos) {
      hitWeponAndEnemy();

      // 武器の進行
      wepon.startMove(this.map, hitWeponAndEnemy);
    }

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

    this.player.destroy();

    const background = this.add.rectangle(0, 0, 800, 600, 0x333333, 0.6);
    background.setScale(2);

    sessionStorage.setItem("score", String(this.gameManager.getScore()));

    new GameOverText(this);
    new RetryText(this);
    new LoginForSaveText(this);
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
