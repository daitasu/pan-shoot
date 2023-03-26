import ClickableText from "./ClickableText";

export default class RetryText extends ClickableText {
  constructor(scene: Phaser.Scene) {
    super(scene, { x: 400, y: 500 }, "RETRY", {
      style: {
        fontSize: "70px",
      },
    });

    const innerText = super.getTextObject();

    innerText.on("pointerdown", () => {
      scene.scene.start("preload");
    });
  }
}
