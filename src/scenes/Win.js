class Credits extends Phaser.Scene {
    constructor() {
        super("winScreen") // Basically gives names the key to this object menuScene
    }

    create() {
        // Background Color
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0,0)

        // Text for the different credits
        this.add.text(5, 5, 'CREDITS:', {font: 'Verdana', fontSize: 8})
        this.add.text(10, 20, 'MUSIC:', {font: 'Verdana', fontSize: 6})
        this.add.text(15, 30, 'Lo-Bit 2 (LoFi, Happy)', {font: 'Verdana', fontSize: 4})
        this.add.text(15, 40, 'by HoliznaPATREON', {font: 'Verdana', fontSize: 4})

        this.add.text(10, 60, 'ART:', {font: 'Verdana', fontSize: 6})
        this.add.text(15, 70, 'ME (Dylan Paras)', {font: 'Verdana', fontSize: 4})

        this.add.text(10, 90, 'SFX:', {font: 'Verdana', fontSize: 6})
        this.add.text(15, 100, 'ME (Dylan Paras)', {font: 'Verdana', fontSize: 4})

        // Defines control for this scene
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        
        // Plays the walking animation just because, since the scene felt empty
        let slimeAnimation = this.add.sprite(game.config.width - 15, game.config.height - 15, 'slimeWalk')
        slimeAnimation.play('walk')

        // Sets up the menuReturn sound for when the left arrow key is pressed
        this.menuSelectionSoundReturn = this.sound.add('menuSelectionSoundReturn')
        this.menuSelectionSoundReturn.volume = 0.3
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene') // Returns to the menu
            this.menuSelectionSoundReturn.play()
        }
    }
}