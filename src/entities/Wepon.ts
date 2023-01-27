import Sprite from "./Sprite";
import { ONE_TILE_SIZE } from "../constants";
import { CharacterState, MoveDirs, TilePos } from "../types/game";
import Map from "./Map";

const WEPON_TEXTURE = {
  walk_front: 0,
  walk_left: 1,
  walk_right: 2,
  walk_back: 3,
};

export default class Wepon extends Sprite {
  private _moveDirs: MoveDirs;
  private _timer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene) {
    super(scene);

    this._timer = scene.time.addEvent({
      delay: 200,
      loop: true,
    });
  }

  private move(map: Map) {
    if (this._isWalking || !this._tilePos) return;

    let newWeponTilePos: TilePos = this._tilePos;

    newWeponTilePos = {
      tx: newWeponTilePos.tx + this._moveDirs.x,
      ty: newWeponTilePos.ty + this._moveDirs.y,
    };

    // 外壁判定
    if (
      map.isOutOfField(newWeponTilePos) ||
      map.isObstacleArea(newWeponTilePos)
    ) {
      this.destroy();
    }

    this._tilePos = newWeponTilePos;
    this._isWalking = true;
    this.gridWalkTween(this._sprite, this._moveDirs, () => {
      this._isWalking = false;
    });
  }

  setGround(
    map: Map,
    playerState: CharacterState,
    callbackAfterMove?: () => void
  ): TilePos | null {
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

    if (
      map.isOutOfField(newWeponTilePos) ||
      map.isObstacleArea(newWeponTilePos)
    ) {
      return null;
    }

    this._tilePos = newWeponTilePos;
    this._moveDirs = moveDirs;

    const groundLayer = map.getGroundLayer();
    const weponPos: Phaser.Math.Vector2 = groundLayer.tileToWorldXY(
      newWeponTilePos.tx,
      newWeponTilePos.ty
    );
    this._sprite = this.scene.add.sprite(
      weponPos.x,
      weponPos.y,
      "chocopan",
      WEPON_TEXTURE[this._animState]
    );
    this._sprite.setOrigin(0);
    this._sprite.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);

    if (callbackAfterMove) callbackAfterMove();

    return this._tilePos;
  }

  private stopMove() {
    this._timer.remove();
  }

  startMove(map: Map, callbackAfterMove?: () => void) {
    this._timer.callback = () => {
      this.move(map);

      if (callbackAfterMove) callbackAfterMove();
    };
  }

  destroy() {
    this.stopMove();
    this._sprite.destroy();
  }
}
