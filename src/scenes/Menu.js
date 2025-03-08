// Event trigger so that menu stuff isn't triggered more than once
let enteredMenuScene = false

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene"); // Assigns the key name to this scene
    }

    preload() {
        this.load.path = './assets/';

        // Load Main Menu spritesheet
        this.load.spritesheet('mainMenuSpriteSheet', 'mainMenu.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: 1
        });

        // Load stickman atlas
        this.load.atlas('stickman', 'stickman.png', 'stickman.json')

        // Load GameOver Screen
        this.load.image('youLose', 'youLose.png');
        this.load.audio('gameOverSound', 'gameOverSound.mp3')

        // Load Win Screen (Fixed the key name)
        this.load.image('youWin', 'youWin.png');

        // Load Current Level Scene
        this.load.image('currentLevel', 'level1.png');

        // Load for map
        this.load.image('tilesetImage', 'BasicTileset.png')
        this.load.tilemapTiledJSON('tilemapJSON', 'GuardiansOfSunshine.json')

        // Load enemies
        this.load.image('sleepySam', 'sleepySam.png');
        this.load.image('hunnyBunny', 'hunnyBunny.png');
        this.load.image('bouncyBee', 'bouncyBee.png');

        // Load audio
        this.load.audio('gameMusic', 'gameMusic.mp3');
    }

    create() {
        this.anims.create({
            key: 'stickman-idle',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'idle', start: 0, end:3}),
            frameRate: 3,
            repeat: -1,
        });

        this.anims.create({
            key: 'stickman-idle-stand',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'idle', start: 3, end:3}),
            frameRate: 1,
            repeat: -1,
        });

        this.anims.create({
            key: 'stickman-walk',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'walk', start: 0, end:1}),
            frameRate: 2,
            repeat: -1,
        });

        this.anims.create({
            key: 'stickman-jump',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'jump', start: 0, end:6}),
            frameRate: 7,
            repeat: 0,
        });
        
        //used only if performing another jump before jump animation returns to idle
        this.anims.create({
            key: 'stickman-rejump',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'rejump', start: 0, end:0}),
            frameRate: 1,
            repeat: 0,
        });

        //used when in a combat sequence but not performing one of the moves
        this.anims.create({
            key: 'stickman-battle',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'battle', start: 0, end:0}),
            frameRate: 1,
            repeat: -1,
        });

        this.anims.create({
            key: 'stickman-punch',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'punch', start: 0, end:2}),
            frameRate: 3,
            repeat: -1,
        });

        this.anims.create({
            key: 'stickman-kick',
            //kick4 extra frame
            frames: this.anims.generateFrameNames('stickman',{prefix: 'kick', start: 0, end:3}),
            frameRate: 4,
            repeat: -1,
        });

        this.anims.create({
            key: 'stickman-bomb',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'bomb', start: 0, end:10}),
            frameRate: 2,
            repeat: -1,
        });

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
            this.gameMusic.volume = 0.15;
            this.gameMusic.loop = true;
            this.gameMusic.play();
            this.registry.set('gameMusic', this.gameMusic); // Store in registry
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
        this.keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyUP)) {
            this.scene.start('currentLevelScene');
            // this.menuSelectionSound.play();
        }
        if (Phaser.Input.Keyboard.JustDown(this.keyDOWN)) {
            this.scene.start('gameOverScene');
            // this.menuSelectionSound.play();
        }
    }
}
