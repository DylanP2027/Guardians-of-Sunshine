class Play extends Phaser.Scene {
    constructor() {
        super("playScene") // Basically gives names the key to this object menuScene
    }

    init() {
        // Value of Gravity
        this.physics.world.gravity.y = 1800
    }

    create() {
        // Defines control for this scene
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        // keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // Sound effect for returning back to the main menu

        // Sound effect for jumping

        // Sound effect for dying

        // The intial text for the score

        // tilemapping
        const map = this.add.tilemap('tilemapJSON')

        //internally the name of the tileset image
        const tileset = map.addTilesetImage('BasicTileset', 'tilesetImage')

        //draw in temp map
        const bgLayer = map.createLayer('Tile Layer 1', tileset, 0, 0)

        //move to spawn location
        const playerSpawn = map.findObject('PlayerSpawn', (obj) => obj.name === 'playerSpawn')
        
        //add player sprite
        const stick = this.add.sprite(playerSpawn.x, (playerSpawn.y / 1.5 + 5), 'stickman').setOrigin(0).setScale(2)
        stick.anims.play('stickman-idle')


    }
    

    update() {
        
    }
}