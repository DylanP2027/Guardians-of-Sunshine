class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene") // Basically gives names the key to this object menuScene
    }

    create() {
        // Background Color (Black)
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0,0)

        // You Win Sprite
        this.youLoseSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'youLose').setScale(8);

        // Defines control for this scene
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.start('menuScene') // Returns to the menu
            // this.menuSelectionSoundReturn.play()
        }
    }
}