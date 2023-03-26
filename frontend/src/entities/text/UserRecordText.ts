import PlainText from "./PlainText";

export default class UserRecordText extends PlainText {
  constructor(scene: Phaser.Scene) {
    super(
      scene,
      { x: 500, y: 250 },
      "今回の戦績: - \n\n過去の戦績TOP3:\n  1. - \n  2. - \n  3. - ",
      {
        style: {
          fontSize: "30px",
          padding: {
            x: 0,
            y: 32,
          },
        },
      }
    );
  }
}
