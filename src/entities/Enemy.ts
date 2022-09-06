import { TilePos, MoveDirs } from "../types/game";
import { abs } from "../utils/math";
import Player from "./Player";
import { ONE_TILE_SIZE } from "../constants";

export default class Enemy {
  private scene: Phaser.Scene;
  private enemy?: Phaser.GameObjects.Sprite;
  private enemyTilePos: { tx: number; ty: number };
  private enemyIsWalking: boolean;
  private walkSpeed = ONE_TILE_SIZE;

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
    this.enemy.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);
  }

  moveEnemy(player: Player) {
    if (this.enemyIsWalking) return;

    // x, y 方向のうちより遠い距離を詰める
    const xTileCntToPlayer = abs(player.tilePos.tx - this.enemyTilePos.tx);
    const yTileCntToPlayer = abs(player.tilePos.ty - this.enemyTilePos.ty);

    if (xTileCntToPlayer > yTileCntToPlayer) {
      this.setNewPosition(player.tilePos, "tx");
    } else if (yTileCntToPlayer > xTileCntToPlayer) {
      this.setNewPosition(player.tilePos, "ty");
    } else {
      this.setNewPosition(
        player.tilePos,
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
