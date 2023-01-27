export default class GameControl {
  private gameLevel: number;
  private score: number;

  constructor() {
    this.gameLevel = 1;
    this.score = 0;
  }

  upScore() {
    this.score += 10;
  }

  getScore() {
    return this.score;
  }

  getEnemyMaxCount() {
    return this.score / 50 + 2;
  }
}
