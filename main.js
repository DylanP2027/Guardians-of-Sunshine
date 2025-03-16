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
    zoom: 1,
    physics: {
      default: "arcade",
      arcade: {
        debug: true
      }
    },
    scene: [ Menu, CurrentLevel, Play, GameOver, Win ]
  }
  
  let game = new Phaser.Game(config) // Sets up the new phaser game.
  
  let keyRESET, keyJUMP, keyUP, keyLEFT, keyRIGHT, keyABILITY, keyPUNCH, keyKICK // Reserved keyboard bindings.
  let keyDanceUP, keyDanceDOWN, keyDanceRIGHT, keyDanceLEFT
  
  // Sets the UI size
  let borderUISize = game.config.height / 15
  let borderPadding = borderUISize / 3