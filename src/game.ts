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
        create,
        update
    }

};

new Phaser.Game(config);

let leftPaddle: Phaser.GameObjects.Rectangle;
let rightPaddle: Phaser.GameObjects.Rectangle;

let ball: Phaser.GameObjects.Arc;

let scoreText: Phaser.GameObjects.Text;
let messageText: Phaser.GameObjects.Text;

let keys: Controls;

type Controls = {

    w: Phaser.Input.Keyboard.Key;

    s: Phaser.Input.Keyboard.Key;

    up: Phaser.Input.Keyboard.Key;

    down: Phaser.Input.Keyboard.Key;

};

let leftScore = 0;
let rightScore = 0;

let gameStarted = false;

let gameOver = false;

type GameMode = "singleplayer" | "multiplayer";

let gameMode: GameMode = "singleplayer";
let selectingGameMode = true;

function create(this: Phaser.Scene) {


    leftPaddle = this.add.rectangle(
        50,
        360,
        20,
        100,
        0x0066ff
    );


    rightPaddle = this.add.rectangle(
        1230,
        360,
        20,
        100,
        0xff3333
    );


    this.physics.add.existing(leftPaddle);
    this.physics.add.existing(rightPaddle);


    const leftBody = leftPaddle.body as Phaser.Physics.Arcade.Body;
    leftBody.setImmovable(true);

    const rightBody = rightPaddle.body as Phaser.Physics.Arcade.Body;
    rightBody.setImmovable(true);

    ball = this.add.circle(
        640,
        360,
        10,
        0xffffff
    );


    this.physics.add.existing(ball);


    const ballBody =
        ball.body as Phaser.Physics.Arcade.Body;


    ballBody.setCollideWorldBounds(true);
    ballBody.setBounce(1,1);

    ballBody.setDrag(0,0);
    ballBody.setDamping(false);


    this.physics.world.setBoundsCollision(
        false,
        false,
        true,
        true
    );


    ballBody.setVelocity(0,0);

    this.physics.add.collider(
        ball,
        leftPaddle
    );


    this.physics.add.collider(
        ball,
        rightPaddle
    );


    keys = {

        w: this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.W
        ),

        s: this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.S
        ),

        up: this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.UP
        ),

        down: this.input.keyboard!.addKey(
            Phaser.Input.Keyboard.KeyCodes.DOWN
        )

    };


    scoreText = this.add.text(
        640,
        50,
        "0 : 0",
        {
            fontSize:"40px",
            color:"#ffffff"
        }

    ).setOrigin(0.5);

    messageText = this.add.text(
        640,
        300,
        "PRESS 1 - SINGLE PLAYER\n\nPRESS 2 - TWO PLAYER",
        {
            fontSize: "30px",
            color: "#ffffff",
            align: "center"
        }
    ).setOrigin(0.5);

    const modeText = gameMode === "singleplayer"
    ? "Single Player"
    : "Two Player";


    this.add.text(
        640,
        20,
        modeText,
        {
            fontSize: "18px",
            color: "#aaaaaa"
        }
    ).setOrigin(0.5);


    this.input.keyboard!.on(
        "keydown",
        selectGameMode
    );
}

function update() {

    if(gameOver)
        return;

    // Left paddle movement
    if(keys.w.isDown) {
        leftPaddle.y -= 6;
    }

    if(keys.s.isDown) {
        leftPaddle.y += 6;
    }


    // Right paddle movement
    if(gameMode === "multiplayer") {

        if(keys.up.isDown)
            rightPaddle.y -= 6;

        if(keys.down.isDown)
            rightPaddle.y += 6;

    }
    
    else {

        const aiSpeed = 5;

        const targetY = ball.y;

        if(targetY > rightPaddle.y + 8)
            rightPaddle.y += aiSpeed;

        if(targetY < rightPaddle.y - 8)
            rightPaddle.y -= aiSpeed;

    }

    if(keys.down.isDown) {
        rightPaddle.y += 6;
    }


    // Keep paddles inside screen
    leftPaddle.y = Phaser.Math.Clamp(
        leftPaddle.y,
        50,
        670
    );

    rightPaddle.y = Phaser.Math.Clamp(
        rightPaddle.y,
        50,
        670
    );

    if(ball.x < 0){

        rightScore++;
        checkGameOver();
        resetBall();

    }


    if(ball.x > 1280){

        leftScore++;
        checkGameOver();
        resetBall();

    }


    scoreText.setText(
        `${leftScore} : ${rightScore}`
    );
}

function startGame(){


    if(gameStarted)
        return;


    gameStarted = true;


    messageText.setVisible(false);

    const body =
        ball.body as Phaser.Physics.Arcade.Body;


    body.setVelocity(
        300,
        150
    );

}

function selectGameMode(
    event: KeyboardEvent
) {

    if(!selectingGameMode)
        return;

    if (gameMode === "multiplayer") {
    // Two player
    gameMode = "multiplayer";
    } else {
        // Single player
        gameMode = "singleplayer";
    }

    selectingGameMode = false;

    startGame();

}

function resetBall(){


    ball.setPosition(
        640,
        360
    );


    const body =
        ball.body as Phaser.Physics.Arcade.Body;


    body.setVelocity(
        0,
        0
    );


    setTimeout(()=>{


        let speedX =
            Phaser.Math.Between(
                250,
                350
            );


        let speedY =
            Phaser.Math.Between(
                -150,
                150
            );


        if(Math.random()<0.5)
            speedX *= -1;


        body.setVelocity(
            speedX,
            speedY
        );


    },1000);

}

function checkGameOver(){


    if(leftScore >= 10 || rightScore >=10){


        gameOver = true;


        const body =
            ball.body as Phaser.Physics.Arcade.Body;


        body.setVelocity(
            0,
            0
        );


        messageText.setVisible(true);


        if(leftScore >=10){

            messageText.setText(
                "BLUE WINS!\nGAME OVER"
            );

        }
        else{

            messageText.setText(
                "RED WINS!\nGAME OVER"
            );

        }

    }

}