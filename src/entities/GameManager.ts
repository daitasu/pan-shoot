import { MoveDir, MoveDirs, WalkAnimState } from "../types/game";
import Map from "./Map";
import Player from "./Player";

export default class GameManager {
  private gameLevel: number;
  private score: number;

  constructor() {
    this.gameLevel = 1;
    this.score = 0;
  }

  controlPlayer(
    cursors: Phaser.Types.Input.Keyboard.CursorKeys,
    player: Player,
    map: Map
  ) {
    // console.log("start:");

    let newAnimState: WalkAnimState = "";
    const moveDirs: MoveDirs = { x: 0, y: 0 };

    if (cursors.up.isDown) {
      newAnimState = "walk_back";
      moveDirs.y = -1;
    } else if (cursors.down.isDown) {
      newAnimState = "walk_front";
      moveDirs.y = 1;
    } else if (cursors.left.isDown) {
      newAnimState = "walk_left";
      moveDirs.x = -1;
    } else if (cursors.right.isDown) {
      newAnimState = "walk_right";
      moveDirs.x = 1;
    }
    player.changeAnimState(newAnimState);

    if (newAnimState) {
      player.move(map, moveDirs);
    }
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
