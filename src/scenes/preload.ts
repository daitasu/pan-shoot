import * as Phaser from "phaser";
import { fontStyle } from "../utils/fontStyle";

type Text = Phaser.GameObjects.Text;

export class Preload extends Phaser.Scene {
  init() {
    console.log("Preloading");
  }

  create() {
    const BK_COLOR = "#101617";

    this.cameras.main.setBackgroundColor(BK_COLOR);
    const startText: Text = this.add.text(
      400,
      520,
      "START",
      fontStyle("#FFF", "70px")
    );
    const descriptionText: Text = this.add.text(
      400,
      430,
      "パンを放とう\n\n移動: ←↑↓→\nshoot: space",
      fontStyle("#DDD", "18px")
    );

    startText.setOrigin(0.5);
    descriptionText.setOrigin(0.5);
    descriptionText.setAlign("center");

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
