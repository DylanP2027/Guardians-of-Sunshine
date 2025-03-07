// Event trigger so that menu stuff isn't triggered more than once
let enteredMenuScene = false

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene"); // Assigns the key name to this scene
    }

    preload() {
        // Load Main Menu spritesheet
        this.load.spritesheet('mainMenuSpriteSheet', './assets/mainMenu.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: 1
        });

        // Load GameOver Screen
        this.load.image('youLose', './assets/youLose.png');

        // Load Win Screen (Fixed the key name)
        this.load.image('youWin', './assets/youWin.png');

        // Load Current Level Scene
        this.load.image('currentLevel', './assets/level1.png');

        // Load enemies
        this.load.image('sleepySam', './assets/sleepySam.png');
        this.load.image('hunnyBunny', './assets/hunnyBunny.png');
        this.load.image('bouncyBee', './assets/bouncyBee.png');

        // Load audio
        this.load.audio('gameMusic', './assets/gameMusic.mp3');
    }

    create() {
        if(enteredMenuScene != true) {

            enteredMenuScene = true; // Flags the event

            // Animation for the title screen
            this.anims.create({
                key: 'mainMenu',
                frames: this.anims.generateFrameNumbers('mainMenuSpriteSheet', { start: 0, end: 1, first: 0 }),
                frameRate: 1,
                repeat: -1
            });

            // Background Music
            this.gameMusic = this.sound.add('gameMusic');
            this.gameMusic.volume = 0.1;
            this.gameMusic.loop = true;
            this.gameMusic.play();
        }

        // Create the main menu sprite and position it at the center
        this.mainMenuSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'mainMenuSpriteSheet');
       
        // Set the sprite's origin to the center
        this.mainMenuSprite.setOrigin(0.5, 0.5);

        // Scale to fit the height of the screen while maintaining aspect ratio
        let scaleFactor = this.scale.height / this.mainMenuSprite.height;
        this.mainMenuSprite.setScale(scaleFactor);

        // Play the animation
        this.mainMenuSprite.play('mainMenu');

        // Define keys for menu navigation
        this.keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyUP)) {
            this.scene.start('currentLevelScene');
            // this.menuSelectionSound.play();
        }
    }
}
