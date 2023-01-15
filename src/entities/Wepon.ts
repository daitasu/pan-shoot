import Sprite from "./Sprite";
import { ONE_TILE_SIZE } from "../constants";
import { MoveDirs, TilePos, WalkAnimState } from "../types/game";

export default class Wepon extends Sprite {
  private _mapGroundLayer: Phaser.Tilemaps.TilemapLayer;
  private _animState: WalkAnimState;
  private _moveDirs: MoveDirs;

  constructor(
    mapGroundLayer: Phaser.Tilemaps.TilemapLayer,
    scene: Phaser.Scene
  ) {
    super(scene);

    this._mapGroundLayer = mapGroundLayer;
  }

  setGround(playerTilePos: TilePos, playerAnimState: WalkAnimState): void {
    let newWeponTilePos: TilePos;
    const moveDirs: MoveDirs = { x: 0, y: 0 };

    if (playerAnimState === "walk_front" || playerAnimState === "") {
      this._animState = "walk_front";
      moveDirs.y = 1;
      newWeponTilePos = {
        tx: playerTilePos.tx,
        ty: playerTilePos.ty + 1,
      };
    } else if (playerAnimState === "walk_left") {
      this._animState = "walk_left";
      moveDirs.x = -1;
      newWeponTilePos = {
        tx: playerTilePos.tx - 1,
        ty: playerTilePos.ty,
      };
    } else if (playerAnimState === "walk_right") {
      this._animState = "walk_right";
      moveDirs.x = 1;
      newWeponTilePos = {
        tx: playerTilePos.tx + 1,
        ty: playerTilePos.ty,
      };
    } else if (playerAnimState === "walk_back") {
      this._animState = "walk_back";
      moveDirs.y = -1;
      newWeponTilePos = {
        tx: playerTilePos.tx,
        ty: playerTilePos.ty - 1,
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
  }

  move() {
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

  shoot(playerTilePos: TilePos, playerAnimState: WalkAnimState): void {
    this.setGround(playerTilePos, playerAnimState);

    let timer = this.scene.time.addEvent({
      delay: 300,
      loop: true,
    });

    timer.callback = () => this.move();
  }
}
