import { ONE_TILE_SIZE } from "../constants";
import { MapGround, TilePos } from "../types/game";

export default class Map {
  private map?: Phaser.Tilemaps.Tilemap;
  private tiles?: Phaser.Tilemaps.Tileset;
  private ground_layer: Phaser.Tilemaps.TilemapLayer;

  private ground: MapGround = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
  ]; // 20 * 15

  constructor(scene: Phaser.Scene) {
    this.map = scene.make.tilemap({
      data: this.ground,
      tileWidth: ONE_TILE_SIZE,
      tileHeight: ONE_TILE_SIZE,
    });

    this.tiles = this.map.addTilesetImage("mapTiles");
    this.ground_layer = this.map.createLayer(0, this.tiles, 0, 0);
  }

  tileToWorldXY(tilePos: TilePos): Phaser.Math.Vector2 {
    return this.ground_layer.tileToWorldXY(tilePos.tx, tilePos.ty);
  }

  // 外壁判定
  isOutOfField(tilePos: TilePos): boolean {
    return (
      tilePos.tx < 0 ||
      tilePos.ty < 0 ||
      tilePos.tx >= this.getGroundTileLendth().xl ||
      tilePos.ty >= this.getGroundTileLendth().yl
    );
  }

  isObstacleArea(tilePos: TilePos): boolean {
    return this.ground[tilePos.ty][tilePos.tx] == 1;
  }

  getGroundLayer(): Phaser.Tilemaps.TilemapLayer {
    return this.ground_layer;
  }

  getGroundTileLendth(): { xl: number; yl: number } {
    return {
      xl: this.ground[0].length,
      yl: this.ground.length,
    };
  }
}
