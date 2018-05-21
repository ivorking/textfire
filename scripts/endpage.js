class endpage extends Phaser.Scene {

    constructor() {
        super ({key: "endpage"});
    }

    create() {
        this.text = this.add.text(winW/2 - 200, winH/2 - 50, "Too bad you lost. Better luck next time.", {font: "24px Arial", fill: "#000000"});
        this.text = this.add.text(winW/2 - 120, winH/2, "press fire to go back to start menu!", {font: "16px Arial", fill: "#000000"});
        this.key_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {
        if (this.key_1.isDown) {
            this.resetvars();
            rerun = true;
            window.location.reload();
            this.scene.start('gameloop');
        }
    }

    resetvars() {
        winW = window.innerWidth;
        winH = window.innerHeight;
        bulletTime = 300;
        direction = 1;
        score = 0;
        hardcounter = 0;
        rotatevar = [];
        rotatevar.length = 0;
        tempvar = 0;
        gamepaused = false;
        endgamevar = false;
        gameOver = false;
        enemies = [];
        enemies.length = 0;
        enemiesToSpawn = 3;
        buildEnemy = true;
        totalObjects = 600;
        maxVelocity = 2;
        starSize = 1.5;
        twinkleFreq = 50000;
        canvas = document.getElementById('field');
        canvas.width = winW;
        canvas.height = winH;
        ctx = canvas.getContext("2d");
        stars = [];
        stars.length = 0;
        updatefn = 0;
    }
}