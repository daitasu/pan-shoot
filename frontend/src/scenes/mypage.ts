import Phaser from "phaser";
import CryptoJS from "crypto-js";
import ReturnTitleText from "../entities/text/RetrunTitleText";
import UserRecordText from "../entities/text/UserRecordText";
import axios from "axios";
import PlainText from "../entities/text/PlainText";

type Rank = {
  googleUserId: string;
  id: string;
  score: number;
  username: string;
};

export class Mypage extends Phaser.Scene {
  private profileName: string;
  private ranks: Rank[];
  private score: number;

  async init() {
    this.profileName = "";
    this.ranks = [];
    this.score = 0;

    try {
      // 既にログイン済みなら情報を流し込む
      const userInfoResponse = await axios.get("/api/me");
      if (userInfoResponse.data) {
        this.profileName = userInfoResponse.data.name;

        const cipherScore = sessionStorage.getItem("score");
        if (cipherScore) {
          const score = CryptoJS.AES.decrypt(cipherScore, "secret").toString(
            CryptoJS.enc.Utf8
          );

          if (!!score && parseInt(score, 10)) {
            this.score = parseInt(score, 10);
            // 記録を保存する
            await axios.post("/api/ranks", {
              googleUserId: userInfoResponse.data.id,
              username: userInfoResponse.data.name,
              score: this.score,
            });
            sessionStorage.clear();
          }
        }
      }
      const ranksResponse = await axios.get<Rank[]>("/api/ranks");
      if (ranksResponse.data) {
        this.ranks = ranksResponse.data;
      }
    } catch (err) {
      if (err.response?.status === 401) {
        // Google ログインする
        window.location.href = "/api/login";
      } else {
        console.error(err);
      }
    }
  }

  create() {
    // Ranking Title
    new PlainText(this, { x: 150, y: 50 }, "RANKING TOP 10", {
      style: {
        color: "#ffffff",
        fontSize: "30px",
      },
    });
    // Return
    new ReturnTitleText(this);

    setTimeout(() => {
      // Current Score
      new UserRecordText(this, this.score);

      for (let i = 0; i < 10; i++) {
        const test = !!this.ranks[i]
          ? `${this.ranks[i].score} / ${this.ranks[i].username}`
          : "-";
        const rankText = new PlainText(
          this,
          { x: 230, y: 100 + 40 * i },
          `${i + 1}. ${test}`,
          {
            style: {
              color: "#ffffff",
              fontSize: "20px",
              align: "left",
            },
          }
        );
        rankText.setFixedSize({ x: 400 });
      }
    }, 2000);
  }
}
