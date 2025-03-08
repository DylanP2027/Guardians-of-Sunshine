class Play extends Phaser.Scene {
    constructor() {
        super("playScene") // Basically gives names the key to this object menuScene
    }

    init() {
        // Value of Gravity
        this.physics.world.gravity.y = 1800
    }

    create() {
        // Define controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    
        // Load tilemap
        const map = this.add.tilemap('tilemapJSON');
        const tileset = map.addTilesetImage('BasicTileset', 'tilesetImage');
        const bgLayer = map.createLayer('Tile Layer 1', tileset, 0, 0);
        bgLayer.setCollisionByProperty({ collides: true });
    
        // Find player spawn location
        const playerSpawn = map.findObject('PlayerSpawn', (obj) => obj.name === 'playerSpawn');
    
        // Add player sprite
        this.stick = new Stickman(this, playerSpawn.x, (playerSpawn.y / 1.5 + 5), 'stickman', 0, keyLEFT, keyRIGHT, keyJUMP).setScale(2);
        this.stick.anims.play('stickman-idle');
    
        // Collisions
        this.physics.add.collider(this.stick, bgLayer);


        // TEMP: Spawns BouncyBee
        const bouncyBeeSpawn = map.findObject('BouncyBeeSpawn', (obj) => obj.name === 'bouncyBeeSpawn');

        this.bouncyBee = this.physics.add.sprite(game.config.width/1.75, (playerSpawn.y / 1.5 + 5), 'bouncyBee').setScale(2)
        this.physics.add.collider(this.bouncyBee, bgLayer);

        this.physics.add.collider(this.bouncyBee, this.stick, this.handlePlayerHit, null, this)
    }

    
    

    update() {

        if (this.stick) {
            this.stick.update();
        }
    }

    handlePlayerHit(stick, bouncyBee) {
        this.scene.start('gameOverScene') // Switch scene when collision happens
    }

}
        