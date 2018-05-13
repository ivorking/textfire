var winW = window.innerWidth;
var winH = window.innerHeight;

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
            createBulletEmitter: createBulletEmitter,
            createEnemies: createEnemies,
            createStarfield: createStarfield,
        }
    }
};

var game = new Phaser.Game(config);

var bulletTime = 300;
var direction = 1;
var fireButton;
var score = 0;
var gameOver = false;
var scoreText;

function init () {
}

function preload () {
    this.load.image('ship', './assets/ship.png', { frameWidth: 32, frameHeight: 48 });
    this.load.image('bullet', './assets/bullet.png');
    this.load.image('enemy', './assets/enemy.png');
    this.load.image('star', './assets/backtile.png');
}

function render () {
    this.debug.text( 'This is debug text', 100, 380 );
}

function create () {

    // player setup
    this.player = this.physics.add.sprite(20, 200, 'ship').setDepth(1);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.player.setCollideWorldBounds(true);

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
    this.cameras.main.setBounds(0, 0, null, 600);
    this.cursors = this.input.keyboard.createCursorKeys();
    this.bullets = this.physics.add.group({
        classType: Bullet,
        runChildUpdate: true
    });

    this.createStarfield();
    this.bullets.enableBody = true;
    this.createEnemies();
    this.physics.world.enable(this.bullets, this.player, this.enemyship);
    this.physics.add.collider(this.bullets, this.enemyship, destroyEnemy, null, this);

    console.log(this.player);
    console.log(this.enemyship);

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
    scoreText = this.add.text(5, 5, 'Score: 0', { fontSize: '20px', fill: '#000' });

}

function createEnemies () {

    var config = {
        key: 'standard'
    }

    this.enemyship = this.physics.add.sprite(winW-100, 200, 'enemy').setActive();
    this.enemyship.setVelocity(-50, 0);

}

function createBulletEmitter ()
{
    this.flares = this.add.particles('flares').createEmitter({
        x: 1600,
        y: 200,
        angle: { min: 170, max: 190 },
        scale: { start: 0.4, end: 0.2 },
        blendMode: 'ADD',
        lifespan: 500,
        on: false
    });
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

        if (bullet)
        {
            bullet.fire(this.player);
            this.lastFired = time + 100;
        }

    }
    this.physics.world.collide(this.player, this.enemyship, shipCollide, null, this);

    this.cameras.main.scrollX = this.player.x - 400;

}

function createStarfield ()
{
    //  Starfield background
    var group = this.add.group({ key: 'star', frameQuantity: 256 });
    group.createMultiple({ key: 'star', frameQuantity: 32 });
    var rect = new Phaser.Geom.Rectangle(0, 0, 3500, 550);
    Phaser.Actions.RandomRectangle(group.getChildren(), rect);
    group.children.iterate(function (child, index) {
        var sf = Math.max(0.3, Math.random());
        if (child.texture.key === 'star')
        {
            sf = 0.2;
        }
        child.setScrollFactor(sf);
    }, this);
}

function shipCollide () {
    console.log("Ships collide!");
    this.physics.pause();
}

function destroyEnemy () {
    console.log("Enemy destroyed!");
    this.physics.pause();
}

