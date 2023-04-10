import PlainText from "./PlainText";

export default class UserRecordText extends PlainText {
  constructor(scene: Phaser.Scene, score?: number) {
    super(scene, { x: 550, y: 250 }, `今回の戦績: ${score || "-"}`, {
      style: {
        fontSize: "30px",
        padding: {
          x: 0,
          y: 32,
        },
        align: "left",
      },
    });
  }
}
