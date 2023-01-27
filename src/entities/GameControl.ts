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

  getEnemyMoveInterval() {
    const enemyMoveInterval = 1500 - (this.score / 40) * 100;
    return enemyMoveInterval > 200 ? enemyMoveInterval : 200;
  }

  getEnemyMaxCount() {
    return this.score / 50 + 2;
  }
}
