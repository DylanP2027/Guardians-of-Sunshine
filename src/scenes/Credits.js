class Credits extends Phaser.Scene {
    constructor() {
        super("creditsScene") // Basically gives names the key to this object menuScene
    }

    create() {
        // Background Color (Black)
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0,0)

        this.instructionsSprite = this.add.image(game.config.width/2, game.config.height/2, 'credits').setOrigin(0.5,0.5);

        this.pressR = this.add.sprite(this.scale.width - 250, this.scale.height - 25, 'pressR').setScale(.5);

        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyRESET)) {
            this.scene.start('menuScene') // Returns to the menu
            let victoryMusic = this.registry.get('victoryMusic') // Finds in registry
            if (victoryMusic) {
                victoryMusic.stop();
            }
        }
    }
}