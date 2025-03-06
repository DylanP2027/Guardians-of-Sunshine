// Name: Justin Fong and Dylan Paras
// Title: Guardians of Sunshine
// 
//
//


let config = {
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    pixelArt: true,
    zoom: 2,
    physics: {
      default: "arcade",
      arcade: {
        debug: false
      }
    },
    scene: [ Menu, CurrentLevel, Play, GameOver, Win ]
  }
  
  let game = new Phaser.Game(config) // Sets up the new phaser game.
  
  let keyJUMP, keyLEFT, keyRIGHT, keyABILITY, keyATTACK, keyDanceUP, keyDanceDOWN, keyDanceRIGHT, keyDanceLEFT // Reserved keyboard bindings.
  
  // Sets the UI size
  let borderUISize = game.config.height / 15
  let borderPadding = borderUISize / 3