
let winW = window.innerWidth;
let winH = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: winW,
    height: winH,
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;

var game = new Phaser.Game(config);

function preload () {
    this.load.image('ship', './assets/ship.png', { frameWidth: 32, frameHeight: 48 });
}

function create () {
    player = this.physics.add.sprite(100, 450, 'ship');
    player.setCollideWorldBounds(true);
    this.anims.create({
        key: 'left',
        frames: [ { key: 'ship', frame: 0 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'ship', frame: 0 } ],
        frameRate: 1
    });

    this.anims.create({
        key: 'right',
        frames: [ { key: 'ship', frame: 0 } ],
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'up',
        frames: [ { key: 'ship', frame: 0 } ],
        frameRate: 1,
        repeat: 1
    });

    this.anims.create({
        key: 'down',
        frames: [ { key: 'ship', frame: 0 } ],
        frameRate: 10,
        repeat: 1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();
    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

}

function update () {

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);
        player.anims.play('right', true);
    }
    else if (cursors.up.isDown)
    {
        player.setVelocityY(-160);
        player.anims.play('up', true);
    }
    else if (cursors.down.isDown)
    {
        player.setVelocityY(160);
        player.anims.play('down', true);
    }
    else
    {
        player.setVelocityX(0);
        player.setVelocityY(0);
        // player.anims.play('turn');
    }


}


function hitBomb (player, bomb) {

    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;
}