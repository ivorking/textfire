
let winW = window.innerWidth;
let winH = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: winW,
    height: winH,
    parent: 'phaser-example',
    backgroundColor: '#ffffff',
    physics: {
        default: 'impact',
        impact: {
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
        render: render,
        create: create,
        update: update,
        extend: {
            minimap: null,
            player: null,
            cursors: null,
            thrust: null,
            flares: null,
            bullets: null,
            lastFired: 0,
            text: null,
            createBulletEmitter: createBulletEmitter,
            createThrustEmitter: createThrustEmitter
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
    this.load.image('bullet', './assets/bullet.png')
}

function render () {
    this.debug.text( 'This is debug text', 100, 380 );
}

function create () {

    // player setup
    this.player = this.impact.add.sprite(100, 450, 'ship').setDepth(1);
    this.player.setMaxVelocity(1000).setFriction(800, 600).setPassiveCollision();
    this.cursors = this.input.keyboard.createCursorKeys();

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
    this.cameras.main.setBounds(0, 0, 3200, 600);
    this.createBulletEmitter();
    this.bullets = this.add.group({ classType: Bullet, runChildUpdate: true });
    this.cursors = this.input.keyboard.createCursorKeys();

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
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

}

function update (time, delta) {

    // player ship controls
    // this.thrust.setPosition(this.player.x, this.player.y);

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
        var bullet = this.bullets.get();
        bullet.setActive(true);
        bullet.setVisible(true);

        if (bullet)
        {
            bullet.fire(this.player);
            this.lastFired = time + 100;
        }
    }

    //  Emitters to bullets
    this.bullets.children.each(function(b) {
        if (b.active)
        {
            this.flares.setPosition(b.x, b.y);
            this.flares.setSpeed(b.speed + 500 * -1);
            this.flares.emitParticle(1);
        }
    }, this);
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

function createThrustEmitter ()
{
    this.thrust = this.add.particles('jets').createEmitter({
        x: 1600,
        y: 200,
        angle: { min: 160, max: 200 },
        scale: { start: 0.2, end: 0 },
        blendMode: 'ADD',
        lifespan: 600,
        on: false
    });
}