import PlainText from "./PlainText";

export default class GameOverText extends PlainText {
  constructor(scene: Phaser.Scene) {
    super(scene, { x: 400, y: 250 }, "GAME OVER", {
      style: {
        color: "#FF0000",
        fontSize: "100px",
      },
    });
  }
}
