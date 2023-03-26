import { fontStyle } from "../../utils/text";
import { TextOptions } from "../../types/game";
import { Text } from "../../types/game";
import { DEFAULT_TEXT_OPTIONS } from "../../constants";

export default class PlainText {
  private innerText: Text;

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

    this.innerText = scene.add.text(
      position.x,
      position.y,
      text,
      textOptions.style
    );

    this.innerText.setOrigin(textOptions.origin);
    this.innerText.setDepth(textOptions.depth);
  }

  getTextObject(): Text {
    return this.innerText;
  }
}
