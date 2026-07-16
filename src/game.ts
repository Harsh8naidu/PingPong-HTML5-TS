import Phaser from "phaser";

const config = {
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
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let leftPaddle;
let rightPaddle;
let ball;

let leftScore = 0;
let rightScore = 0;

let scoreText;
let messageText;

let keys;

let gameStarted = false;
let gameOver = false;


function create() {

    // Create paddles
    leftPaddle = this.add.rectangle(
        50,        // x position
        360,       // y center
        20,
        100,
        0x0066ff
    );

    rightPaddle = this.add.rectangle(
        1230,      // x position
        360,       // y center
        20,
        100,
        0xff3333
    );


    // Enable physics
    this.physics.add.existing(leftPaddle);
    this.physics.add.existing(rightPaddle);

    leftPaddle.body.setImmovable(true);
    rightPaddle.body.setImmovable(true);


    // Create ball
    ball = this.add.circle(
        640,
        360,
        10,
        0xffffff
    );

    this.physics.add.existing(ball);

    ball.body.setCollideWorldBounds(true);
    ball.body.setBounce(1, 1);

    // Prevent slowing down
    ball.body.setDrag(0, 0);
    ball.body.setDamping(false);

    // Allow detecting left/right exits
    this.physics.world.setBoundsCollision(false, false, true, true);

    // Start ball stopped
    ball.body.setVelocity(0, 0);


    // Collision between ball and paddles
    this.physics.add.collider(
        ball,
        leftPaddle
    );

    this.physics.add.collider(
        ball,
        rightPaddle
    );


    // Keyboard controls
    keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        up: Phaser.Input.Keyboard.KeyCodes.UP,
        down: Phaser.Input.Keyboard.KeyCodes.DOWN
    });


    // Score text
    scoreText = this.add.text(
        640,
        50,
        "0 : 0",
        {
            fontSize: "40px",
            fill: "#ffffff"
        }
    ).setOrigin(0.5);

    // Start message
    messageText = this.add.text(
        400,
        300,
        "PRESS ANY KEY TO PLAY",
        {
            fontSize: "30px",
            fill: "#ffffff"
        }
    ).setOrigin(0.5);


    // Any key starts the game
    this.input.keyboard.on(
        "keydown",
        startGame
    );

}



function startGame() {

    if(gameStarted)
        return;


    gameStarted = true;

    messageText.setVisible(false);


    // Give ball starting velocity
    ball.body.setVelocity(
        300,
        150
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
    if(keys.up.isDown) {
        rightPaddle.y -= 6;
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


    // Check scoring
    if(!gameOver) {

        if(ball.x < 0) {
            rightScore++;
            checkGameOver();
            resetBall();
        }

        if(ball.x > 1280) {
            leftScore++;
            checkGameOver();
            resetBall();
        }
    }

    scoreText.setText(
        `${leftScore} : ${rightScore}`
    );

}



function resetBall() {

    ball.setPosition(
        640,
        360
    );

    ball.body.setVelocity(
        0,
        0
    );


    // Wait 1 second then launch again
    setTimeout(() => {

        let speedX = Phaser.Math.Between(250, 350);
        let speedY = Phaser.Math.Between(-150, 150);

        if(Math.random() < 0.5)
            speedX *= -1;

        ball.body.setVelocity(
            speedX,
            speedY
        );

    }, 1000);

}

function checkGameOver() {

    if(leftScore >= 10 || rightScore >= 10) {

        gameOver = true;

        ball.body.setVelocity(0,0);

        messageText.setVisible(false);

        if(leftScore >= 10) {

            messageText.setText(
                "BLUE WINS!\nGAME OVER"
            );

        }
        else {

            messageText.setText(
                "RED WINS!\nGAME OVER"
            );

        }

    }

}