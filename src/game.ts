import Phaser from "phaser";


const config: Phaser.Types.Core.GameConfig = {

    type: Phaser.AUTO,

    width: 1280,
    height: 720,

    backgroundColor: "#000000",

    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        parent: "game",
        expandParent: true
    },


    physics: {
        default: "arcade",

        arcade: {
            debug: false
        }
    },


    scene: {
        // TODO
        // create
        // update
    }

};


const game = new Phaser.Game(config);