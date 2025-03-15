class Play extends Phaser.Scene {

    constructor() {
        super("playScene"); // Scene key
    }

    init() {
        // Set world gravity
        this.physics.world.gravity.y = 1000;
    }

    create() {
        // Define controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyATTACK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);

        // Load tilemap and tilesets
        const map = this.add.tilemap('tilemapJSON');
        const floor_flame_tilesetImage = map.addTilesetImage('floorAndFlameSpriteSheet', 'floor_flame_tilesetImage');
        const steps_tilesetImage = map.addTilesetImage('caveEntranceSpriteSheet', 'steps_tilesetImage');
        const ceiling_tilesetImage = map.addTilesetImage('ceilingSpriteSheet', 'ceiling_tilesetImage');
        const background_goop_tilesetImage = map.addTilesetImage('backgroundAndGoop', 'background_goop_tilesetImage');

        // Create layers
        const backgroundLayer = map.createLayer('Background', [background_goop_tilesetImage], 0, 0);
        const collisionLayer = map.createLayer('CollisionLayer', [floor_flame_tilesetImage, steps_tilesetImage, ceiling_tilesetImage], 0, 0);
        collisionLayer.setCollisionByProperty({ collides: true });

        // Player spawn point
        const playerSpawn = map.findObject('playerSpawn', obj => obj.name === 'playerSpawn');
        
        // Create player
        this.stick = new Stickman(this, playerSpawn.x, (playerSpawn.y / 1.5 + 5), 'stickman', 0);
        this.stick.setBodySize(this.stick.width * 0.4, this.stick.height, true);
        this.stick.anims.play('stickman-idle');

        // Player collision
        this.physics.add.collider(this.stick, collisionLayer);

        // BouncyBee setup
        const bouncyBeeSpawn = map.findObject('bouncyBeeSpawn', obj => obj.name === 'bouncyBeeSpawn');
        this.bouncyBee = this.physics.add.sprite(bouncyBeeSpawn.x, bouncyBeeSpawn.y, 'bouncyBee');
        this.physics.add.collider(this.bouncyBee, collisionLayer);
        this.physics.add.collider(this.bouncyBee, this.stick, this.handlePlayerHit, null, this);
        
        // Attack hitbox
        this.physics.add.overlap(this.stick.attackHitbox, this.bouncyBee, this.handleAttack, null, this);

        // Camera setup
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.stick, true, 0.25, 0.25);
        this.cameras.main.setZoom(3.5);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Slope definition for manual handling
        this.slope = {
            startX: 144,
            startY: 238,
            endX: 210,
            endY: 290,
            gradient: (288 - 240) / (208 - 144) // Pre-computed slope gradient
        };
    }

    update() {
        if (this.stick) {
            this.stick.update();
            this.checkSlope(this.stick);
        }
    }

    // Handle player hit by bee
    handlePlayerHit(stick, bouncyBee) {
        this.scene.start('gameOverScene'); // Restart to game over
    }

    // Handle player attack
    handleAttack(hitbox, enemy) {
        if (this.stick.anims.currentAnim.key === 'stickman-punch' && this.stick.anims.isPlaying) {
            enemy.destroy(); // Destroy enemy when attacked
        }
    }

    // Manual slope logic (final, clean version)
    checkSlope(stick) {
        const { startX, startY, endX, gradient } = this.slope;
        const expectedY = gradient * (stick.x - startX) + startY;
        const buffer = 2; // Smaller buffer for tighter adherence without hard snapping
    
        // Check if player is within slope's X-range
        if (stick.x >= startX && stick.x <= endX) {
            const playerBottomY = stick.y + stick.height / 2;
    
            // Slope correction should only occur if the player is near or below the slope level
            if (playerBottomY >= expectedY - buffer && playerBottomY <= expectedY + buffer) {
                // Set player on slope precisely without jitter
                stick.y = expectedY - stick.height / 2;
                stick.body.velocity.y = 0; // Cancel vertical movement
    
                // 🔑 Add slight horizontal push in direction of movement to keep smooth flow
                if (keyLEFT.isDown) {
                    stick.body.velocity.x = -80; // Control horizontal slide value as needed
                } else if (keyRIGHT.isDown) {
                    stick.body.velocity.x = 80;
                } else {
                    // Optional: slow down if no key pressed for natural feel
                    stick.body.velocity.x *= 0.9; // Dampening factor
                }
    
            } else if (playerBottomY > expectedY) {
                // If below slope (falling), let gravity handle it (no correction)
            } else {
                // If jumping above slope, ignore slope snapping to avoid yanking the player down
            }
        }
    }    
}
