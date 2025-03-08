class Stickman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame, keyLEFT, keyRIGHT, keyJUMP) {
        super(scene, x, y, texture, frame);

        // Add stickman to scene
        scene.add.existing(this);
        scene.physics.add.existing(this);
        this.body.setCollideWorldBounds(true);

        // Store key inputs
        this.keyLEFT = keyLEFT;
        this.keyRIGHT = keyRIGHT;
        this.keyJUMP = keyJUMP;

        this.maxSpeed = 150;
        this.maxJumpSpeed = 300;
    }

    update() {
        // Left and right movement
        if (this.keyLEFT.isDown) {
            this.setVelocityX(-this.maxSpeed);
        } else if (this.keyRIGHT.isDown) {
            this.setVelocityX(this.maxSpeed);
        } else {
            this.setVelocityX(0); // Stop moving when no keys are pressed
        }
    
        // Jumping
        if (this.keyJUMP.isDown && this.body.blocked.down) {
            this.setVelocityY(-this.maxJumpSpeed); // Apply upward force
        }
    }
    
    
}
