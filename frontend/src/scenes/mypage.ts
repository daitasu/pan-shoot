import * as Phaser from "phaser";
import { BK_COLOR } from "../constants";
import ReturnTitleText from "../entities/text/RetrunTitleText";
import UserRecordText from "../entities/text/UserRecordText";
import axios from "axios";

export class Mypage extends Phaser.Scene {
  async init() {
    try {
      // 既にログイン済みなら情報を流し込む
      const result = await axios.get("/api/me");
      console.log("result ->", result);
    } catch (err) {
      if (err.response.status === 401) {
        // Google ログインする
        window.location.href = "/api/login";
      } else {
        console.error(err);
      }
    }
  }

  create() {
    this.cameras.main.setBackgroundColor(BK_COLOR);

    new UserRecordText(this);
    new ReturnTitleText(this);
  }
}
