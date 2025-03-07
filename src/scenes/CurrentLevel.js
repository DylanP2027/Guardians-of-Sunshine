class CurrentLevel extends Phaser.Scene {
    constructor() {
        super("currentLevelScene") // Basically gives names the key to this object menuScene
    }

    create() {
        // Background Color
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x332c50).setOrigin(0,0)

        // Text for the different controls
        this.add.text(5, 5, 'CONTROLS:', {font: 'Verdana', fontSize: 8})
        this.add.text(15, 25, 'JUMP: Space', {font: 'Verdana', fontSize: 6})
        this.add.text(15, 40, 'DOUBLE JUMP: Space', {font: 'Verdana', fontSize: 6})
        this.add.text(15, 55, 'RESTART: R', {font: 'Verdana', fontSize: 6})
        this.add.text(15, 70, 'GO BACK: ←', {font: 'Verdana', fontSize: 6})
        
        // General guide for the player and tips
        this.add.text(15, 95, 'Jump Over Oncoming', {font: 'Verdana', fontSize: 6})
        this.add.text(15, 110, 'Obstacles. They Will', {font: 'Verdana', fontSize: 6})
        this.add.text(15, 125, 'Speed Up Over Time', {font: 'Verdana', fontSize: 6})

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
            this.scene.start('menuScene') // Returns to menu scene
            this.menuSelectionSoundReturn.play()
        }
    }
}