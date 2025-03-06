// speed at which the background scrolls
this.scrollSpeed = 1

this.isGrounded = false // Checks to see if it can double jump

this.jumps = 3 // Sets it so that you cannot jump right after loading in

this.highscore = 0 // sets the highscore to 0 by default



class Play extends Phaser.Scene {
    constructor() {
        super("playScene") // Basically gives names the key to this object menuScene
    }

    init() {
        // Value of Gravity
        this.physics.world.gravity.y = 1800

        // variables for the slime
        this.jumpVelocity = -450
        this.maxJumps = 2

        this.score = 0

        this.summonTime = false // Event flag stated that an object cannot be summoned
    }

    create() {
        this.jumps = 3 // Makes sure that the player cannot jump immediately after being loaded in

        this.scrollSpeed = 1 // Sets the scroll speed to the default

        this.highscore = localStorage.getItem("bestScore") || 0 // gets the stored highscore locally

        // Defines control for this scene
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    
        // Fade in animation
        this.cameras.main.fadeIn(1000, 226, 243, 228)
    
        // Layers of sprites
        this.layerSky = this.add.sprite(0, 0, 'layerSky').setOrigin(0, 0)
        this.layerBackground2 = this.add.tileSprite(0, 0, 160, 144, 'layerBackground2').setOrigin(0, 0)
        this.layerBackground1 = this.add.tileSprite(0, 0, 160, 144, 'layerBackground1').setOrigin(0, 0)
        this.layerMain = this.physics.add.staticImage(game.config.width/2, game.config.height-8, 'layerMain')
    
        // Add the slime
        this.slime = this.physics.add.sprite(15, game.config.height/2, 'slimeWalk')
        this.slime.anims.play('walk', true)

        // Adds the foreground
        this.layerForeground = this.add.tileSprite(0, 0, 160, 144, 'layerForeground').setOrigin(0, 0)
        this.layerForeground.setDepth(2)

        // Add collider
        this.physics.add.collider(this.slime, this.layerMain, () => {
            this.isGrounded = true;
            this.jumps = 0;
            this.slime.anims.play('walk', true);
        })

        // Sound effect for returning back to the main menu
        this.menuSelectionSoundReturn = this.sound.add('menuSelectionSoundReturn')
        this.menuSelectionSoundReturn.volume = 0.3

        // Sound effect for jumping
        this.jumpSound = this.sound.add('jumpSound')
        this.jumpSound.volume = 0.3

        // Sound effect for dying
        this.deathSound = this.sound.add('deathSound')
        this.deathSound.volume = 0.6

        // The intial text for the score
        this.scoreText = this.add.text(10, 10, `EXP: ${this.score}`, {
            fontSize: '8px',
            font: 'Verdana'
        })

        // Event to track every 1 second so the score can increment
        this.time.addEvent({
            delay: 1000, // 1 second
            callback: this.updateScore,
            callbackScope: this,
            loop: true // Keeps repeating
        })

        // Event to track every 1 second so an object can spawn in
        this.time.addEvent({
            delay: 1000,
            callback: this.updateSummonTime,
            callbackScope: this,
            loop: true
        })
    }
    

    update() {
        // Parallaxing background
        this.layerBackground2.tilePositionX += (0.05 * this.scrollSpeed)
        this.layerBackground1.tilePositionX += (0.1 * this.scrollSpeed)
        this.layerForeground.tilePositionX += (0.75 * this.scrollSpeed)

        if(this.summonTime) { // Checks if the 1 second interval has passed
            let randNum = Math.random() // Randomly selects an object to summon

            if (randNum < 0.25) {
                // Don't summon anything
                this.summonTime = false
            }
            else if(randNum >= 0.25 && randNum < 0.5) {
                // Rock Enemy
                this.rock = this.physics.add.image(game.config.width+5, game.config.height-16, 'rock')
                this.rock.setDepth(1)

                this.summonTime = false
                // Collider for rock and ground
                this.physics.add.collider(this.rock, this.layerMain)
        
                // Add collider for slime and rock
                this.physics.add.collider(this.slime, this.rock, () => {
                    if(this.score > this.highscore) {
                        localStorage.setItem('bestScore', this.score)
                    }

                    this.registry.set('recentScore', this.score);

                    this.deathSound.play()
                    this.scene.start('gameOverScene')
                })

                this.rock.setVelocityX(-75 * this.scrollSpeed);
            }
            else if (randNum >= 0.5 && randNum <0.75) {
                // Summon big rock
                this.bigRock = this.physics.add.image(game.config.width+8, game.config.height-24, 'bigRock')
                this.bigRock.setDepth(1)

                this.summonTime = false
                // Collider for bigRock and ground
                this.physics.add.collider(this.bigRock, this.layerMain)
        
                // Add collider for slime and bigRock
                this.physics.add.collider(this.slime, this.bigRock, () => {
                    if(this.score > this.highscore) {
                        localStorage.setItem('bestScore', this.score)
                    }
                    this.registry.set('recentScore', this.score);

                    this.deathSound.play()
                    this.scene.start('gameOverScene')
                })

                this.bigRock.setVelocityX(-75 * this.scrollSpeed);
            }
            else {
                // Summon Wall
                this.summonTime = false

                this.wallBottom = this.physics.add.image(game.config.width, game.config.height-32, 'wallBottom')
                // Collider for rock and ground
                this.physics.add.collider(this.wallBottom, this.layerMain)

                this.wallBottom.setDepth(1)
        
                // Add collider for slime and rock
                this.physics.add.collider(this.slime, this.wallBottom, () => {
                    if(this.score > this.highscore) {
                        localStorage.setItem('bestScore', this.score)
                    }
                    this.registry.set('recentScore', this.score)

                    this.deathSound.play()
                    this.scene.start('gameOverScene')
                })

                this.wallBottom.setVelocityX(-75 * this.scrollSpeed);
            }
        }

        // To track when to speed up the game
        if(this.score < 15) {
            this.scrollSpeed = 1
        }
        else if(this.score >= 15 && this.score < 30) {
            this.scrollSpeed = 1.2
        }
        else if(this.score >= 30 && this.score < 50) {
            this.scrollSpeed = 1.5
        }
        else if(this.score >= 50 && this.score < 75) {
            this.scrollSpeed = 2
        }
        else if(this.score >= 75 && this.score < 100) {
            this.scrollSpeed = 3
        }
        else if(this.score >= 100) {
            this.scrollSpeed = 4
        }

        // For the different lengths of holding the jump button
        // High jump
        if (this.isGrounded && Phaser.Input.Keyboard.JustDown(keyJUMP) && this.jumps <= 2) {
            this.slime.setVelocityY(this.jumpVelocity);
            this.isJumping = true;

            this.jumpSound.play()

            if(this.jumps == 0) {
                this.cameras.main.shake(50, 0.005)
            }

            this.jumps += 1

            this.slime.anims.play('jumpRise', true)
        }

        // Short Jump
        if (this.isJumping && Phaser.Input.Keyboard.JustUp(keyJUMP) && this.jumps <= 2) {
            this.isJumping = false
            this.jumps += 1
            if (this.slime.body.velocity.y < this.jumpVelocity / 2) {
                this.slime.setVelocityY(this.jumpVelocity / 2); // Reduce velocity for short jump
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start('menuScene')
            this.menuSelectionSoundReturn.play()
        }
        if (Phaser.Input.Keyboard.JustDown(keyRESET)) {
            this.scene.start('playScene')
            this.deathSound.play()
        }
    }



    updateScore() {
        this.score += 1; // Increment score
        this.scoreText.setText(`EXP: ${this.score}`); // Updates text
    }



    updateSummonTime() {
        this.summonTime = true
    }
}