import { ONE_TILE_SIZE } from "../constants";
import {
  MoveDirs,
  TilePos,
  WalkAnimState,
  CharacterState,
} from "../types/game";

export default class Sprite {
  protected scene: Phaser.Scene;
  protected _sprite: Phaser.GameObjects.Sprite;
  protected _tilePos: { tx: number; ty: number };
  protected _isWalking: boolean;
  protected _animState: WalkAnimState;
  protected _walkSpeed: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this._animState = "";
    this._walkSpeed = ONE_TILE_SIZE;
  }

  protected gridWalkTween(
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

  getCharactorState(): CharacterState {
    return {
      animState: this._animState,
      tilePos: this._tilePos,
    };
  }
}
