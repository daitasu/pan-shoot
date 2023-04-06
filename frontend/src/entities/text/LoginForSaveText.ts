import ClickableText from "./ClickableText";

export default class LoginForSaveText extends ClickableText {
  constructor(scene: Phaser.Scene) {
    super(scene, { x: 400, y: 400 }, "Googleログインして記録を見る", {
      style: {
        fontSize: "50px",
      },
    });

    const innerText = super.getTextObject();

    innerText.on("pointerdown", async () => {
      window.location.href = window.location.origin + "/static/?scene=mypage";
    });
  }
}
