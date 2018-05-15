var winW = window.innerWidth;
var winH = window.innerHeight;
var background;

var config = {
    type: Phaser.AUTO,
    width: winW,
    height: winH,
    parent: 'phaser-example',
    backgroundColor: '#ffffff',
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            setBounds: {
                x: 0,
                y: 0,
                width: winW,
                height: winH,
                thickness: 32
            }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
        render: render,
        extend: {
            minimap: null,
            player: null,
            cursors: null,
            flares: null,
            bullets: null,
            lastFired: 0,
            text: null,
            createEnemies: createEnemies,
        }
    },
    audio: {
        disableWebAudio: true
    }
};

var game = new Phaser.Game(config);

var bulletTime = 300;
var direction = 1;
var score = 0;
var gameOver = false;
var scoreText;

var music;
var gunfire;
var explosion;

function preload () {
    this.load.image('ship', './assets/ship.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('bullet', './assets/bullet.png');
    this.load.image('boss1', './assets/boss1.png');
    this.load.image('boss2', './assets/boss2.png');
    this.load.image('boss3', './assets/boss3.png');
    this.load.image('boss4', './assets/boss4.png');
    this.load.image('boss5', './assets/boss5.png');
    this.load.image('boss6', './assets/boss6.png');
    this.load.image('starfield', './assets/starfield.png');
    this.load.image('star2', './assets/star2.png');
    this.load.image('star3', './assets/star3.png');
    this.load.image('star4', './assets/star4.png');

    this.load.audio('song', './assets/sounds/music.mp3');
    this.load.audio('gunfire', './assets/sounds/gun.mp3');
    this.load.audio('explosion', './assets/sounds/explosion.mp3');
}

function render () {
    this.debug.text( 'This is debug text', 100, 380 );
}

function create () {

    // player setup

    var music = this.sound.add('song');
    music.play();

    this.player = this.physics.add.sprite(20, 200, 'ship').setDepth(1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);
    
    // bullet setup

    var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');
            this.speed = 0.5;
            this.born = 0;
        },

        fire: function (player)
        {
            this.setPosition(player.x, player.y);
            this.born = 0;
        },

        update: function (time, delta)
        {
            this.x += this.speed * delta;
            this.born += delta;
            if (this.born > 1000)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }
    });

    this.cameras.main.setBounds(0, 0, winW, winH);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true
    });

    background = this.add.tileSprite(0, 0, winW * 3, winH * 2, 'starfield');
  
    this.bullets.enableBody = true;
    this.createEnemies();
    this.anims.create({
        key: 'left',
        frames: [ { key: 'ship', frame: 0 } ],
        frameRate: 10,
        repeat: -1
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

    // score
    scoreText = this.add.text(5, 5, 'Score:' + score, { fontSize: '20px', fill: '#000' });
   
}

function createEnemies () {

    var config = {
        key: 'standard'
    }

    enemyships = this.physics.add.group;

    for (let index = 0; index <= score; index++) {
        this.enemyship = this.physics.add.sprite(winW-20, (Math.floor(Math.random() * Math.floor(winH))), ('boss' + (Math.floor(Math.random() * 6) + 1))).setActive();      
        this.enemyship.setVelocity(-50, 0);
        this.physics.world.enable(this.bullets, this.player, this.enemyship);
        this.physics.add.collider(this.bullets, this.enemyship, destroyEnemy, null, this);
        this.physics.add.collider(this.player, this.enemyship, shipCollide, null, this);
        console.log(index);
    }
    index = 0;

}

function update (time, delta) {

    // player ship controls

    if (this.cursors.left.isDown)
    {
        this.player.setVelocityX(-160);
        this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown)
    {
        this.player.setVelocityX(160);
        this.player.anims.play('right', true);
    }
    else if (this.cursors.up.isDown)
    {
        this.player.setVelocityY(-160);
        this.player.anims.play('up', true);
    }
    else if (this.cursors.down.isDown)
    {
        this.player.setVelocityY(160);
        this.player.anims.play('down', true);
    }
    else
    {
        this.player.setVelocityX(0);
        this.player.setVelocityY(0);
    }

    if (this.cursors.space.isDown && time > this.lastFired)
        {
        bullet = this.bullets.get();
        bullet.setActive(true);
        bullet.setVisible(true);
        gunfire = this.sound.add('gunfire');
        gunfire.play();

        if (bullet)
        {
            bullet.fire(this.player);
            this.lastFired = time + 100;
        }
    }

    background.tilePositionX += 0.5;
}

function shipCollide () {
    explosion = this.sound.add('explosion');
    explosion.play();

    console.log("Ships collide!");
    this.enemyship.disableBody(true, true);
    this.player.disableBody(true, true);
}

function destroyEnemy () {
    explosion = this.sound.add('explosion');
    explosion.play();

    console.log("Enemy destroyed!");
    this.enemyship.disableBody(true, true);
    score++;
    scoreText.setText('Score: ' + score);
    this.createEnemies();
}

