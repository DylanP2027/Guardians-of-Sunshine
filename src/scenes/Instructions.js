class Instructions extends Phaser.Scene {
    constructor() {
        super("instructionsScene") // Basically gives names the key to this object menuScene
    }

    create() {
        // Background Color (Black)
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0,0)

        this.instructionsSprite = this.add.image(game.config.width/2, game.config.height/2, 'instructions').setOrigin(0.5,0.5);

        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keySPACE)) {
            this.scene.start('currentLevelScene') // Returns to the menu
            this.jumpSound = this.sound.add('jump');
            this.jumpSound.volume = 0.4;
            this.jumpSound.play()
        }
    }
}