class Play extends Phaser.Scene {

    constructor() {
        super("playScene"); // Scene key

        let punchedBee = false;
        let HBExists = false;
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
        keyPUNCH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyKICK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyABILITY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

        // Load tilemap and tilesets
        const map = this.add.tilemap('tilemapJSON');
        const floor_flame_tilesetImage = map.addTilesetImage('floorAndFlameSpriteSheet', 'floor_flame_tilesetImage');
        const steps_tilesetImage = map.addTilesetImage('caveEntranceSpriteSheet', 'steps_tilesetImage');
        const ceiling_tilesetImage = map.addTilesetImage('ceilingSpriteSheet', 'ceiling_tilesetImage');
        const background_goop_tilesetImage = map.addTilesetImage('backgroundAndGoop', 'background_goop_tilesetImage');

        // Create layers
        const backgroundLayer = map.createLayer('Background', [background_goop_tilesetImage], 0, 0);
        const collisionLayer = map.createLayer('CollisionLayer', [floor_flame_tilesetImage, steps_tilesetImage, ceiling_tilesetImage, background_goop_tilesetImage], 0, 0);
        const deathLayer = map.createLayer('deathLayer', [floor_flame_tilesetImage], 0, 0);
        collisionLayer.setCollisionByProperty({ collides: true });
        deathLayer.setCollisionByProperty({ death: true })

        // Player spawn point
        const playerSpawn = map.findObject('playerSpawn', obj => obj.name === 'playerSpawn');

        // Create player
        this.stick = new Stickman(this, playerSpawn.x, playerSpawn.y, 'stickman', 0);
        this.stick.setBodySize(this.stick.width * 0.4, this.stick.height, true);
        this.stick.anims.play('stickman-idle');

        // Player collision
        this.physics.add.collider(this.stick, collisionLayer);
        this.physics.add.collider(this.stick, deathLayer, () => {
            // Replace later with lose life
            this.scene.start('gameOverScene');
        }, null, this)


        // BouncyBee setup
        const bouncyBeeSpawn = map.findObject('bouncyBeeSpawn', obj => obj.name === 'bouncyBeeSpawn');
        this.bouncyBee = this.physics.add.sprite(bouncyBeeSpawn.x, bouncyBeeSpawn.y - 20, 'bouncyBee');
        this.bouncyBee.body.allowGravity = false
        this.physics.add.collider(this.bouncyBee, collisionLayer);
        this.physics.add.collider(this.bouncyBee, this.stick, this.handlePlayerHit, null, this);

        // HunnyBunny setup
        const hunnyBunnySpawn = map.findObject('hunnyBunnySpawn', obj => obj.name === 'hunnyBunnySpawn');

        // Zone to have HunnyBunny Spawn
        this.spawnHB = this.physics.add.staticSprite(hunnyBunnySpawn.x - 100, hunnyBunnySpawn.y - 20, null)
        this.spawnHB.setBodySize(36, 120)
        this.spawnHB.body.allowGravity = false
        this.spawnHB.setVisible(false)

        // Pseudo-Cutscene, locks player movement until animation is complete
        this.physics.add.overlap(this.stick, this.spawnHB, () => {
            //hunny bunny spawn animation
            if(!this.HBExists){
                this.stick.maxSpeed = 0
                this.HBExists = true
                this.HBSpawn = this.add.sprite(hunnyBunnySpawn.x, hunnyBunnySpawn.y - 25, 'hunnyBunny')

                this.HBSpawn.anims.play('HBSpawn').once('animationcomplete', () => {
                    this.stick.maxSpeed = 100

                    // perform the old-switcheroo
                    this.hunnyBunny = this.physics.add.sprite(hunnyBunnySpawn.x, hunnyBunnySpawn.y - 15, 'hunnyBunny');
                    this.physics.add.collider(this.hunnyBunny, collisionLayer);
                    this.physics.add.collider(this.hunnyBunny, this.stick, this.handlePlayerHit, null, this);
                
                })  
            }
        }, null, this);

        // Camera setup
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.stick, true, 0.5, 0.5);
        this.cameras.main.setZoom(3.5);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Slope definition for manual handling, defined with multiple slopes for pseudo slope collision
        this.slopes = [
            {
                startX: 144,
               startY: 238,
                endX: 210,
                endY: 290,
                gradient: (290 - 238) / (210 - 144)
            },
            {
                startX: 2082,
                startY: 288,
                endX: 2145,
                endY: 340,
                gradient: (340 - 289) / (2145 - 2080)
            },
            {
                startX: 2226,
                startY: 336,
                endX: 2288,
                endY: 390,
                gradient: (390 - 337) / (2288 - 2224)
            }
        ];


        // Attack hitbox
        this.physics.add.overlap(this.stick.attackHitbox, this.bouncyBee, this.handleAttack, null, this);

        
        //Testing Purposes for convenience
        this.stick.setPosition(hunnyBunnySpawn.x - 150, hunnyBunnySpawn.y - 20)

    }

    update() {
        if (this.stick) {
            this.stick.update();
            this.checkSlope(this.stick);
        }
    }

    // Handle player hit by bee
    handlePlayerHit(stick, enemy) {
        this.scene.start('gameOverScene')
    }

    // Handle player attack
    handleAttack(hitbox, enemy) {

        switch (enemy) {
            case this.bouncyBee:
                if (this.stick.anims.currentAnim.key === 'stickman-punch') {
                    this.punchedBee = true;
                }

                if (this.stick.anims.currentAnim.key === 'stickman-kick' && this.punchedBee) {
                    enemy.destroy()
                }

                break;

            default:
                break;
        }

    }

    // Manual slope logic (final, clean version)
    checkSlope(stick) {
        const buffer = 2; // Small buffer for adherence without hard snapping
    
        for (let slope of this.slopes) {
            const { startX, startY, endX, gradient } = slope;
            const expectedY = gradient * (stick.x - startX) + startY;
    
            // Check if player is within the slope's X-range
            if (stick.x >= startX && stick.x <= endX) {
                const playerBottomY = stick.y + stick.height / 2;
    
                // Apply slope correction only if the player is near or below the slope level
                if (playerBottomY >= expectedY - buffer && playerBottomY <= expectedY + buffer) {
                    // Align player precisely on slope
                    stick.y = expectedY - stick.height / 2;
                    stick.body.velocity.y = 0; // Stop downward movement
    
                    // Add slight horizontal push for smooth movement
                    if (keyLEFT.isDown) {
                        stick.body.velocity.x = -80;
                    } else if (keyRIGHT.isDown) {
                        stick.body.velocity.x = 80;
                    } else {
                        stick.body.velocity.x *= 0.9; // Slow down naturally
                    }
    
                    return; // Exit loop early once a matching slope is applied
                }
            }
        }
    }    
}
