import * as Phaser from "phaser";
import { BK_COLOR } from "../constants";
import ReturnTitleText from "../entities/text/RetrunTitleText";
import UserRecordText from "../entities/text/UserRecordText";

export class Mypage extends Phaser.Scene {
  init() {
    // TODO:routing を /mypage にする
  }

  create() {
    this.cameras.main.setBackgroundColor(BK_COLOR);

    new UserRecordText(this);
    new ReturnTitleText(this);
  }
}
