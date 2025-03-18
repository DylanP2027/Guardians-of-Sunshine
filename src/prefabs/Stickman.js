class Stickman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add stickman to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);
        
        this.isThrowingBomb = false;
        this.HBDied = false;

        this.maxSpeed = 100;
        this.maxJumpSpeed = 300;

        // Create Attack Hitbox for Combat
        this.attackHitbox = scene.physics.add.sprite(this.x, this.y, null)
        this.attackHitbox.setBodySize(this.width * 0.5, this.height * 0.9)
        this.attackHitbox.body.allowGravity = false
        this.attackHitbox.setVisible(false)
    }

    update() {
        // Left and right movement
        if (keyLEFT.isDown && !this.isThrowingBomb) {
            this.attackHitbox.setPosition(this.x - 15, this.y);
            this.setVelocityX(-this.maxSpeed)
            this.setFlipX(true)

            if (this.body.blocked.down) {
                if (this.anims.currentAnim.key !== 'stickman-walk' || !this.anims.isPlaying) {
                    this.anims.play('stickman-walk')
                }
            }

        } else if (keyRIGHT.isDown && !this.isThrowingBomb) {
            this.attackHitbox.setPosition(this.x + 15, this.y);
            this.setVelocityX(this.maxSpeed)
            this.resetFlip(true)

            if (this.body.blocked.down) {
                if (this.anims.currentAnim.key !== 'stickman-walk' || !this.anims.isPlaying) {
                    this.anims.play('stickman-walk')
                }
            }

        } else {
            // Stop moving when no keys are pressed
            this.setVelocityX(0)

            //temp idle, want to implement a timer that switches to an idle animation later
        }

        // Jumping
        if (Phaser.Input.Keyboard.JustDown(keyJUMP) && this.body.blocked.down && !this.isThrowingBomb) {
            this.setVelocityY(-this.maxJumpSpeed) // Apply upward force
            this.anims.play('stickman-jump')
        }

        //Punching
        if (Phaser.Input.Keyboard.JustDown(keyPUNCH) && this.body.blocked.down && !this.isThrowingBomb) {
            if (this.body.velocity.x == 0) {
                this.anims.play('stickman-punch').chain('stickman-battle')
            }

        }

        // Kicking
        if (Phaser.Input.Keyboard.JustDown(keyKICK) && this.body.blocked.down && !this.isThrowingBomb) {
            if (this.body.velocity.x == 0) {
                this.anims.play('stickman-kick').chain('stickman-battle')
            }

        }

        // Bomb Ability: can only be done when HunnyBunny is present and alive, prevents player softlocking themselves for now, alternate check later if player has a bomb or not
        if (Phaser.Input.Keyboard.JustDown(keyABILITY) && this.body.blocked.down && !this.isThrowingBomb && !this.HBDied && this.scene.HBSpawned) {
            if (this.body.velocity.x == 0 && !this.flipX) {
                this.tempStick = this.scene.add.sprite(this.x + this.width/2.2, this.y - this.height/2, 'stickman', 0)
                this.tempStick.anims.play('stickman-bomb')
                this.scene.useBomb()
                this.isThrowingBomb = true;

                this.anims.play('stickman-bomb').once('animationcomplete', () => {
                    this.tempStick.destroy()
                    this.enableBody(false, this.x, this.y, true, true)
                    this.createBomb()
                    this.anims.play('stickman-battle')
                    this.isThrowingBomb = false;
                })
            }

        }

    }


    createBomb(){
        this.bomb = this.scene.physics.add.sprite(this.x + this.width, this.y - 24, 'bomb', 0)
        this.bomb.body.allowGravity = false
        this.bomb.anims.play('bombSparkle')
        this.bomb.setVelocityX(55)
        this.scene.physics.add.overlap(this.bomb, this.scene.hunnyBunny, this.scene.handleAttack, null, this.scene);
    }

}
