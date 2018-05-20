// phaser 3 scene navigation & app start page

var winW = window.innerWidth;
var winH = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: winW,
    height: winH,
    parent: 'phaser-example',
    transparent: true,
    title: 'textFIRE',
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

    scene: [ startpage, gameloop, endpage ],

};

var background;
var bulletTime = 300;
var direction = 1;
var score = 0;
var posvar;
var enemyvar;
var hardcounter = 0;
var rotatevar = [];
var boom;
var tempvar = 0;

var gameOver = false;
var scoreText;
var enemies = [];
var enemiesToSpawn = 3;
var buildEnemy = true;

var music;
var gunfire;
var explosion;

var game = new Phaser.Game(config);


