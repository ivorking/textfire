// opening splash screen

class startpage extends Phaser.Scene {

    constructor() {
        super ({key: "startpage"});
    }

    create() {
        this.text = this.add.text(winW/2 - 50, winH/2 - 60, "textFIRE", {font: "24px Arial", fill: "#000000"});
        this.text = this.add.text(winW/2 - 300, winH/2 - 10, "an extraordinary game of interstellar excitement and adventure, AND bad words", {font: "16px Arial", fill: "#000000"});
        this.text = this.add.text(winW/2 - 240, winH/2 +20, "SPACE - fire, CURSOR KEYS - move your ship, P - pause game", {font: "16px Arial", fill: "#000000"});
        this.text = this.add.text(winW/2 - 70, winH/2 +40, "press fire to begin!", {font: "16px Arial", fill: "#000000"});

        this.key_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

    }

    update(time, delta) {
        if (this.key_1.isDown) {
            this.scene.start("gameloop");
        }
    }
}
