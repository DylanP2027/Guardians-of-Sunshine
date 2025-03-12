class Play extends Phaser.Scene {
    constructor() {
        super("playScene") // Basically gives names the key to this object menuScene
    }

    init() {
        // Value of Gravity
        this.physics.world.gravity.y = 1000
    }

    create() {
        // Define controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    
        // Load tilemap
        const map = this.add.tilemap('tilemapJSON');
        const floor_flame_tilesetImage = map.addTilesetImage('floorAndFlameSpriteSheet', 'floor_flame_tilesetImage');
        const steps_tilesetImage = map.addTilesetImage('caveEntranceSpriteSheet', 'steps_tilesetImage');
        const ceiling_tilesetImage = map.addTilesetImage('ceilingSpriteSheet', 'ceiling_tilesetImage');
        const bgLayer = map.createLayer('Tile Layer 1', [floor_flame_tilesetImage, steps_tilesetImage, ceiling_tilesetImage], 0, 0);
        bgLayer.setCollisionByProperty({ collides: true });
    
        // Find player spawn location
        const playerSpawn = map.findObject('playerSpawn', (obj) => obj.name === 'playerSpawn');
    
        // Add player sprite
        this.stick = new Stickman(this, playerSpawn.x, (playerSpawn.y / 1.5 + 5), 'stickman', 0, keyLEFT, keyRIGHT, keyJUMP);
        this.stick.anims.play('stickman-idle');
    
        // Collisions
        this.physics.add.collider(this.stick, bgLayer);


        // TEMP: Spawns BouncyBee
        const bouncyBeeSpawn = map.findObject('bouncyBeeSpawn', (obj) => obj.name === 'bouncyBeeSpawn');

        this.bouncyBee = this.physics.add.sprite(game.config.width/1.75, (playerSpawn.y / 1.5 + 5), 'bouncyBee')
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
        