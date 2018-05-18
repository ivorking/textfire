// main gameloop


class gameloop extends Phaser.Scene {

    constructor() {
        super ({key: "gameloop"});

    }

    preload () {
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
       
    create () {
    
        // player setup
        
        var music = this.sound.add('song');
        music.play();
        lastFired: 0;
    
        this.player = this.physics.add.sprite(20, 200, 'ship').setDepth(1);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.player.setCollideWorldBounds(true);
        
        // bullet setup
        this.lastFired = 0;
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
     
        this.physics.world.enable(this.bullets, this.player, enemies);
        this.physics.add.collider(this.bullets, enemies, this.destroyEnemy, null, this);
        this.physics.add.collider(this.player, enemies, this.shipCollide, null, this);


    }
    
    createEnemies () {

        var config = {
            key: 'standard'
        }



        if (score == 0) {
            enemies = this.physics.add.group();
            enemies.create(winW-50,Phaser.Math.RND.integerInRange(1, winH),'boss' + (Phaser.Math.RND.integerInRange(1, 5))).setActive();

            // this.physics.add.sprite(winW-20, (Math.floor(Math.random() * Math.floor(winH))), ('boss' + (Math.floor(Math.random() * 6) + 1))).setActive();  

            // this.physics.world.enable(this.bullets, this.player, enemies);
            // this.physics.add.collider(this.bullets, enemies, this.destroyEnemy, null, this);
            // this.physics.add.collider(this.player, enemies, this.shipCollide, null, this);

            buildEnemy = false;
            console.log("first run");
 
        } else {
            for (let index = 0; index <= score; index++) {
                enemies.create(winW-50,Phaser.Math.RND.integerInRange(1, winH),'boss' + (Phaser.Math.RND.integerInRange(1, 5))).setActive();
           
            }
            buildEnemy = false;
        }

    };
    
    update (time, delta) {
    
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
            this.bullet = this.bullets.get();
            this.bullet.setActive(true);
            this.bullet.setVisible(true);
            gunfire = this.sound.add('gunfire');
            gunfire.play();

            if (this.bullet)
            {
                this.bullet.fire(this.player);
                this.lastFired = time + 100;
            }
        }
    
        background.tilePositionX += 0.5;
        console.log(buildEnemy);
        if (buildEnemy) { this.createEnemies() };
    }
    
    shipCollide () {
        explosion = this.sound.add('explosion');
        explosion.play();
    
        console.log("Ships collide!");
        this.enemies.children.entries[0].disableBody(true, true);
        this.player.disableBody(true, true);
    }
    
    destroyEnemy () {
        explosion = this.sound.add('explosion');
        explosion.play();
    
        console.log("Enemy destroyed!");
        enemies.children.entries[0].disableBody(true, true);
        score++;
        scoreText.setText('Score: ' + score);

        buildEnemy = true;


    }
    
    
}