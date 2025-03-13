class Stickman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, keyLEFT, keyRIGHT, keyJUMP) {
        super(scene, x, y, texture, frame);

        // Add stickman to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        this.maxSpeed = 100;
        this.maxJumpSpeed = 300;
    }

    update() {
        // Left and right movement
        if (keyLEFT.isDown) {
            this.setVelocityX(-this.maxSpeed)
            this.setFlipX(true)

            if (this.body.blocked.down) {
                if (this.anims.currentAnim.key !== 'stickman-walk' || !this.anims.isPlaying) {
                    this.anims.play('stickman-walk')
                }
            }
            
        } else if (keyRIGHT.isDown) {
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
            if (this.body.blocked.down) {
                if (this.anims.currentAnim.key !== 'stickman-idle' || !this.anims.isPlaying) {
                    this.anims.play('stickman-idle');
                }
            }
        }
    
        // Jumping
        if (Phaser.Input.Keyboard.JustDown(keyJUMP) && this.body.blocked.down) {
            this.setVelocityY(-this.maxJumpSpeed) // Apply upward force
            this.anims.play('stickman-jump')
        }
    }
    
}
