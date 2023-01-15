﻿import { TilePos, MoveDirs } from "../types/game";
import { abs } from "../utils/math";
import Player from "./Player";
import Sprite from "./Sprite";
import { ONE_TILE_SIZE } from "../constants";

export default class Enemy extends Sprite {
  constructor(
    mapGroundLayer: Phaser.Tilemaps.TilemapLayer,
    scene: Phaser.Scene
  ) {
    super(scene);
    this._isWalking = false;
    this._tilePos = { tx: 1, ty: 2 }; // enemy 初期位置をタイル基準で設定

    const enemyPos: Phaser.Math.Vector2 = mapGroundLayer.tileToWorldXY(
      this._tilePos.tx,
      this._tilePos.ty
    );
    this._sprite = scene.add.sprite(enemyPos.x, enemyPos.y, "demon", 0);
    this._sprite.setOrigin(0);
    this._sprite.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);
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

    this.gridWalkTween(this._sprite, this._walkSpeed, moveDirs, () => {
      this._isWalking = false;
    });
  }
}