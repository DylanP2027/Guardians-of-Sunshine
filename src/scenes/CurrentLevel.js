class CurrentLevel extends Phaser.Scene {
    constructor() {
        super("currentLevelScene")
    }



    init() {
        this.callNextScene = false; // The flag to trigger the next scene
    }



    create() {
        // Background Color (Black)
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0x000000).setOrigin(0,0)

        // You Win Sprite
        this.currentLevelSprite = this.add.sprite(this.scale.width / 2, this.scale.height / 2, 'currentLevel').setScale(5);

        // Event to track 3 seconds
        this.time.addEvent({
            delay: 3000,
            callback: this.updateCallNextScene,
            callbackScope: this,
            loop: false
        })
    }



    update() {
        if (this.callNextScene) {
            this.scene.start('playScene') // Returns to the menu
        }
    }



    // Helper function to trigger callNextScene flag
    updateCallNextScene() {
        this.callNextScene = true;
    }
}