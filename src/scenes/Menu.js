// Event trigger so that menu stuff isn't triggered more than once
let enteredMenuScene = false

class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene"); // Assigns the key name to this scene
    }

    preload() {
        enteredMenuScene = false;
        // Load UI
        this.load.path = './assets/UI/';

        // Load Icon spritesheets
        this.load.image('LifeIcon', 'UI_life.png')
        this.load.image('BombIcon', 'UIBomb.png')

        // Load Main Menu spritesheet
        this.load.spritesheet('mainMenuSpriteSheet', 'mainMenuBackground.png', {
            frameWidth: 1920,
            frameHeight: 1080,
            startFrame: 0,
            endFrame: 1
        });

        // Load Win Screen
        this.load.image('youWin', 'youWin.png');
        this.load.image('pressSpaceForCredits', 'pressSpaceForCredits.png')

        // Load Current Level Scene
        this.load.image('currentLevel', 'level1.png');

        // Load GameOver Screen
        this.load.image('youLose', 'youLose.png');
        this.load.image('pressR', 'pressR.png')

        // Load Credits Screen
        this.load.image('credits', 'credits.png')

        // Load Instructions Screen
        this.load.image('instructions', 'instructions.png');

        // Load Audio
        this.load.path = './assets/sfx/';
        this.load.audio('gameOverSound', 'gameOverSound.mp3')
        this.load.audio('gameMusic', 'gameMusic.mp3');
        this.load.audio('victoryMusic', 'victoryMusic.mp3');
        this.load.audio('jump', 'jump.mp3');
        this.load.audio('sleepySamEat', 'sleepySamEat.mp3');
        this.load.audio('useLife', 'useLife.mp3');
        this.load.audio('coin', 'coin.mp3');
        this.load.audio('enemySlain', 'enemySlain.mp3')


        // Load for map
        this.load.path = './assets/map/';

        // Load Tilesets
        this.load.image('floor_flame_tilesetImage', 'floorAndFlameSpriteSheet.png')
        this.load.image('steps_tilesetImage', 'caveEntranceSpriteSheet.png')
        this.load.image('ceiling_tilesetImage', 'ceilingSpriteSheet.png')
        this.load.image('background_goop_tilesetImage', 'backgroundAndGoopSpriteSheet.png'); 
        
        this.load.tilemapTiledJSON('tilemapJSON', 'GuardiansOfSunshineFinal.json')

        this.load.spritesheet('sunSpriteSheet', 'sunSpriteSheet.png', {
            frameWidth: 32,
            frameHeight: 34,
            startFrame: 0,
            endFrame: 1,
        })

        // Load Sprites
        this.load.path = './assets/';

        // Load stickman atlas
        this.load.atlas('stickman', 'stickman.png', 'stickman.json')
        this.load.atlas('bombThrow', 'bombThrow.png', 'bombThrow.json')

        // Load Score
        this.load.image('score500', 'score500.png')
        this.load.image('score800', 'score800.png')

        this.load.spritesheet('bomb', 'bomb.png', {
            frameWidth: 12,
            frameHeight: 21,
            startFrame: 0,
            endFrame: 2,
        })

        // Load enemies
        this.load.image('sleepySam', 'sleepySam.png');
        this.load.spritesheet('sleepySamLose', 'sleepySamLose.png', {
            frameWidth: 60,
            frameHeight: 30,
            startFrame: 0,
            endFrame: 31,
        })
        this.load.image('hunnyBunny', 'hunnyBunny.png');
        this.load.spritesheet('hunnyBunnyIdle', 'hunnyBunnySpriteSheet.png', {
            frameWidth: 36,
            frameHeight: 48,
            startFrame: 0,
            endFrame: 2,
        })
        this.load.atlas('hunnyBunnyCreate', 'hunnyBunnyCreate.png', 'hunnyBunnyCreate.json');
        this.load.image('bouncyBee', 'bouncyBee.png');


        // Load UI
        this.load.path = './assets/UI/';
        this.load.image('UIBackground', 'UI.png')

        // Load bitmap font
        this.load.path = './assets/';
        this.load.bitmapFont('numbersFont', 'numbersFont.png', 'numbersFont.xml')
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
            frameRate: 10,
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
            repeat: 0,
        });

        this.anims.create({
            key: 'stickman-punch',
            frames: this.anims.generateFrameNames('stickman',{prefix: 'punch', start: 0, end:2}),
            frameRate: 3,
            repeat: 0,
        });

        this.anims.create({
            key: 'stickman-kick',
            //kick4 extra frame
            frames: this.anims.generateFrameNames('stickman',{prefix: 'kick', start: 0, end:3}),
            frameRate: 3,
            repeat: 0,
        });

        this.anims.create({
            key: 'stickman-bomb',
            frames: this.anims.generateFrameNames('bombThrow',{prefix: 'bomb', start: 0, end:10}),
            frameRate: 4,
            repeat: 0,
        });

        this.anims.create({
            key: 'bombSparkle',
            frames: this.anims.generateFrameNumbers('bomb',{start: 0, end:2}),
            frameRate: 3,
            repeat: -1,
        });

        this.anims.create({
            key: 'HBSpawn',
            frames: this.anims.generateFrameNames('hunnyBunnyCreate', {prefix: 'HB', start: 0, end: 42}),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true,
        })

        this.anims.create({
            key: 'HBIdle',
            frames: this.anims.generateFrameNumbers('hunnyBunnyIdle',{start: 0, end:2}),
            frameRate: 2,
            repeat: -1,
        });

        this.anims.create({
            key: 'sun',
            frames: this.anims.generateFrameNumbers('sunSpriteSheet',{start: 0, end:1}),
            frameRate: 1,
            repeat: -1,
        })

        this.anims.create({
            key: 'samLose',
            frames: this.anims.generateFrameNumbers('sleepySamLose',{start: 0, end:31}),
            frameRate: 5,
            repeat: 0,
        })

        if(enteredMenuScene != true) {

            enteredMenuScene = true;

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
        this.keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keySPACE)) {
            this.scene.start('instructionsScene');
            this.jumpSound = this.sound.add('jump');
            this.jumpSound.volume = 0.4;
            this.jumpSound.play()
        }
    }
}
