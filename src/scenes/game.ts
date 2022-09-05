import * as Phaser from "phaser";
import Enemy from "../entities/Enemy";
import Map from "../entities/Map";
import { WalkAnimState, TilePos, MoveDir } from "../types/game";

export class Game extends Phaser.Scene {
  private player?: Phaser.GameObjects.Sprite;
  private enemy?: Enemy;
  private map?: Map;

  private playerAnimState: WalkAnimState;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private playerIsWalking: boolean;
  private playerWalkSpeed = 40;
  private playerTilePos: TilePos;

  // player アニメーションを配列で設定
  private playerAnims: { key: string; frameStart: number; frameEnd: number }[] =
    [
      { key: "walk_front", frameStart: 0, frameEnd: 2 },
      { key: "walk_left", frameStart: 3, frameEnd: 5 },
      { key: "walk_right", frameStart: 6, frameEnd: 8 },
      { key: "walk_back", frameStart: 9, frameEnd: 11 },
    ];

  init() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerAnimState = "";
    this.playerIsWalking = false;

    // player 初期位置をタイル基準で設定
    this.playerTilePos = { tx: 10, ty: 8 };
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

    // player
    const playerPos: Phaser.Math.Vector2 =
      this.map.mapGroundLayer.tileToWorldXY(
        this.playerTilePos.tx,
        this.playerTilePos.ty
      );

    this.player = this.add.sprite(playerPos.x, playerPos.y, "katopan", 0);
    this.player.setOrigin(0);
    this.player.setDisplaySize(40, 40);

    for (const playerAnim of this.playerAnims) {
      // ヒーローアニメーションの数だけループ
      if (this.anims.create(this.playerAnimConfig(playerAnim)) === false)
        continue; // もしfalseが戻って来ればこの後何もしない
    }

    this.player.anims.play("walk_stop");

    // enemy
    this.enemy = new Enemy(this.map.mapGroundLayer, this);
  }

  update() {
    if (this.playerIsWalking) return; // 追加

    let playerAnimState: WalkAnimState = "";
    let playerXDir: MoveDir = 0; // x座標の移動方向を表すための変数
    let playerYDir: MoveDir = 0; // y座標の移動方向を表すための変数
    let playerNewTilePos: { tx: number; ty: number } = this.playerTilePos;

    if (this.cursors.up.isDown) {
      playerAnimState = "walk_back";
      playerYDir = -1;
    } else if (this.cursors.down.isDown) {
      playerAnimState = "walk_front";
      playerYDir = 1;
    } else if (this.cursors.left.isDown) {
      playerAnimState = "walk_left";
      playerXDir = -1;
    } else if (this.cursors.right.isDown) {
      playerAnimState = "walk_right";
      playerXDir = 1;
    } else {
      this.player.anims.stop();
      this.playerAnimState = "";
      return;
    }

    // 前回と状態が異なればplayer 挙動を変更
    if (this.playerAnimState != playerAnimState) {
      this.player.anims.play(playerAnimState);
      this.playerAnimState = playerAnimState;
    }

    // 外壁判定
    playerNewTilePos = {
      tx: playerNewTilePos.tx + playerXDir,
      ty: playerNewTilePos.ty + playerYDir,
    };

    if (playerNewTilePos.tx < 0) return;
    if (playerNewTilePos.ty < 0) return;
    if (playerNewTilePos.tx >= 20) return;
    if (playerNewTilePos.ty >= 15) return;

    // 静mapの衝突判定
    if (this.map.mapGround[playerNewTilePos.ty][playerNewTilePos.tx] == 1)
      return;

    this.playerTilePos = playerNewTilePos;
    this.playerIsWalking = true;
    this.gridWalkTween(
      this.player,
      this.playerWalkSpeed,
      playerXDir,
      playerYDir,
      () => {
        this.playerIsWalking = false;
      }
    );
    this.enemy.moveEnemy(playerNewTilePos);
  }

  private playerAnimConfig(config: {
    key: string;
    frameStart: number;
    frameEnd: number;
  }): Phaser.Types.Animations.Animation {
    return {
      key: config.key,
      frames: this.anims.generateFrameNumbers("katopan", {
        start: config.frameStart,
        end: config.frameEnd,
      }),
      frameRate: 8,
      repeat: -1,
    };
  }

  private gridWalkTween(
    target: any,
    baseSpeed: number,
    xDir: MoveDir,
    yDir: MoveDir,
    onComplete: () => void
  ) {
    if (target.x === false) return;
    if (target.y === false) return;

    const tween: Phaser.Tweens.Tween = this.add.tween({
      // 対象のオブジェクト
      targets: [target],
      // X座標の移動を設定
      x: {
        getStart: () => target.x,
        getEnd: () => target.x + baseSpeed * xDir,
      },
      // X座標の移動を設定
      y: {
        getStart: () => target.y,
        getEnd: () => target.y + baseSpeed * yDir,
      },
      // アニメーションの時間
      duration: 300,
      // アニメーション終了時に発火するコールバック
      onComplete: () => {
        tween.stop(); // Tweenオブジェクトの削除
        onComplete(); // 引数の関数実行
      },
    });
  }
}
