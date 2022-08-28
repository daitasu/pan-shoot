import * as Phaser from "phaser";

type WalkAnimState = 'walk_front' | 'walk_back' | 'walk_left' | 'walk_right' | ''

export class Game extends Phaser.Scene {
  private map?: Phaser.Tilemaps.Tilemap
  private tiles?: Phaser.Tilemaps.Tileset
  private map_ground_layer?: any
  private player?: Phaser.GameObjects.Sprite
  private playerAnimState: WalkAnimState
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

  private map_ground: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0]
  ] // 20 * 15

  // player アニメーションを配列で設定
  private playerAnims: {key: string, frameStart: number, frameEnd: number}[] = [ 
    {key: 'walk_front', frameStart: 0, frameEnd: 2},
    {key: 'walk_left', frameStart: 3, frameEnd: 5},
    {key: 'walk_right',frameStart: 6, frameEnd: 8},
    {key: 'walk_back', frameStart: 9, frameEnd: 11},
  ]

  init() {
    console.log("Game Main");
    this.cursors = this.input.keyboard.createCursorKeys();
    this.playerAnimState = ''
  }

  preload() {
    this.load.image('mapTiles', `../../public/images/map_tile.png`)
    this.load.spritesheet('hero', '../../public/images/hero.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    // map の読み込み
    this.map = this.make.tilemap({ data: this.map_ground, tileWidth: 40, tileHeight: 40 })
    this.tiles = this.map.addTilesetImage('mapTiles')
    this.map_ground_layer = this.map.createLayer(0, this.tiles, 0, 0)

    this.player = this.add.sprite(420, 300, 'hero', 10)
    this.player.setDisplaySize(40, 40)

    for(let playerAnim of this.playerAnims){ // ヒーローアニメーションの数だけループ
      if(this.anims.create(this.playerAnimConfig(playerAnim)) === false) continue // もしfalseが戻って来ればこの後何もしない
    }

    this.player.anims.play('walk_stop')
  }

  update() {
    console.log('update')

    let playerAnimState: WalkAnimState = ''

    if(this.cursors.up.isDown){ 
      playerAnimState = 'walk_back'
    }else if(this.cursors.down.isDown){
      playerAnimState = 'walk_front'
    }else if(this.cursors.left.isDown){
      playerAnimState = 'walk_left'
    }else if(this.cursors.right.isDown){
      playerAnimState = 'walk_right'
    }else{
      this.player.anims.stop()
      this.playerAnimState = ''
      return
    }

    // 前回と状態が異なればplayer 挙動を変更
    if(this.playerAnimState != playerAnimState){
      this.player.anims.play(playerAnimState)
      this.playerAnimState = playerAnimState
    }
  }

  private playerAnimConfig(config: {key: string, frameStart: number, frameEnd: number}): Phaser.Types.Animations.Animation {
    return {
      key: config.key,
      frames: this.anims.generateFrameNumbers(
        'hero',
        {
          start: config.frameStart,
          end: config.frameEnd
        }
      ),
      frameRate: 8,
      repeat: -1
    }
  }
}
