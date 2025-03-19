class Stickman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add stickman to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        
        // Event triggers
        this.isThrowingBomb = false;
        this.HBDied = false;
        this.isIdle = false
        this.idleTimer = null

        // Speed values
        this.maxSpeed = 100;
        this.maxJumpSpeed = 300;

        // Create Attack Hitbox for Combat
        this.attackHitbox = scene.physics.add.sprite(this.x, this.y, null)
        this.attackHitbox.setBodySize(this.width * 0.5, this.height * 0.9)
        this.attackHitbox.body.allowGravity = false
        this.attackHitbox.setVisible(false)

        this.anims.play('stickman-idle'); // Plays idle animations once the player spawns
    }



    update() {
        let isMoving = false; // Flag that checks if the player is moving

        // Left and right movement
        if (keyLEFT.isDown && !this.isThrowingBomb && !this.scene.readyBattle) {
            this.attackHitbox.setPosition(this.x - 15, this.y);
            this.setVelocityX(-this.maxSpeed)
            this.setFlipX(true)
            isMoving = true;

            if (this.body.blocked.down) {
                if (this.anims.currentAnim.key !== 'stickman-walk' || !this.anims.isPlaying) {
                    this.anims.play('stickman-walk')
                }
            }

        } else if (keyRIGHT.isDown && !this.isThrowingBomb && !this.scene.readyBattle) {
            this.attackHitbox.setPosition(this.x + 15, this.y);
            this.setVelocityX(this.maxSpeed)
            this.resetFlip(true)
            isMoving = true;

            if (this.body.blocked.down) {
                if (this.anims.currentAnim.key !== 'stickman-walk' || !this.anims.isPlaying) {
                    this.anims.play('stickman-walk')
                }
            }

        } else {
            this.setVelocityX(0) // Stop moving when no keys are pressed
        }


        // Jumping
        if (Phaser.Input.Keyboard.JustDown(keyJUMP) && this.body.blocked.down && !this.isThrowingBomb && !this.scene.readyBattle) {
            this.setVelocityY(-this.maxJumpSpeed) // Apply upward force
            this.anims.play('stickman-jump') // Jump animation
            isMoving = true;

            // Jump SFX
            this.jumpSound = this.scene.sound.add('jump');
            this.jumpSound.volume = 0.3;
            this.jumpSound.play();
        }


        //Punching
        if (Phaser.Input.Keyboard.JustDown(keyPUNCH) && this.body.blocked.down && !this.isThrowingBomb && !this.scene.readyBattle) {
            if (this.body.velocity.x == 0) {
                this.anims.play('stickman-punch').chain('stickman-battle')
                isMoving = true;
            }

        }


        // Kicking
        if (Phaser.Input.Keyboard.JustDown(keyKICK) && this.body.blocked.down && !this.isThrowingBomb && !this.scene.readyBattle) {
            if (this.body.velocity.x == 0) {
                this.anims.play('stickman-kick').chain('stickman-battle') // Kicking animation
                isMoving = true;
            }

        }


        // Bomb Ability: can only be done when HunnyBunny is present and alive, prevents player softlocking themselves for now, alternate check later if player has a bomb or not
        if (Phaser.Input.Keyboard.JustDown(keyABILITY) && this.body.blocked.down && !this.isThrowingBomb && !this.HBDied && this.scene.HBSpawned) {
            if (this.body.velocity.x == 0 && !this.flipX) {
                this.tempStick = this.scene.add.sprite(this.x + this.width/2.2, this.y - this.height/2, 'stickman', 0)
                this.tempStick.anims.play('stickman-bomb')
                this.scene.useBomb()
                this.isThrowingBomb = true;

                // Bomb throwing animation
                this.anims.play('stickman-bomb').once('animationcomplete', () => {
                    this.tempStick.destroy()
                    this.enableBody(false, this.x, this.y, true, true)
                    this.createBomb()
                    this.anims.play('stickman-battle')
                    this.isThrowingBomb = false;
                })

                isMoving = true;
            }

        }


        // Idle Animation Checker
        if (!isMoving && this.body.velocity.x === 0 && this.body.blocked.down) {
            if (!this.isIdle) {
                this.startIdleTimer(); // Start timer when player is not moving
            }
        } else {
            this.cancelIdleTimer(); // Cancel timer if player moves
        }
    }



    // Helper function to create the bomb sprite and have it move
    createBomb(){
        this.bomb = this.scene.physics.add.sprite(this.x + this.width, this.y - 24, 'bomb', 0)
        this.bomb.body.allowGravity = false
        this.bomb.anims.play('bombSparkle')
        this.bomb.setVelocityX(55)
        this.scene.physics.add.overlap(this.bomb, this.scene.hunnyBunny, this.scene.handleAttack, null, this.scene);
    }



    // Start idle timer if player doesn't move
    startIdleTimer() {
        this.isIdle = true;
        this.idleTimer = this.scene.time.delayedCall(3000, () => {
            this.anims.play('stickman-idle');
            this.isIdle = false;
        }, [], this);
    }

    

    // Cancel idle timer if player moves
    cancelIdleTimer() {
        if (this.idleTimer) {
            this.idleTimer.remove(false);
            this.idleTimer = null;
            this.isIdle = false;
        }
    }
}



