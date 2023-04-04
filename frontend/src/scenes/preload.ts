import * as Phaser from "phaser";
import { fontStyle } from "../utils/text";
import { Text } from "../types/game";
import { getParam, isExactPath } from "../utils/routes";

export class Preload extends Phaser.Scene {
  init() {
    console.log("Preloading");

    const sceneName = getParam("scene");

    if (sceneName === "mypage") {
      this.scene.start("mypage");
    }
  }

  preload() {
    this.load.image("main_visual", "images/game_main_visual.png");
  }

  create() {
    const BK_COLOR = "#101617";

    this.cameras.main.setBackgroundColor(BK_COLOR);
    const mainVisual = this.add.image(400, 250, "main_visual");
    const startText: Text = this.add.text(
      400,
      520,
      "START",
      fontStyle("#FFF", "70px")
    );
    const descriptionText: Text = this.add.text(
      400,
      435,
      "移動: ←↑↓→\nshoot: space",
      fontStyle("#DDD", "18px")
    );

    mainVisual.setScale(0.85);
    startText.setOrigin(0.5);
    descriptionText.setOrigin(0.5).setAlign("center");

    startText.setInteractive({
      useHandCursor: true,
    });

    startText.on("pointerover", () => {
      startText.setStyle({ color: "#F11C32" });
    });

    startText.on("pointerout", () => {
      startText.setStyle({ color: "#FFF" });
    });

    startText.on("pointerdown", () => {
      this.scene.start("game");
    });
  }
}
