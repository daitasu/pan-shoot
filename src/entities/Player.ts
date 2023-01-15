import { WalkAnimState, TilePos, MoveDirs } from "../types/game";
import Map from "./Map";
import { ONE_TILE_SIZE } from "../constants";
import Sprite from "./Sprite";
import Wepon from "./Wepon";

export default class Player extends Sprite {
  private _animState: WalkAnimState;
  private _mapGroundLayer: Phaser.Tilemaps.TilemapLayer;
  private _weponShooting: boolean;

  // player アニメーションを配列で設定
  private animations: { key: string; frameStart: number; frameEnd: number }[] =
    [
      { key: "walk_front", frameStart: 0, frameEnd: 2 },
      { key: "walk_left", frameStart: 3, frameEnd: 5 },
      { key: "walk_right", frameStart: 6, frameEnd: 8 },
      { key: "walk_back", frameStart: 9, frameEnd: 11 },
    ];

  constructor(
    mapGroundLayer: Phaser.Tilemaps.TilemapLayer,
    scene: Phaser.Scene
  ) {
    super(scene);

    this._animState = "";
    this._isWalking = false;
    this._tilePos = { tx: 10, ty: 8 }; // player 初期位置をタイル基準で設定
    this._mapGroundLayer = mapGroundLayer;

    const playerPos: Phaser.Math.Vector2 = mapGroundLayer.tileToWorldXY(
      this._tilePos.tx,
      this._tilePos.ty
    );

    this._sprite = scene.add.sprite(playerPos.x, playerPos.y, "katopan", 0);
    this._sprite.setOrigin(0);
    this._sprite.setDisplaySize(ONE_TILE_SIZE, ONE_TILE_SIZE);

    for (const animation of this.animations) {
      // ヒーローアニメーションの数だけループ
      if (scene.anims.create(this.animConfig(animation)) === false) continue; // もしfalseが戻って来ればこの後何もしない
    }

    this._sprite.anims.play("walk_stop");
  }

  /*
   * frame 設定を簡易にする
   */
  private animConfig(config: {
    key: string;
    frameStart: number;
    frameEnd: number;
  }): Phaser.Types.Animations.Animation {
    return {
      key: config.key,
      frames: this.scene.anims.generateFrameNumbers("katopan", {
        start: config.frameStart,
        end: config.frameEnd,
      }),
      frameRate: 8,
      repeat: -1,
    };
  }

  /*
   * playerの移動
   */
  controlPlayer(cursors: Phaser.Types.Input.Keyboard.CursorKeys, map: Map) {
    if (this._isWalking) return;

    let newAnimState: WalkAnimState = "";
    const moveDirs: MoveDirs = { x: 0, y: 0 };

    if (cursors.up.isDown) {
      newAnimState = "walk_back";
      moveDirs.y = -1;
    } else if (cursors.down.isDown) {
      newAnimState = "walk_front";
      moveDirs.y = 1;
    } else if (cursors.left.isDown) {
      newAnimState = "walk_left";
      moveDirs.x = -1;
    } else if (cursors.right.isDown) {
      newAnimState = "walk_right";
      moveDirs.x = 1;
    } else if (cursors.space.isDown) {
      // 武器を撃つ
      this.shootWepon();
      this._sprite.anims.stop();
      return;
    } else {
      this._sprite.anims.stop();
      return;
    }

    // 前回と状態が異なればplayer 挙動を変更
    if (this._animState != newAnimState) {
      this._sprite.anims.play(newAnimState);
      this._animState = newAnimState;
    }

    this.movePlayer(moveDirs, map);
  }

  movePlayer(moveDirs: MoveDirs, map: Map) {
    let newTilePos: TilePos = this._tilePos;

    // 外壁判定
    newTilePos = {
      tx: newTilePos.tx + moveDirs.x,
      ty: newTilePos.ty + moveDirs.y,
    };

    if (this.isOutOfField(newTilePos)) return;

    // 静mapの衝突判定
    if (map.mapGround[newTilePos.ty][newTilePos.tx] == 1) return;

    this._tilePos = newTilePos;
    this._isWalking = true;
    this.gridWalkTween(this._sprite, this._walkSpeed, moveDirs, () => {
      this._isWalking = false;
    });
  }

  // 武器オブジェクトを呼び出し、設置・移動
  shootWepon(): void {
    if (this._weponShooting) return;

    this._weponShooting = true;

    const wepon = new Wepon(this._mapGroundLayer, this.scene);
    wepon.shoot(this._tilePos, this._animState);

    const timer = this.scene.time.addEvent({
      delay: 500,
      loop: false,
    });
    timer.callback = () => (this._weponShooting = false);
  }

  get isWalking(): boolean {
    return this._isWalking;
  }

  get tilePos(): TilePos {
    return this._tilePos;
  }
}
