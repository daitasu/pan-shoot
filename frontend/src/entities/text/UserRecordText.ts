import PlainText from "./PlainText";

export default class UserRecordText extends PlainText {
  constructor(scene: Phaser.Scene) {
    const score = sessionStorage.getItem("score");
    const displayScore =
      !!score && parseInt(score, 10) ? parseInt(score, 10) : "-";

    super(scene, { x: 500, y: 250 }, `今回の戦績: ${displayScore}`, {
      style: {
        fontSize: "30px",
        padding: {
          x: 0,
          y: 32,
        },
      },
    });
  }
}
