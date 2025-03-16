class Stickman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // Add stickman to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        this.maxSpeed = 100;
        this.maxJumpSpeed = 300;

        // Create Attack Hitbox for Combat
        this.attackHitbox = scene.physics.add.sprite(this.x, this.y, null)
        this.attackHitbox.setBodySize(this.width * 0.5,this.height * 0.9)
        this.attackHitbox.body.allowGravity = false
        this.attackHitbox.setVisible(false)
    }
    
    update() {
        // Left and right movement
        if (keyLEFT.isDown) {
            this.attackHitbox.setPosition(this.x - 15, this.y);
            this.setVelocityX(-this.maxSpeed)
            this.setFlipX(true)

            if (this.body.blocked.down) {
                if (this.anims.currentAnim.key !== 'stickman-walk' || !this.anims.isPlaying) {
                    this.anims.play('stickman-walk')
                }
            }
            
        } else if (keyRIGHT.isDown) {
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
        if (Phaser.Input.Keyboard.JustDown(keyJUMP) && this.body.blocked.down) {
            this.setVelocityY(-this.maxJumpSpeed) // Apply upward force
            this.anims.play('stickman-jump')
        }

        //Punching
        if (Phaser.Input.Keyboard.JustDown(keyPUNCH) && this.body.blocked.down) {
            if(this.body.velocity.x == 0){
                this.anims.play('stickman-punch').chain('stickman-battle')
            }
            
        }

        // Kicking
        if (Phaser.Input.Keyboard.JustDown(keyKICK) && this.body.blocked.down) {
            if(this.body.velocity.x == 0){
                this.anims.play('stickman-kick').chain('stickman-battle')
            }
            
        }

    }
    
}
