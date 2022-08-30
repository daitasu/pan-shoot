import * as Phaser from "phaser";
import { Preload } from "./scenes/preload";
import { Game } from "./scenes/game";

//ゲームの基本設定
const config: Phaser.Types.Core.GameConfig = {
  title: "pan-shoot",
  version: "0.0.1",
  scale: {
    width: 800,
    height: 600,
    max: {
      width: 800,
      height: 600,
    },
    mode: Phaser.Scale.FIT,
  },
  parent: "game",
  type: Phaser.AUTO,
};

//ゲームメインのクラス
export class Main extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config); // Phaser.Gameクラスにconfigを渡す

    // シーンにキーを割り振って登録
    this.scene.add("preload", Preload, false);
    this.scene.add("game", Game, false);

    // シーンをスタート
    this.scene.start("preload");
  }
}

//windowイベントで、ロードされたらゲーム開始
window.addEventListener("load", () => {
  new Main(config);
});
