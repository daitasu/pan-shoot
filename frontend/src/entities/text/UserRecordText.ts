import PlainText from "./PlainText";

export default class UserRecordText extends PlainText {
  constructor(scene: Phaser.Scene, username: string, score?: number) {
    super(
      scene,
      { x: 500, y: 250 },
      `${username}\n\n今回の戦績: ${score || "-"}`,
      {
        style: {
          fontSize: "30px",
          padding: {
            x: 0,
            y: 32,
          },
          align: "left",
        },
      }
    );
  }
}
