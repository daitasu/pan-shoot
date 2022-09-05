export type TilePos = { tx: number; ty: number };
export type MoveDir = -1 | 0 | 1; // 追加
export type WalkAnimState =
  | "walk_front"
  | "walk_back"
  | "walk_left"
  | "walk_right"
  | "";
