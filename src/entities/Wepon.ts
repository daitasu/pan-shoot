import Sprite from "./Sprite";
import { BASE_ANIM_DURATION, ONE_TILE_SIZE } from "../constants";
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

  constructor(map: Map, playerState: CharacterState, scene: Phaser.Scene) {
    super(scene, { animDuration: BASE_ANIM_DURATION * 0.7 });

    this._timer = scene.time.addEvent({
      delay: 100,
      loop: true,
    });

    this.setGround(map, playerState, scene);
  }

  protected move(map: Map): void {
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

  setGround(map: Map, playerState: CharacterState, scene: Phaser.Scene): void {
    let newWeponTilePos: TilePos;
    const moveDirs: MoveDirs = { x: 0, y: 0 };

    this._animState = playerState.animState;

    switch (this._animState) {
      case "":
      case "walk_front":
        moveDirs.y = 1;
        break;
      case "walk_left":
        moveDirs.x = -1;
        break;
      case "walk_right":
        moveDirs.x = 1;
        break;
      case "walk_back":
        moveDirs.y = -1;
        break;
      default:
        return;
    }

    newWeponTilePos = {
      tx: playerState.tilePos.tx + moveDirs.x,
      ty: playerState.tilePos.ty + moveDirs.y,
    };

    if (
      map.isOutOfField(newWeponTilePos) ||
      map.isObstacleArea(newWeponTilePos)
    ) {
      return;
    }

    this._tilePos = newWeponTilePos;
    this._moveDirs = moveDirs;

    const groundLayer = map.getGroundLayer();
    const weponPos: Phaser.Math.Vector2 = groundLayer.tileToWorldXY(
      newWeponTilePos.tx,
      newWeponTilePos.ty
    );
    this._sprite = scene.add.sprite(
      weponPos.x,
      weponPos.y,
      "chocopan",
      WEPON_TEXTURE[this._animState]
    );
    this._sprite.setOrigin(0);
    this._sprite.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);
  }

  protected stopMove() {
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
