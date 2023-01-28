import { TilePos, MoveDirs, CharacterState } from "../types/game";
import { abs, random } from "../utils/math";
import Sprite from "./Sprite";
import { ONE_TILE_SIZE } from "../constants";
import Map from "./Map";
import Player from "./Player";

export default class Enemy extends Sprite {
  private _timer: Phaser.Time.TimerEvent;

  constructor(map: Map, moveInterval: number, scene: Phaser.Scene) {
    super(scene);
    this._isWalking = false;
    this._timer = scene.time.addEvent({
      delay: moveInterval,
      loop: true,
    });

    const groundTileLength = map.getGroundTileLendth();

    // 出現位置を端から算出
    if (random(0, 1) === 0) {
      this._tilePos = {
        tx: random(0, 1) === 0 ? -1 : groundTileLength.xl,
        ty: random(0 - 1, groundTileLength.yl),
      };
    } else {
      this._tilePos = {
        tx: random(0 - 1, groundTileLength.xl),
        ty: random(0, 1) === 0 ? -1 : groundTileLength.yl,
      };
    }

    const groundLayer = map.getGroundLayer();
    const enemyPos: Phaser.Math.Vector2 = groundLayer.tileToWorldXY(
      this._tilePos.tx,
      this._tilePos.ty
    );
    this._sprite = scene.add.sprite(enemyPos.x, enemyPos.y, "demon", 0);
    this._sprite.setOrigin(0);
    this._sprite.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);
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

    this.gridWalkTween(this._sprite, moveDirs, () => {
      this._tilePos = enemyNewTilePos;
      this._isWalking = false;
    });
  }

  protected move(playerState: CharacterState) {
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
        random(0, 1) === 0 ? "tx" : "ty"
      );
    }
  }

  private stopMove() {
    this._timer.remove();
  }

  startMove(player: Player) {
    this._timer.callback = () => {
      this.move(player.getCharactorState());
    };
  }

  destroy() {
    this.stopMove();
    this._sprite.destroy();
  }
}
