import { ONE_TILE_SIZE, BASE_ANIM_DURATION } from "../constants";
import {
  MoveDirs,
  TilePos,
  WalkAnimState,
  CharacterState,
} from "../types/game";

export default abstract class Sprite {
  protected scene: Phaser.Scene;
  protected _sprite: Phaser.GameObjects.Sprite;
  protected _tilePos: TilePos;
  protected _isWalking: boolean;
  protected _animState: WalkAnimState;
  protected _walkSpeed: number;

  constructor(scene: Phaser.Scene, spriteConfig?: { animDuration: number }) {
    this.scene = scene;
    this._animState = "walk_front";
    this._walkSpeed = spriteConfig?.animDuration || BASE_ANIM_DURATION;
  }

  protected abstract move(...attrs: any[]): void;

  abstract destroy(): void;

  /*
   * frame 設定を簡易にする
   */
  protected animConfig(
    frameKey: string,
    config: {
      key: string;
      frameStart: number;
      frameEnd: number;
    }
  ): Phaser.Types.Animations.Animation {
    return {
      key: config.key,
      frames: this.scene.anims.generateFrameNumbers(frameKey, {
        start: config.frameStart,
        end: config.frameEnd,
      }),
      frameRate: 8,
      repeat: -1,
    };
  }

  /*
   * 配置移動時にアニメーションを入れる
   */
  protected gridWalkTween(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    target: any,
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
        getEnd: () => target.x + ONE_TILE_SIZE * moveDirs.x,
      },
      // X座標の移動を設定
      y: {
        getStart: () => target.y,
        getEnd: () => target.y + ONE_TILE_SIZE * moveDirs.y,
      },
      // アニメーションの時間
      duration: this._walkSpeed,
      // アニメーション終了時に発火するコールバック
      onComplete: () => {
        tween.stop();
        onComplete();
      },
    });
  }

  getCharactorState(): CharacterState {
    return {
      animState: this._animState,
      tilePos: this._tilePos,
    };
  }
}
