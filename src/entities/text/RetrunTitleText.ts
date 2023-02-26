import ClickableText from "./ClickableText";

export default class ReturnTitleText extends ClickableText {
  constructor(scene: Phaser.Scene) {
    super(scene, { x: 500, y: 500 }, "タイトルへ戻る", {
      style: {
        fontSize: "40px",
      },
    });

    const innerText = super.getTextObject();

    innerText.on("pointerdown", () => {
      window.location.assign("/");
      scene.scene.start("preload");
    });
  }
}
