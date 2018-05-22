// main gameloop

class Star {

    constructor (X,Y,Velocity,Opacity) 
    {
        this.X = Math.random()*winW;
        this.Y = Math.random()*winH;
        this.Velocity = this.getRandFloat(0.2, 1) * maxVelocity;
        this.Opacity = ((Math.random() * 10) + 1 ) * 0.1;
    }

    Draw () {
        ctx.fillStyle = "rgba(0,0,0," + this.Opacity + ")";
        if (Math.round((Math.random()*twinkleFreq))==1) {
            ctx.fillRect(this.X,this.Y,starSize+2,starSize+2);
        } else {
            ctx.fillRect(this.X,this.Y,starSize,starSize);
        }
    };

    UpdateField () {
        this.X -= this.Velocity;
        if (this.X < 0){
            this.X = winW + 1;
        }
    };

    getRandFloat (min, max) {
        return Math.random() * (max - min) + min;
    }

};

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
        this.load.image('boss7', './assets/boss7.png');
        this.load.image('boss8', './assets/boss8.png');
        this.load.image('boss9', './assets/boss9.png');
        this.load.image('boss10', './assets/boss10.png');
        this.load.image('boss11', './assets/boss11.png');
        this.load.image('boss12', './assets/boss12.png');
        this.load.image('safety', './assets/safety.png');
        this.load.image('hardship', './assets/hardship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('star2', './assets/star2.png');
        this.load.image('star3', './assets/star3.png');
        this.load.image('star4', './assets/star4.png');
        this.load.spritesheet('explosionsource', './assets/explosionsheet2.png', { frameWidth: 64, frameHeight: 64, endFrame: 23 });

        this.load.audio('song', './assets/sounds/music.mp3');
        this.load.audio('gunfire', './assets/sounds/gun.mp3');
        this.load.audio('explosion', './assets/sounds/explosion.mp3');
    }
       
    create () {
    
        // player setup

        var music = this.sound.add('song');
        music.play();
        lastFired: 0;
    
        this.player = this.physics.add.sprite(250, 250, 'ship').setDepth(1);
        this.player.setScale(1.2);
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
                this.setPosition(player.x + 70, player.y);
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
    
        // plain starfield - faster, less resource intensive, less impressive
        // background = this.add.tileSprite(0, 0, winW * 3, winH * 2, 'starfield');
      
        this.bullets.enableBody = true;

        // player animations (different images to be enabled)

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

        scoreText = this.add.text(5, 5, 'Score:' + score, { fontSize: '17px', fill: '#FFFFFF' });
        this.physics.world.enable(this.bullets, this.player, enemies);
        
        // explosion animation

        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosionsource', { start: 0, end: 23, first: 23 }),
            frameRate: 20,
            hideOnComplete: true
        });

        this.createEnemies();

        // starfield setup

        this.initField();
        this.drawField();

        // pause listener

        this.input.keyboard.on('keydown_P', function (event) {
            if (gamepaused) {
                this.scene.resume();
                gamepaused = false;
            } else {
                this.scene.pause();
                gamepaused = true;
            }
        }, this);

        timedEvent = this.time.addEvent({ delay: 12000, callback: this.waveBuilder, callbackScope: this, repeat: 20 });

    }

    createEnemies () {

        if (enemies.length === 0) {
            enemies = this.physics.add.group();
        }

        var config = {
            key: 'standard'
        }

        let spawnVar = Phaser.Math.RND.integerInRange(1, 6);
        let speedVar;
        let currentEnemies = enemies.children.entries.length;
        let index = 0;
        
        if (firstrun) {
            enemies.create(winW + 100,Phaser.Math.RND.integerInRange(30, winH - 30),'boss' + (Phaser.Math.RND.integerInRange(1, 12))).setActive();
            enemies.create(winW + 100,Phaser.Math.RND.integerInRange(30, winH - 30),'boss' + (Phaser.Math.RND.integerInRange(1, 12))).setActive();
            enemies.setVelocity(-60, 0);
        } else {
            for (index = 0; index < spawnVar; index++) {
                enemies.create(winW + 100,Phaser.Math.RND.integerInRange(30, winH - 30),'boss' + (Phaser.Math.RND.integerInRange(1, 12))).setActive();
                speedVar = Phaser.Math.RND.integerInRange(40, 145);
                enemies.children.entries[currentEnemies + index].setVelocity(-speedVar, 0);

                tempvarx = Math.random() * 1.7 + 1
                tempvary = Math.random() * 1.7 + 1
                enemies.children.entries[currentEnemies + index].setScale(tempvarx, tempvary);

                // add random spin to some ships

                if ((currentEnemies + index) % 3 == 0) {
                    enemies.children.entries[currentEnemies + index]._rotation = 8;
                    rotatevar.push(currentEnemies + index);
                }
              
            }

            // create hard to kill enemy (moves faster), & safety ship (lose points for hitting it)

            tempvar = Phaser.Math.RND.integerInRange(1, 4)
            if (tempvar == 1) {
                enemies.create(winW + 100,Phaser.Math.RND.integerInRange(1, winH),'hardship').setActive();
                currentEnemies = enemies.children.entries.length;
                enemies.children.entries[currentEnemies - 1].setVelocity(-80, 0);
            } else if (tempvar == 3) {
                enemies.create(winW + 100,Phaser.Math.RND.integerInRange(1, winH),'safety').setActive();
                currentEnemies = enemies.children.entries.length;
                enemies.children.entries[currentEnemies - 1].setVelocity(-90, 0);
            }

        }

        // include colliders

        this.physics.add.collider(this.bullets, enemies, this.destroyEnemy, null, this);
        this.physics.add.collider(this.player, enemies, this.shipCollide, null, this);

    };

    update (time, delta) {

        // player ship controls

        if (!this.player || !this.player.body) return

        if (this.cursors.right.isDown && this.cursors.down.isDown)
        {
            this.player.setVelocityX(160);
            this.player.setVelocityY(160);
            // this.player.anims.play('right', true);
        }
        else if (this.cursors.right.isDown && this.cursors.up.isDown)
        {
            this.player.setVelocityX(160);
            this.player.setVelocityY(-160);
            // this.player.anims.play('up', true);
        }
        else if (this.cursors.left.isDown && this.cursors.down.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.setVelocityY(160);
            // this.player.anims.play('down', true);
        }
        else if (this.cursors.left.isDown && this.cursors.up.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.setVelocityY(-160);
            // this.player.anims.play('down', true);
        }
        else if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.setVelocityY(0);
            // this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.setVelocityY(0);
            // this.player.anims.play('right', true);
        }
        else if (this.cursors.up.isDown)
        {
            this.player.setVelocityY(-160);
            this.player.setVelocityX(0);
            // this.player.anims.play('up', true);
        }
        else if (this.cursors.down.isDown)
        {
            this.player.setVelocityY(160);
            this.player.setVelocityX(0);
            // this.player.anims.play('down', true);
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
    
        // plain starfield:
        // background.tilePositionX += 0.5;

        // garbage collection - remove sprites going off the screen from enemies array

        for (let index = 0; index < enemies.children.entries.length; index++) {
            if (enemies.children.entries[index].x < -30) {
                this.shipCleaner(index);
            } 
        }

        // update rotations for remaining ships on screen

        for (let index = 0; index < rotatevar.length; index++) {
            tempvar = rotatevar[index];
            enemies.children.entries[tempvar]._rotation += 0.05;            
        }

        if (enemies.children.entries.length <= 1) {
            if (firstrun) {
                firstrun = false;
                this.createEnemies();
            } else {
                this.createEnemies();
            }
        }

        this.drawField();

        if (this.wave) {
            let waveships = this.wave.getChildren();
            let numships = waveships.length;
            
            for (let i = 0; i < numships; i++) {
                // move ships
                waveships[i].y += waveships[i].speed;
                waveships[i].x -= Math.abs(waveships[i].speed);
                
                // reverse movement if reached the edges
                if (waveships[i].y >= winH || waveships[i].y <= 0) {
                    waveships[i].speed = waveships[i].speed * -1;
                }
            }
        }

    }
    
    shipCollide (playvar, crashvar) {
        if (!endgamevar) {
            explosion = this.sound.add('explosion');
            explosion.play();
            posvar = enemies.children.entries.indexOf(crashvar);
            boom = this.add.sprite(this.player.x, this.player.y, 'boom');
            boom.anims.play('explode');
            this.player.disableBody(true, true);
            endgamevar = true;
            this.shipCleaner(posvar);
            game.scene.start('endpage');
        }
    };
    
    destroyEnemy (bulletvar, enemyvar) {

        if (enemyvar.texture.key == "hardship") {
            hardcounter ++;
            if (hardcounter == 4) {
                explosion = this.sound.add('explosion');
                explosion.play();
        
                posvar = enemies.children.entries.indexOf(enemyvar);

                // explosion animation

                boom = this.add.sprite(enemies.children.entries[posvar].x, enemies.children.entries[posvar].y, 'boom');
                boom.anims.play('explode');

                // remove dead ship

                this.shipCleaner(posvar);

                score += 4;
        
                scoreText.setText('Score: ' + score);
                hardcounter = 0;
            }
            posvar = this.bullets.children.entries.indexOf(bulletvar);
            this.bullets.children.entries[posvar].destroy();

        } else {
            explosion = this.sound.add('explosion');
            explosion.play();

            posvar = enemies.children.entries.indexOf(enemyvar);

            // explosion animation

            boom = this.add.sprite(enemies.children.entries[posvar].x, enemies.children.entries[posvar].y, 'boom');
            boom.anims.play('explode');

            if (enemyvar.texture.key == "safety") { 
                score -= 10;
            } else {
                score++;
            }
            scoreText.setText('Score: ' + score);

            // remove dead ship

            this.shipCleaner(posvar);

            posvar = this.bullets.children.entries.indexOf(bulletvar);
            this.bullets.children.entries[posvar].destroy();

        }
    }

    waveHit (bulletvar, enemyvar) {
        explosion = this.sound.add('explosion');
        explosion.play();

        let posvarwave = this.wave.children.entries.indexOf(enemyvar);

        // explosion animation

        boom = this.add.sprite(this.wave.children.entries[posvarwave].x, this.wave.children.entries[posvarwave].y, 'boom');
        boom.anims.play('explode');
        scoreText.setText('Score: ' + score);

        // remove dead bullets
        
        posvar = this.bullets.children.entries.indexOf(bulletvar);
        this.bullets.children.entries[posvar].destroy();

        // remove dead ship

        this.wave.children.entries[posvarwave].destroy();

    }
  
    waveCollide (playvar, crashvar) {
        if (!endgamevar) {
            explosion = this.sound.add('explosion');
            explosion.play();
            posvar = this.wave.children.entries.indexOf(crashvar);
            boom = this.add.sprite(this.player.x, this.player.y, 'boom');
            boom.anims.play('explode');
            this.player.disableBody(true, true);
            endgamevar = true;
            game.scene.start('endpage');
        }
    };


    shipCleaner(posvar) {

        // remove dead ship from rotation array

        for (let index = 0; index < rotatevar.length; index++) {
            tempvar = rotatevar[index];
            if (tempvar == posvar) {
                rotatevar.splice(index, 1);
            }
        }

        // update rotatevar given that ships moved to the left in array

        tempvar = enemies.children.entries.length - posvar;

        for (let index1 = 0; index1 < rotatevar.length; index1++) {
            if (rotatevar[index1] > posvar) {
                rotatevar[index1] -= 1;
            }
        }

        // destroy ship

        enemies.children.entries[posvar].disableBody(true, true);
        enemies.children.entries[posvar].destroy();

    }

    // STAR FUNCTIONS

    initField () {
        for(let i=0; i<totalObjects; i++) {
            stars.push(new Star());
        }
    }
      
    drawField () {
        ctx.clearRect(0, 0, winW, winH);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        // ctx.fillRect (0, 0, winW, winH);
        for (let f=0;f<stars.length;f++) {
           stars[f].UpdateField();
           stars[f].Draw();
        }
    }

    waveBuilder () {

        switch(timedEvent.repeatCount) {

            case 20: // wave 1
                this.wave = this.physics.add.group ({
                    key: 'boss3',
                    repeat: 4,
                    setXY: {
                        x: winW + 50,
                        y: winH - 300,
                        stepX: 40,
                        stepY: 40
                    }
                });

                Phaser.Actions.Call(this.wave.getChildren(), function(wave) {
                    wave.speed = 4;
                }, this);
                this.physics.add.collider(this.bullets, this.wave, this.waveHit, null, this);
                this.physics.add.collider(this.player, this.wave, this.waveCollide, null, this);
                break;

            case 19: // wave 2
                this.wave = [];
                this.wave.length = 0;
                this.wave = this.physics.add.group ({
                    key: 'boss5',
                    repeat: 8,
                    setXY: {
                        x: winW + 50,
                        y: winH - 300,
                        stepX: -20,
                        stepY: 70
                    }
                });

                Phaser.Actions.Call(this.wave.getChildren(), function(wave) {
                    wave.speed = 6;
                }, this);
                this.physics.add.collider(this.bullets, this.wave, this.waveHit, null, this);
                this.physics.add.collider(this.player, this.wave, this.waveCollide, null, this);
                break;

            case 18: // wave 3
                this.wave = [];
                this.wave.length = 0;
                this.wave = this.physics.add.group ({
                    key: 'boss6',
                    repeat: 12,
                    setXY: {
                        x: winW + 50,
                        y: 20,
                        stepX: 20,
                        stepY: 40
                    }
                });

                Phaser.Actions.Call(this.wave.getChildren(), function(wave) {
                    wave.speed = 8;
                }, this);
                this.physics.add.collider(this.bullets, this.wave, this.waveHit, null, this);
                this.physics.add.collider(this.player, this.wave, this.waveCollide, null, this);
                break;
        }
    }

};