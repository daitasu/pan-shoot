import * as Phaser from "phaser";
import { BK_COLOR } from "../constants";
import ReturnTitleText from "../entities/text/RetrunTitleText";
import UserRecordText from "../entities/text/UserRecordText";
import axios from "axios";
import PlainText from "../entities/text/PlainText";

export class Mypage extends Phaser.Scene {
  private profileImage: string;
  private profileName: string;

  async init() {
    try {
      // 既にログイン済みなら情報を流し込む
      const { data } = await axios.get("/api/me");
      if (data) {
        this.profileImage = data.picture;
        this.profileName = data.name;
      }
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

    // Ranking Title
    new PlainText(this, { x: 150, y: 50 }, "RANKING TOP 10", {
      style: {
        color: "#ffffff",
        fontSize: "30px",
      },
    });
    // Ranking User
    new PlainText(
      this,
      { x: 60, y: 330 },
      "1. -\n\n2. -\n\n3. -\n\n4. -\n\n5. -\n\n6. -\n\n7. -\n\n8. -\n\n9. -\n\n10. -\n\n",
      {
        style: {
          color: "#ffffff",
          fontSize: "20px",
        },
      }
    );

    setTimeout(() => {
      new UserRecordText(this, this.profileName);
    }, 1000);
    new ReturnTitleText(this);
  }
}
