class Play extends Phaser.Scene {

    constructor() {
        super("playScene"); // Scene key
    }

    init() {
        // Set world gravity
        this.physics.world.gravity.y = 1000;
    }

    create() {
        // Lives counter
        this.currentLives = 3;
        this.currentBombs = 1;
        this.life_icons = []
        this.bomb_icons = []

        // Score values
        this.startingScore = 0
        this.currentScore = 0

        // Define controls
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyPUNCH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        keyKICK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K);
        keyABILITY = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B);

        keyDanceUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyDanceDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        keyDanceLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyDanceRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

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
        this.playerSpawn = map.findObject('playerSpawn', obj => obj.name === 'playerSpawn');

        // Create player
        this.stick = new Stickman(this, this.playerSpawn.x, this.playerSpawn.y, 'stickman', 0);
        this.stick.setBodySize(this.stick.width * 0.5, this.stick.height, true);
        this.stick.anims.play('stickman-idle');


        // Player collision
        this.physics.add.collider(this.stick, collisionLayer);
        this.physics.add.collider(this.stick, deathLayer, this.handleDeath, null, this);

        // Player & Coin Collision


        // BouncyBee setup
        const bouncyBeeSpawn = map.findObject('bouncyBeeSpawn', obj => obj.name === 'bouncyBeeSpawn');
        this.bouncyBee = this.physics.add.sprite(bouncyBeeSpawn.x, bouncyBeeSpawn.y - 20, 'bouncyBee');
        this.bouncyBee.body.allowGravity = false
        this.bouncyBee.setImmovable(true)
        this.physics.add.collider(this.bouncyBee, collisionLayer);
        this.physics.add.collider(this.bouncyBee, this.stick, this.handleDeath, null, this);

        // HunnyBunny setup
        const hunnyBunnySpawn = map.findObject('hunnyBunnySpawn', obj => obj.name === 'hunnyBunnySpawn');
        this.HBExists = false
        this.HBSpawned = false

        // Zone to have HunnyBunny Spawn
        this.spawnHB = this.physics.add.staticSprite(hunnyBunnySpawn.x - 100, hunnyBunnySpawn.y - 20, null)
        this.spawnHB.setBodySize(36, 120)
        this.spawnHB.body.allowGravity = false
        this.spawnHB.setVisible(false)

        // Pseudo-Cutscene, locks player movement until animation is complete
        this.physics.add.overlap(this.stick, this.spawnHB, () => {
            //hunny bunny spawn animation
            if (!this.HBExists) {
                this.stick.maxSpeed = 0
                this.HBExists = true
                this.HBSpawn = this.add.sprite(hunnyBunnySpawn.x, hunnyBunnySpawn.y - 25, 'hunnyBunny')

                this.HBSpawn.anims.play('HBSpawn').once('animationcomplete', () => {
                    this.stick.maxSpeed = 100
                    this.HBSpawned = true
                    // perform the old-switcheroo
                    this.hunnyBunny = this.physics.add.sprite(hunnyBunnySpawn.x, hunnyBunnySpawn.y - 15, 'hunnyBunny');
                    this.hunnyBunny.anims.play('HBIdle')
                    this.hunnyBunny.setImmovable(true)
                    this.physics.add.collider(this.hunnyBunny, collisionLayer);
                    this.physics.add.collider(this.hunnyBunny, this.stick, this.handleDeath, null, this);

                })
            }
        }, null, this);

        // Camera setup
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        this.cameras.main.startFollow(this.stick, true, 0.5, 0.5, 0, 45);
        this.cameras.main.setZoom(3);
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

        // Slope definition for manual handling, defined with multiple slopes for pseudo slope collision
        this.slopes = [
            {
                startX: 144,
                startY: 237,
                endX: 210,
                endY: 290,
                gradient: (290 - 237) / (210 - 144)
            },
            {
                startX: 2082,
                startY: 286,
                endX: 2145,
                endY: 340,
                gradient: (340 - 286) / (2145 - 2080)
            },
            {
                startX: 2226,
                startY: 334,
                endX: 2288,
                endY: 390,
                gradient: (390 - 334) / (2288 - 2224)
            }
        ];


        // Attack hitbox
        this.physics.add.overlap(this.stick.attackHitbox, this.bouncyBee, this.handleAttack, null, this);

        // Create UI camera
        this.UICamera = this.cameras.add(0, 0, this.scale.width, this.scale.height);
        this.UICamera.setScroll(0, 0); // Fixed camera
        this.UICamera.ignore([backgroundLayer, collisionLayer, deathLayer, this.stick, this.bouncyBee, this.spawnHB, this.physics.world.debugGraphic]); // Ignore world/game elements

        // Create UI container for UI elements
        this.UIContainer = this.add.container(0, 0);
        this.UIBackground = this.add.image(0, 0, 'UIBackground').setOrigin(0).setScale(4);
        this.UIContainer.add(this.UIBackground);
        this.UIContainer.setDepth(100); 
        this.cameras.main.ignore([this.UIContainer]); 

        // Create UI for lives left
        for (let i = 0; i < this.currentLives; i++) {
            this.life_icons[i] = this.add.image(100 + ((220/this.currentLives) * i), 60, 'LifeIcon').setScale(4);
            this.UIContainer.add(this.life_icons[i]);
        }

        // Create UI for bomb count
        for (let i = 0; i < this.currentBombs; i++) {
            this.bomb_icons[i] = this.add.image(780 + ((220/this.currentBombs) * i), 60, 'BombIcon').setScale(4);
            this.UIContainer.add(this.bomb_icons[i]);
        }

        // Set text
        this.scoreText = this.add.bitmapText(this.UIBackground.displayWidth / 2, 75, 'numbersFont', this.currentScore, 98).setOrigin(0.5,0.5).setDepth(150);

        //Testing Purposes for convenience
        this.stick.setPosition(hunnyBunnySpawn.x - 150, hunnyBunnySpawn.y - 50)
    }

    update() {
        if (this.stick) {
            this.stick.update();
            this.checkSlope(this.stick);
        }

        //while throwing replace with dummy sprite
        if (this.stick.isThrowingBomb) {
            this.stick.disableBody(false, true)
        }

        // For updating score text
        this.scoreText.setText(this.currentScore.toString())
    }

    handleDeath(type) {

        if(this.currentLives == 0){
            this.scene.start('gameOverScene')
        }else{
            switch (type) {
                case this.bouncyBee:
                    this.loseLife()
                    this.stick.setPosition(this.bouncyBee.x - 150, this.bouncyBee.y);
                    break;
                
                case this.hunnyBunny:
                    this.loseLife()
                    this.stick.setPosition(this.hunnyBunny.x - 150, this.hunnyBunny.y);
                    break;

                default:            
                
                    if (!this.isDead) {
                        this.isDead = true;
            
                        // Reduce unnecessary physics calculations by disabling collision temporarily
                        this.physics.world.colliders.getActive().forEach(collider => {
                            if (collider.object2 === this.deathLayer) collider.active = false;
                        });
                        
                        this.loseLife()
                
                        this.time.delayedCall(100, () => {
                            this.stick.setPosition(this.playerSpawn.x, this.playerSpawn.y);
                            this.isDead = false;
                
                            // Re-enable death collision after respawn
                            this.physics.world.colliders.getActive().forEach(collider => {
                                if (collider.object2 === this.deathLayer) collider.active = true;
                            });
                        });
                    }
                    break;
            }
        }

    }

    loseLife(){
        this.currentLives -= 1;
        this.life_icons[this.currentLives].destroy()

        if(this.currentLives == 0){
            this.scene.start('gameOverScene')
        }
    }

    useBomb(){
        this.currentBombs -= 1;
        this.bomb_icons[this.currentBombs].destroy()
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
                    this.currentScore += 500
                }

                break;
                
            case this.hunnyBunny:
                this.stick.HBDied = true;
                enemy.destroy()
                this.currentScore += 800
                this.stick.bomb.destroy()

                break;

            default:
                break;
        }

    }

    // Manual slope logic (final, clean version)
    checkSlope(stick) {
        const buffer = 4; // Small buffer for adherence without hard snapping

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
