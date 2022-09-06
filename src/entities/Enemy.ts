import { TilePos, MoveDirs } from "../types/game";
import { abs } from "../utils/math";
import Player from "./Player";
import { ONE_TILE_SIZE } from "../constants";

export default class Enemy {
  private scene: Phaser.Scene;
  private enemy?: Phaser.GameObjects.Sprite;
  private _tilePos: { tx: number; ty: number };
  private walkSpeed = ONE_TILE_SIZE;
  private _isWalking: boolean;

  constructor(
    mapGroundLayer: Phaser.Tilemaps.TilemapLayer,
    scene: Phaser.Scene
  ) {
    this.scene = scene;
    this._tilePos = { tx: 1, ty: 2 }; // enemy 初期位置をタイル基準で設定

    const enemyPos: Phaser.Math.Vector2 = mapGroundLayer.tileToWorldXY(
      this._tilePos.tx,
      this._tilePos.ty
    );

    this.enemy = scene.add.sprite(enemyPos.x, enemyPos.y, "demon", 0);
    this.enemy.setOrigin(0);
    this.enemy.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);
  }

  moveEnemy(player: Player) {
    if (this._isWalking) return;

    // x, y 方向のうちより遠い距離を詰める
    const xTileCntToPlayer = abs(player.tilePos.tx - this._tilePos.tx);
    const yTileCntToPlayer = abs(player.tilePos.ty - this._tilePos.ty);

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

  private setNewPosition(playerTilePos: TilePos, dir: "tx" | "ty") {
    const moveDirs: MoveDirs = { x: 0, y: 0 };
    let enemyNewTilePos: TilePos = this._tilePos;

    // player と enemy の指定方向座標が一致なら早期return
    if (this._tilePos[dir] === playerTilePos[dir]) return;

    switch (dir) {
      case "tx":
        moveDirs.x = this._tilePos[dir] < playerTilePos[dir] ? 1 : -1;
        break;
      case "ty":
        moveDirs.y = this._tilePos[dir] < playerTilePos[dir] ? 1 : -1;
    }

    // 方向要素を上書き
    enemyNewTilePos = {
      tx: enemyNewTilePos.tx + moveDirs.x,
      ty: enemyNewTilePos.ty + moveDirs.y,
    };

    this._tilePos = enemyNewTilePos;

    this.gridWalkTween(this.enemy, this.walkSpeed, moveDirs, () => {
      this._isWalking = false;
    });
  }

  private gridWalkTween(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
    baseSpeed: number,
    moveDirs: MoveDirs,
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
        getEnd: () => target.x + baseSpeed * moveDirs.x,
      },
      // X座標の移動を設定
      y: {
        getStart: () => target.y,
        getEnd: () => target.y + baseSpeed * moveDirs.y,
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
