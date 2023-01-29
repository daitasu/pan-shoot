export type Text = Phaser.GameObjects.Text;
export type TilePos = { tx: number; ty: number };
export type MoveDir = -1 | 0 | 1; // 追加
export type MoveDirs = { x: MoveDir; y: MoveDir };
export type MapGround = number[][];

export type WalkAnimState =
  | "walk_front"
  | "walk_back"
  | "walk_left"
  | "walk_right";

export type CharacterState = {
  animState: WalkAnimState;
  tilePos: TilePos;
};
