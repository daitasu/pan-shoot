import { MoveDir, TilePos } from "../scenes/game";
import { abs } from "../utils/math";

export default class Enemy {
  private scene: Phaser.Scene;
  private enemy?: Phaser.GameObjects.Sprite;
  private enemyTilePos: { tx: number; ty: number };
  private enemyWalkSpeed = 40;
  private enemyIsWalking: boolean;

  constructor(
    map_ground_layer: Phaser.Tilemaps.TilemapLayer,
    scene: Phaser.Scene
  ) {
    this.scene = scene;
    this.enemyTilePos = { tx: 1, ty: 2 }; // enemy 初期位置をタイル基準で設定

    const enemyPos: Phaser.Math.Vector2 = map_ground_layer.tileToWorldXY(
      this.enemyTilePos.tx,
      this.enemyTilePos.ty
    );

    this.enemy = scene.add.sprite(enemyPos.x, enemyPos.y, "demon", 0);
    this.enemy.setOrigin(0);
    this.enemy.setDisplaySize(40, 40);
  }

  moveEnemy(playerTilePos: TilePos) {
    if (this.enemyIsWalking) return;

    // x, y 方向のうちより遠い距離を詰める
    const xTileCntToPlayer = abs(playerTilePos.tx - this.enemyTilePos.tx);
    const yTileCntToPlayer = abs(playerTilePos.ty - this.enemyTilePos.ty);

    if (xTileCntToPlayer > yTileCntToPlayer) {
      this.setNewPosition(playerTilePos, "tx");
    } else if (yTileCntToPlayer > xTileCntToPlayer) {
      this.setNewPosition(playerTilePos, "ty");
    } else {
      this.setNewPosition(
        playerTilePos,
        Phaser.Math.Between(0, 1) === 0 ? "tx" : "ty"
      );
    }
  }

  private setNewPosition(playerTilePos: TilePos, dir: "tx" | "ty"): TilePos {
    let enemyDir: MoveDir = 0;
    let enemyNewTilePos: TilePos = this.enemyTilePos;

    // player と enemy の指定方向座標が一致なら早期return
    if (this.enemyTilePos[dir] === playerTilePos[dir]) return;

    if (this.enemyTilePos[dir] < playerTilePos[dir]) {
      enemyDir = 1;
    } else {
      enemyDir = -1;
    }

    const xDir = dir === "tx" ? enemyDir : 0;
    const yDir = dir === "ty" ? enemyDir : 0;

    // 方向要素を上書き
    enemyNewTilePos = {
      tx: enemyNewTilePos.tx + xDir,
      ty: enemyNewTilePos.ty + yDir,
    };

    this.enemyTilePos = enemyNewTilePos;

    this.gridWalkTween(this.enemy, this.enemyWalkSpeed, xDir, yDir, () => {
      this.enemyIsWalking = false;
    });
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

    const tween: Phaser.Tweens.Tween = this.scene.add.tween({
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
