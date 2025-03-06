// Note: A lot of this code is reused from Rocket Patrol Mods

// Event trigger so that menu stuff isn't triggered more than once
let enteredMenuScene = false

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene") // Basically gives names the key to this object menuScene
    }

    

    preload() {
        // Images for the Main Menu
        this.load.image('titleScreen', './assets/titleScreen.png')
        this.load.spritesheet('titleScreenButtons', './assets/titleScreenButtons.png', {
            frameWidth: 160,
            frameHeight: 144,
            startFrame: 0,
            endFrame: 1
        })

        // Images/Sprites for Play.js
        this.load.image('layerMain', './assets/layerMain.png')
        this.load.image('layerForeground', './assets/layerForeground.png')
        this.load.image('layerBackground1', './assets/layerBackground.png')
        this.load.image('layerBackground2', './assets/layerBackground2.png')
        this.load.image('layerSky', './assets/layerBackgroundSky.png')
        this.load.spritesheet('slimeWalk', './assets/slimeWalk.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 3
        })
        this.load.spritesheet('slimeJump', './assets/slimeWalk.png', {
            frameWidth: 16,
            frameHeight: 16,
            startFrame: 0,
            endFrame: 3
        })

        // Load GameOver Screen
        this.load.image('gameOverBackground', './assets/gameOverBackground.png')

        // Load enemies
        this.load.image('rock', './assets/smallRock.png')
        this.load.image('wallBottom', './assets/wall.png')
        this.load.image('bigRock', './assets/rock.png')

        // load audio
        this.load.audio('menuMusic', './assets/menuMusic.mp3');
        this.load.audio('menuSelectionSound', './assets/menuSelectionSound.wav')
        this.load.audio('menuSelectionSoundReturn', './assets/menuSelectionSoundReturn.wav')
        this.load.audio('jumpSound', './assets/jump.wav')
        this.load.audio('deathSound', './assets/death.wav')
    }



    create() {
        if(enteredMenuScene != true) {
            // Animation for buttons on title screen
            this.anims.create({
            key: 'menuButtons',
            frames: this.anims.generateFrameNumbers('titleScreenButtons', { start: 0, end: 1, first: 0 }),
            frameRate: 1,
            repeat: -1
        }) 

            // Animation configuration for the slime when walking
            this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('slimeWalk', { start: 0, end: 3, first: 0 }),
            frameRate: 5,
            repeat: -1
        })

        // Animation configuration for the slime when jumping up
        this.anims.create({
            key: 'jumpRise',
            frames: this.anims.generateFrameNumbers('slimeJump', { start: 3, end: 3, first: 3 }),
            frameRate: 1
        })        

            // Triggers menu event flag
            enteredMenuScene = true
            
            // The Background Music
            this.menuMusic = this.sound.add('menuMusic')
            this.menuMusic.volume = 0.3
            this.menuMusic.loop = true
            this.menuMusic.play()

            // Menu seleciton sound effect
            this.menuSelectionSound = this.sound.add('menuSelectionSound')
            this.menuSelectionSound.volume = 0.3
        }

        // Title Screen Image
        let titleScreen = this.add.sprite(game.config.width / 2, game.config.height / 2, 'titleScreen')

        // Animates the buttons on the menu
        let buttonSprite = this.add.sprite(game.config.width / 2, game.config.height / 2, 'titleScreenButtons')
        buttonSprite.play('menuButtons')

        // Define keys for menu
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP)
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN)
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)
    }



    update() {
        if (Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.start('playScene')
            this.menuSelectionSound.play()
        }
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
            this.scene.start('creditsScene')
            this.menuSelectionSound.play()
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
            this.scene.start('controlsScene')
            this.menuSelectionSound.play()
        }
    }
}