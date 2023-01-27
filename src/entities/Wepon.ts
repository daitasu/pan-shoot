import Sprite from "./Sprite";
import { ONE_TILE_SIZE } from "../constants";
import { CharacterState, MoveDirs, TilePos } from "../types/game";

export default class Wepon extends Sprite {
  private _mapGroundLayer: Phaser.Tilemaps.TilemapLayer;
  private _moveDirs: MoveDirs;
  private _timer: Phaser.Time.TimerEvent;

  constructor(
    mapGroundLayer: Phaser.Tilemaps.TilemapLayer,
    scene: Phaser.Scene
  ) {
    super(scene);

    this._mapGroundLayer = mapGroundLayer;
    this._timer = scene.time.addEvent({
      delay: 200,
      loop: true,
    });
  }

  private move() {
    if (this._isWalking) return;

    let newWeponTilePos: TilePos = this._tilePos;

    newWeponTilePos = {
      tx: newWeponTilePos.tx + this._moveDirs.x,
      ty: newWeponTilePos.ty + this._moveDirs.y,
    };

    // 外壁判定
    if (this.isOutOfField(newWeponTilePos)) {
      this._sprite.destroy();
    }

    this._tilePos = newWeponTilePos;
    this._isWalking = true;
    this.gridWalkTween(this._sprite, this._walkSpeed, this._moveDirs, () => {
      this._isWalking = false;
    });
  }

  setGround(playerState: CharacterState, callbackAfterMove?: () => void): void {
    let newWeponTilePos: TilePos;
    const moveDirs: MoveDirs = { x: 0, y: 0 };

    if (
      playerState.animState === "walk_front" ||
      playerState.animState === ""
    ) {
      this._animState = "walk_front";
      moveDirs.y = 1;
      newWeponTilePos = {
        tx: playerState.tilePos.tx,
        ty: playerState.tilePos.ty + 1,
      };
    } else if (playerState.animState === "walk_left") {
      this._animState = "walk_left";
      moveDirs.x = -1;
      newWeponTilePos = {
        tx: playerState.tilePos.tx - 1,
        ty: playerState.tilePos.ty,
      };
    } else if (playerState.animState === "walk_right") {
      this._animState = "walk_right";
      moveDirs.x = 1;
      newWeponTilePos = {
        tx: playerState.tilePos.tx + 1,
        ty: playerState.tilePos.ty,
      };
    } else if (playerState.animState === "walk_back") {
      this._animState = "walk_back";
      moveDirs.y = -1;
      newWeponTilePos = {
        tx: playerState.tilePos.tx,
        ty: playerState.tilePos.ty - 1,
      };
    }

    // 外壁判定
    if (this.isOutOfField(newWeponTilePos)) return;

    this._tilePos = newWeponTilePos;
    this._moveDirs = moveDirs;

    const weponPos: Phaser.Math.Vector2 = this._mapGroundLayer.tileToWorldXY(
      newWeponTilePos.tx,
      newWeponTilePos.ty
    );
    this._sprite = this.scene.add.sprite(weponPos.x, weponPos.y, "chocopan", 0);
    this._sprite.setOrigin(0);
    this._sprite.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);

    if (callbackAfterMove) callbackAfterMove();
  }

  private stopMove() {
    this._timer.remove();
  }

  startMove(callbackAfterMove?: () => void) {
    this._timer.callback = () => {
      this.move();

      if (callbackAfterMove) callbackAfterMove();
    };
  }

  destroy() {
    this.stopMove();
    this._sprite.destroy();
  }
}
