class Win extends Phaser.Scene {
    constructor() {
        super("winScene")
    }



    create() {
        // Background Color (Black)
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0,0)

        // Stop game music
        let gameMusic = this.registry.get('gameMusic');
        gameMusic.stop();

        // You Win Sprite
        this.youWinSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'youWin').setScale(8);

        // SPACE for Credits png
        this.pressSpaceForCredits = this.add.sprite(this.scale.width - 250, this.scale.height - 25, 'pressSpaceForCredits').setScale(.5);

        // Defines control for this scene
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // Victory music
        this.victoryMusic = this.sound.add('victoryMusic');
        this.victoryMusic.volume = 0.125;
        this.victoryMusic.play();
        this.registry.set('victoryMusic', this.victoryMusic); // Store in registry
    }



    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keySPACE)) {
            this.scene.start('creditsScene') // Sends to menu scene
        }
    }
}