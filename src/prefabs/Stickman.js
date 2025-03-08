class Stickman extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame){
        super(scene, x, y, texture, frame)

        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.body.setCollideWorldBounds(true)

        this.maxSpeed = 300
        this.maxJumpSpeed = 5000
    }

    update(){
        if(Phaser.Input.Keyboard.JustDown(this.keyLEFT)) {
            this.stick.setVelocityX(-this.MAX_VELOCITY)
            //this.stick.setFlip(true, false)
            //this.stick.anims.play('walk', true)
        } else if(Phaser.Input.Keyboard.JustDown(this.keyRIGHT)) {
            this.stick.setVelocityX(this.MAX_VELOCITY)
            //this.stick.resetFlip()
            //this.stick.anims.play('walk', true)
        } else if (Phaser.Input.Keyboard.JustDown(this.keyRIGHT) && Phaser.Input.Keyboard.JustDown(this.keyLEFT)) {
            this.stick.setVelocityX(0)
        } else if(this.stick.body.touching.down && Phaser.Input.Keyboard.JustDown(this.keyJUMP)) {
            this.stick.body.setVelocityY(this.JUMP_VELOCITY);
            //this.stick.anims.play('idle')
        }
    }
}