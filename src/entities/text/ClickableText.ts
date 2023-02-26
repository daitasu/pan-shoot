import { DEFAULT_TEXT_OPTIONS } from "../../constants";
import { TextOptions, Text } from "../../types/game";
import PlainText from "./PlainText";

export default class ClickableText extends PlainText {
  constructor(
    scene: Phaser.Scene,
    position: { x: number; y: number },
    text: string,
    options?: TextOptions
  ) {
    const textOptions = {
      ...DEFAULT_TEXT_OPTIONS,
      ...options,
      style: {
        ...DEFAULT_TEXT_OPTIONS.style,
        ...options?.style,
      },
    };

    super(scene, position, text, textOptions);

    const innerText = super.getTextObject();

    innerText.setInteractive({
      useHandCursor: true,
    });
    innerText.on("pointerover", () => {
      innerText.setStyle({ color: "#F11C32" });
    });

    innerText.on("pointerout", () => {
      innerText.setStyle({ color: textOptions.style.color });
    });
  }

  getTextObject(): Text {
    return super.getTextObject();
  }
}
