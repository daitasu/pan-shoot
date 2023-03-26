import ClickableText from "./ClickableText";

export default class LoginForSaveText extends ClickableText {
  constructor(scene: Phaser.Scene) {
    super(scene, { x: 400, y: 400 }, "登録/ログインして記録を保存", {
      style: {
        fontSize: "50px",
      },
    });

    const innerText = super.getTextObject();

    innerText.on("pointerdown", async () => {
    });
  }
}
