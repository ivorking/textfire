// phaser 3 scene navigation & app start page

var winW = window.innerWidth;
var winH = window.innerHeight;

var config = {
    type: Phaser.AUTO,
    width: winW,
    height: winH,
    parent: 'phaser-example',
    backgroundColor: '#ffffff',
    title: 'textFIRE'
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
    audio: {
        disableWebAudio: true
    },
    scene: [ startpage, gameloop, endpage]

};

var background;
var bulletTime = 300;
var direction = 1;
var score = 0;
var gameOver = false;
var scoreText;
var enemies = [];
var enemiesToSpawn = 3;

var music;
var gunfire;
var explosion;

var game = new Phaser.Game(config);


