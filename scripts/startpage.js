// opening splash screen

class startpage extends Phaser.Scene {

    constructor() {
        super({ key: "startpage" });
    }

    preload() {
        this.load.audio('megablast', './assets/sounds/megablast.mp3');
    }

    create() {

        music = this.sound.add('megablast');
        music.loop = true;
        music.play();

        this.text = this.add.text(winW / 2 - 50, winH / 2 - 60, "textFIRE", { font: "24px Arial", fill: "#000000" });
        this.text = this.add.text(winW / 2 - 300, winH / 2 - 10, "an extraordinary game of interstellar excitement and adventure, AND bad words", { font: "16px Arial", fill: "#000000" });
        this.text = this.add.text(winW / 2 - 240, winH / 2 + 20, "SPACE - fire, CURSOR KEYS - move your ship, P - pause game", { font: "16px Arial", fill: "#000000" });
        this.text = this.add.text(winW / 2 - 115, winH / 2 + 40, "ANY MOUSE BUTTON to begin!", { font: "16px Arial", fill: "#000000" });
        this.text = this.add.text(winW / 2 - 240, winH / 2 + 80, "Graphics optimised for: Chrome (current version), Kubuntu 18.04, Windows 10", { font: "14px Arial", fill: "#FF0000" });

        this.input.on('pointerdown', function (pointer) {
            $.confirm({
                theme: 'supervan',
                columnClass: 'col-md-12',
                title: 'Before you begin...',
                content: '' +
                    '<form action="" class="formName">' +
                    '<div class="form-group">' +
                    '<label>Enter your ship name here</label>' +
                    '<br />' +
                    '<input type="text" placeholder="Ship name" class="name form-control" required autofocus/>' +
                    '</div>' +
                    '</form>',
                buttons: {

                    formSubmit: {
                        text: 'Enter name',
                        btnClass: 'btn-orange',
                        action: function () {
                            playerName = this.$content.find('.name').val();
                            document.getElementById('shipnamedraw').innerHTML = playerName;
                            const nodex = document.getElementById('shipnamedraw');
                            var tempcalc = document.getElementById('shipnamedraw');
                            var stylex = window.getComputedStyle(tempcalc);
                            heightS = +((stylex.height).slice(0, -2));
                            widthS = +((stylex.width).slice(0, -2));
                            domtoimage.toPng(nodex, { quality: 0.95, height: 50, width: widthS }).then(function (dataUrl) {
                                var img = new Image();
                                img.src = dataUrl;
                                datax = dataUrl;
                                startReady = true;
                            });
                        },
                    },
                    cancel: function () {
                        //close
                    },
                },
                onContentReady: function () {
                    // bind to events
                    var jc = this;
                    this.$content.find('form').on('submit', function (e) {
                        // if the user submits the form by pressing enter in the field.
                        e.preventDefault();
                        jc.$$formSubmit.trigger('click'); // reference the button and click it

                    });
                }
            });

        });
    }

    update(time, delta) {
        if (playerName && startReady) {
            this.scene.start("gameloop");
        }
    }


}
