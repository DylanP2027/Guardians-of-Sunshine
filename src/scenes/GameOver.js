class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene") // Basically gives names the key to this object menuScene
    }

    create () {
        let gameOverBackground = this.add.sprite(game.config.width / 2, game.config.height / 2, 'gameOverBackground')

        this.cameras.main.fadeIn(1000, 226, 243, 228) // Face in effect

        // Just adds a slime in the corner because the scene feels empty
        let slimeAnimation = this.add.sprite(game.config.width - 15, game.config.height - 15, 'slimeWalk')
        slimeAnimation.play('walk')

        // Keybinds
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)

        this.menuSelectionSoundReturn = this.sound.add('menuSelectionSoundReturn')
        this.menuSelectionSoundReturn.volume = 0.3

        this.menuSelectionSound = this.sound.add('menuSelectionSound')
        this.menuSelectionSound.volume = 0.3

        // Text to Return or Restart
        this.add.text(10, game.config.height - 30, 'Restart: R', {font: 'Verdana', fontSize: 8})
        this.add.text(10, config.height - 20, 'Return: ←', {font: 'Verdana', fontSize: 8})
    
        this.add.text(game.config.width/2 - 5, 30, this.registry.get('recentScore'), {font: 'Verdana', fontSize: 24 }).setOrigin(0,0)
        this.add.text(game.config.width/2 - 5, 80, localStorage.getItem('bestScore'), {font: 'Verdana', fontSize: 24 }).setOrigin(0,0)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene')
            this.menuSelectionSoundReturn.play()
        }
        if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.start('playScene')
            this.menuSelectionSound.play()
        }
    }
}