﻿import { TilePos, MoveDirs, CharacterState } from "../types/game";
import { abs } from "../utils/math";
import Sprite from "./Sprite";
import { ONE_TILE_SIZE } from "../constants";
import Map from "./Map";

export default class Enemy extends Sprite {
  constructor(map: Map, scene: Phaser.Scene) {
    super(scene);
    this._isWalking = false;

    // 出現位置を端から算出
    if (Phaser.Math.Between(0, 1) === 0) {
      this._tilePos = {
        tx: -1,
        ty: Phaser.Math.Between(0 - 1, map.mapTileLendth.yl),
      };
    } else {
      this._tilePos = {
        tx: Phaser.Math.Between(0 - 1, map.mapTileLendth.xl),
        ty: -1,
      };
    }

    const enemyPos: Phaser.Math.Vector2 = map.mapGroundLayer.tileToWorldXY(
      this._tilePos.tx,
      this._tilePos.ty
    );
    this._sprite = scene.add.sprite(enemyPos.x, enemyPos.y, "demon", 0);
    this._sprite.setOrigin(0);
    this._sprite.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);
  }

  moveEnemy(playerState: CharacterState) {
    if (this._isWalking) return;

    // x, y 方向のうちより遠い距離を詰める
    const xTileCntToPlayer = abs(playerState.tilePos.tx - this._tilePos.tx);
    const yTileCntToPlayer = abs(playerState.tilePos.ty - this._tilePos.ty);

    if (xTileCntToPlayer > yTileCntToPlayer) {
      this.setNewPosition(playerState.tilePos, "tx");
    } else if (yTileCntToPlayer > xTileCntToPlayer) {
      this.setNewPosition(playerState.tilePos, "ty");
    } else {
      this.setNewPosition(
        playerState.tilePos,
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

    this.gridWalkTween(this._sprite, this._walkSpeed, moveDirs, () => {
      this._isWalking = false;
    });
  }

  destroy() {
    this._sprite.destroy();
  }
}
