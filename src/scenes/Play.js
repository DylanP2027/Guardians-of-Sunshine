class Play extends Phaser.Scene {
    constructor() {
        super("playScene") // Basically gives names the key to this object menuScene
    }

    init() {
        // Value of Gravity
        this.physics.world.gravity.y = 1800
    }

    create() {
        // Defines control for this scene
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
        // keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
        keyJUMP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)

        // Sound effect for returning back to the main menu

        // Sound effect for jumping

        // Sound effect for dying

        // The intial text for the score

    }
    

    update() {
        
    }
}