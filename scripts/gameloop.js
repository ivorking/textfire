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

        // setup ship image

        this.textures.addBase64('ship', datax);
        document.getElementById('shipnamedraw').remove();

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

    };

    create () {
              
        music.stop();
        music = this.sound.add('song');
        music.loop = true;
        music.play();
        lastFired: 0;

        // setup player

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
                this.setPosition(player.x + 15 + widthS / 2, player.y - 17);
                this.born = 0;
            },

            update: function (time, delta)
            {
                this.x += this.speed * delta;
                this.born += delta;

                // comment this section out for full-length bullets

                if (this.born > 1000)
                {
                    this.setActive(false);
                    this.setVisible(false);
                    this.enableBody = false;
                    this.destroy();
                }
            }
        });

        this.cameras.main.setBounds(0, 0, winW, winH);
        this.cursors = this.input.keyboard.createCursorKeys();

        if (!endgamevar) {
            this.bullets = this.physics.add.group({
                classType: Bullet,
                runChildUpdate: true
            });
        }

        // plain starfield - faster, less resource intensive, less impressive
        // background = this.add.tileSprite(0, 0, winW * 3, winH * 2, 'starfield');

        this.bullets.enableBody = true;

        // player animations (direction images to be enabled)

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

        timedEvent = this.time.addEvent({ delay: 12000, callback: this.waveBuilder, callbackScope: this, repeat: wavenum });

        // score & waves text

        scoreText = this.add.text(5, 5, 'Score:' + score, { fontSize: '17px', fill: '#FFFFFF' });
        waveText = this.add.text(5, 25, 'Wave:' + (wavenum - timedEvent.repeatCount), { fontSize: '17px', fill: '#FFFFFF' });

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

        // pause keyboard listener

        this.input.keyboard.on('keydown_P', function (event) {
            if (gamepaused) {
                this.scene.resume();
                gamepaused = false;
            } else {
                this.scene.pause();
                gamepaused = true;
            }
        }, this);

        this.physics.world.enable(this.bullets, this.player, enemies, this.wave);

    };

    update (time, delta) {
        // player ship controls, animations commented but to be enabled

        if (!this.player || !this.player.body) return

        if (this.cursors.right.isDown && this.cursors.down.isDown)
        {
            this.player.setVelocityX(160);
            this.player.setVelocityY(160);
            this.player.flipX = false;
        }
        else if (this.cursors.right.isDown && this.cursors.up.isDown)
        {
            this.player.setVelocityX(160);
            this.player.setVelocityY(-160);
            this.player.flipX = false;
        }
        else if (this.cursors.left.isDown && this.cursors.down.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.setVelocityY(160);
            this.player.flipX = true;
        }
        else if (this.cursors.left.isDown && this.cursors.up.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.setVelocityY(-160);
            this.player.flipX = true;
        }
        else if (this.cursors.left.isDown)
        {
            this.player.setVelocityX(-160);
            this.player.setVelocityY(0);
            this.player.flipX = true;
            // this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown)
        {
            this.player.setVelocityX(160);
            this.player.setVelocityY(0);
            this.player.flipX = false;
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

        if ((this.cursors.space.isDown && time > this.lastFired) && (!endgamevar))
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
            if (enemies.children.entries[index].x < -100) {
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

                // move waveships
                waveships[i].y += waveships[i].speed;
                waveships[i].x -= Math.abs(waveships[i].speed);

                // reverse movement if reach the edge of the screen
                if (waveships[i].y >= winH || waveships[i].y <= 0) {
                    waveships[i].speed = waveships[i].speed * -1;
                }
            }
        }
    };

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
            if (tempvar == 1 || tempvar == 2) {
                enemies.create(winW + 100,Phaser.Math.RND.integerInRange(1, winH),'hardship').setActive();
                currentEnemies = enemies.children.entries.length;
                enemies.children.entries[currentEnemies - 1].setVelocity(-80, 0);
            } else if (tempvar == 3) {
                enemies.create(winW + 100,Phaser.Math.RND.integerInRange(1, winH),'safety').setActive();
                currentEnemies = enemies.children.entries.length;
                enemies.children.entries[currentEnemies - 1].setVelocity(-90, 0);
            }
        }

        // add colliders

        this.physics.add.collider(this.bullets, enemies, this.destroyEnemy, null, this);
        this.physics.add.collider(this.player, enemies, this.shipCollide, null, this);

    };

    shipCollide (playvar, crashvar) {
        if (!endgamevar) {
            console.log('here');
            explosion = this.sound.add('explosion');
            explosion.play();
            posvar = enemies.children.entries.indexOf(crashvar);
            boom = this.add.sprite(this.player.x, this.player.y, 'boom');
            boom.anims.play('explode');
            this.player.disableBody(true, true);
            endgamevar = true;
            this.shipCleaner(posvar);

            // stop bullets

            this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            for (let index = 0; index < this.bullets.children.entries.length; index++) {
                this.bullets.children.entries[index].destroy();
            }
            this.bullets.enableBody = false;

            game.scene.start('endpage');
        }
    };

    destroyEnemy (bulletvar, enemyvar) {

        // destroy bullets

        this.bullets.enableBody = false;
        posvar = this.bullets.children.entries.indexOf(bulletvar);
        this.bullets.children.entries[posvar].destroy();

        if (enemyvar.texture.key == "hardship") {

            hardcounter ++;

            if (hardcounter == 6) {
                score += 4;
                hardcounter = 0;
            } else {
                return;
            };

        } else {

            if (enemyvar.texture.key == "safety") {
                score -= 10;
            } else {
                score++;
            }
        }

        // explosion

        explosion = this.sound.add('explosion');
        explosion.play();
        posvar = enemies.children.entries.indexOf(enemyvar);
        boom = this.add.sprite(enemies.children.entries[posvar].x, enemies.children.entries[posvar].y, 'boom');
        boom.anims.play('explode');

        // remove dead ship

        this.shipCleaner(posvar);

        // update score on screen

        scoreText.setText('Score: ' + score);

    };

    waveCollide (playvar, crashvar) {
        if (!endgamevar) {
            explosion = this.sound.add('explosion');
            explosion.play();
            posvar = this.wave.children.entries.indexOf(crashvar);
            boom = this.add.sprite(this.player.x, this.player.y, 'boom');
            boom.anims.play('explode');
            this.player.disableBody(true, true);
            endgamevar = true;

            // stop bullets

            this.input.keyboard.removeKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
            for (let index = 0; index < this.bullets.children.entries.length; index++) {
                this.bullets.children.entries[index].destroy();
            }
            this.bullets.enableBody = false;

            game.scene.start('endpage');
        }
    };

    waveHit (bulletvar, enemyvar) {
        let posvarwave = this.wave.children.entries.indexOf(enemyvar);

        // explosion

        explosion = this.sound.add('explosion');
        explosion.play();
        boom = this.add.sprite(this.wave.children.entries[posvarwave].x, this.wave.children.entries[posvarwave].y, 'boom');
        boom.anims.play('explode');

        // remove dead bullets

        this.bullets.enableBody = false;
        posvar = this.bullets.children.entries.indexOf(bulletvar);
        this.bullets.children.entries[posvar].destroy();

        // remove dead ship

        this.wave.children.entries[posvarwave].destroy();

        // scoring, and bonus for destroying wave

        if (this.wave.children.entries.length == 0) {
            score += 20;
        } else {
            score += 2;
        }
        scoreText.setText('Score: ' + score);
    };

    shipCleaner(shipid) {

        // remove dead ship from rotation array

        for (let index = 0; index < rotatevar.length; index++) {
            tempvar = rotatevar[index];
            if (tempvar == shipid) {
                rotatevar.splice(index, 1);
            }
        }

        // update rotation array given that ships have been removed from enemies

        tempvar = enemies.children.entries.length - shipid;
        for (let index1 = 0; index1 < rotatevar.length; index1++) {
            if (rotatevar[index1] > shipid) {
                rotatevar[index1] -= 1;
            }
        }

        // destroy ship

        enemies.children.entries[shipid].disableBody(true, true);
        enemies.children.entries[shipid].destroy();

    };

    waveBuilder () {

        if (!endgamevar) {
            this.wave = [];
            this.wave.length = 0;

            switch(timedEvent.repeatCount) {

                case (wavenum): // wave 1
                    this.wave = this.physics.add.group ({
                        key: 'boss3',
                        repeat: 5,
                        setXY: {
                            x: winW + 60,
                            y: winH - 400,
                            stepX: 30,
                            stepY: 30
                        }
                    });
                    speedNum = -4;
                    break;

                case (wavenum - 1): // wave 2
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
                    speedNum = -5;
                    break;

                case (wavenum - 2): // wave 3
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
                    speedNum = 6;
                    break;

                case (wavenum - 3): // wave 4
                    this.wave = this.physics.add.group ({
                        key: 'boss2',
                        repeat: 14,
                        setXY: {
                            x: winW + 50,
                            y: 20,
                            stepX: 5,
                            stepY: 60
                        }
                    });
                    speedNum = 3;
                    break;

                case (wavenum - 4): // wave 5
                    this.wave = this.physics.add.group ({
                        key: 'boss11',
                        repeat: 16,
                        setXY: {
                            x: winW + 50,
                            y: 100,
                            stepX: 0,
                            stepY: 100
                        }
                    });
                    speedNum = -7;
                    break;

                case (wavenum - 5): // wave 6
                    this.wave = this.physics.add.group ({
                        key: 'boss12',
                        repeat: 18,
                        setXY: {
                            x: winW + 80,
                            y: 150,
                            stepX: 30,
                            stepY: 40
                        }
                    });
                    speedNum = 8;
                    break;

                case (wavenum - 6): // wave 7
                    this.wave = this.physics.add.group ({
                        key: 'boss7',
                        repeat: 20,
                        setXY: {
                            x: winW + 80,
                            y: 0,
                            stepX: 30,
                            stepY: 30
                        }
                    });
                    speedNum = 10;
                    break;

                case (wavenum - 7): // wave 8
                    this.wave = this.physics.add.group ({
                        key: 'boss9',
                        repeat: 25,
                        setXY: {
                            x: winW + 80,
                            y: 0,
                            stepX: 0,
                            stepY: 30
                        }
                    });
                    speedNum = 5;
                    break;

                }

            Phaser.Actions.Call(this.wave.getChildren(), function(wave) {
                wave.speed = speedNum;
            }, this);

            this.physics.add.collider(this.bullets, this.wave, this.waveHit, null, this);
            this.physics.add.collider(this.player, this.wave, this.waveCollide, null, this);
            waveText.setText('Wave:' + (wavenum - timedEvent.repeatCount + 1));
        }
    };

    // STAR FUNCTIONS

    initField () {
        for(let i=0; i<totalObjects; i++) {
            stars.push(new Star());
        }
    }

    drawField () {
        ctx.clearRect(0, 0, winW, winH);
        ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
        for (let f=0;f<stars.length;f++) {
            stars[f].UpdateField();
            stars[f].Draw();
        }
    }
};
