import ClickableText from "./ClickableText";

export default class ReturnTitleText extends ClickableText {
  constructor(scene: Phaser.Scene) {
    super(scene, { x: 400, y: 520 }, "タイトルへ戻る", {
      style: {
        fontSize: "40px",
      },
    });

    const innerText = super.getTextObject();

    innerText.on("pointerdown", () => {
      window.location.assign("/static/");
      scene.scene.start("preload");
    });
  }
}
