// Names: Justin Fong and Dylan Paras
// Title: Guardians of Sunshine
// 
//
//
// Technical Execution:
//    Physics System - Arcade Physics
//    Cameras - Main Camera & UI Camera
//    Animation Manager
//    Timers
//    Tilemaps
//    Bitmap Font (For Score During Gameplay
//
//
//
// Polish & Style:
//    Since we used arcade physics, we had to get creative with our slopes and we believe our
//    implementation using several circular hitboxes was a creative solution instead of reconfiguring
//    our entire project to switch to matter.js.
//
//    Our artstyle is quite polished and cohesive. We attempted to be as close to the as possible
//    within reason, redrawing the somewhat oddly shaped handrawn "sprites" into actual sprites.
//    
//    The final boss, Sleepy Sam, has a unique battle, forcing the player into a combo move. The
//    unique method of combat is a key part to the episode Guardians of Sunshine is featured in
//    being a prominent part of how Finn and Jake are able to send the enemies back into the game.



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
    scene: [ Menu, Instructions, CurrentLevel, Play, GameOver, Win, Credits ]
  }
  
  let game = new Phaser.Game(config) // Sets up the new phaser game.
  
  let keySPACE, keyRESET, keyJUMP, keyUP, keyLEFT, keyRIGHT, keyABILITY, keyPUNCH, keyKICK // Reserved keyboard bindings.
  let keyDanceUP, keyDanceDOWN, keyDanceRIGHT, keyDanceLEFT
  
  // Sets the UI size
  let borderUISize = game.config.height / 15
  let borderPadding = borderUISize / 3