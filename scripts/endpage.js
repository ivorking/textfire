class endpage extends Phaser.Scene {

    constructor() {
        super ({key: "endpage"});
    }

    create() {
        this.text = this.add.text(winW/2 - 50, winH/2 - 60, "Too bad you lost. Better luck next time.", {font: "24px Arial", fill: "#000000"});
        this.key_1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update(time, delta) {

        
    }

}