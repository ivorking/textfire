// phaser 3 main scene navigation & app start page

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
var tempvarx;
var tempvary;
var gamepaused = false;
var endgamevar = false;
var scoreText;
var waveText;
var enemies = [];
var enemiesToSpawn = 3;
var music;
var gunfire;
var explosion;
var firstrun = true;
var wavecounter = 0;
var timedEvent;
var wavenum = 8;
var speedNum;
var music;
var playerName;

// starvars

var totalObjects = 600;
var maxVelocity = 2;
var starSize = 1.5;
var twinkleFreq = 50000;
var canvas = document.getElementById('field');
canvas.width = winW;
canvas.height = winH;
var ctx = canvas.getContext("2d");
var stars = [];

// start game

var game = new Phaser.Game(config);


