class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene") // Basically gives names the key to this object menuScene
    }



    init() {
        this.callNextScene = false; // The flag to trigger the next scene, used for the timer
    }



    create() {
        // Stops the game music
        let gameMusic = this.registry.get('gameMusic');
        gameMusic.stop();

        // Background Color (Black)
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0,0)

        // You Win Sprite
        this.youLoseSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'youLose').setScale(8);

        // Game over SFX
        this.gameMusic = this.sound.add('gameOverSound');
        this.gameMusic.volume = 0.2;
        this.gameMusic.play();
        
        // 3 second timer to call next scene
        this.time.addEvent({
            delay: 3000,
            callback: this.updateCallNextScene,
            callbackScope: this,
            loop: false
        })
    }



    update() {
        if (this.callNextScene) {
            this.scene.start('menuScene') // Returns to the menu
        }
    }



    // Helper function to trigger the callNextScene flag
    updateCallNextScene() {
        this.callNextScene = true;
    }
}