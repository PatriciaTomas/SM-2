var UI = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function UI() {
        Phaser.Scene.call(this, { key: 'UI' });

        this.lives = 3;
        this.startTime = null;
        this.gameStarted = false;
        this.totalGameTime = 0;
    },

    preload: function () {
        // Carregar recursos se necessário
    },

    create: function () {
        // Inicializa a UI
        this.createHearts();
        this.createTimeText();
    },

    update: function (time, delta) {
        if (this.gameStarted) {
            this.updateTime();
        }

    },

    createHearts: function () {
        const heartsY = 50;
        const heartsX = 100;
        this.hearts = [
            this.add.image(this.cameras.main.width / 2 - heartsX, heartsY, 'heart-full').setScrollFactor(0).setDepth(10),
            this.add.image(this.cameras.main.width / 2, heartsY, 'heart-full').setScrollFactor(0).setDepth(10),
            this.add.image(this.cameras.main.width / 2 + heartsX, heartsY, 'heart-full').setScrollFactor(0).setDepth(10)
        ];
        this.updateHearts();
    },

    updateHearts: function () {
        for (let i = 0; i < this.hearts.length; i++) {
            this.hearts[i].setTexture(i < this.lives ? 'heart-full' : 'heart-empty');
        }
    },

    createTimeText: function () {
        this.timeText = this.add.text(20, 20, 'Tempo: 0s', { font: '32px Arial', fill: '#404040' })
            .setScrollFactor(0)
            .setDepth(10)
            .setScale(1.5);
    },

    updateTime: function () {
        if (this.startTime !== null) {
            this.totalGameTime = Math.floor((this.game.loop.time - this.startTime) / 1000); // Tempo passado em segundos
            this.timeText.setText('Tempo: ' + this.totalGameTime + 's');
        }
    },

    startGame: function () {
        if (!this.gameStarted) {
            const cursors = this.input.keyboard.createCursorKeys();
            if (cursors.left.isDown || cursors.right.isDown) {
                this.gameStarted = true;
                this.startTime = this.game.loop.time;
                console.log('Game started at:', this.startTime);
            }
        }
    },

});
