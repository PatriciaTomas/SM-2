var Victory = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Victory() {
        Phaser.Scene.call(this, { key: 'Victory' });
    },

    create: function (data) {
        // Reproduz o som de Game Over
        this.sound.play('victorySound');

        var gameTime = data.time || 0; // Pega o tempo passado, ou 0 se não estiver definido
        const { width, height } = this.scale;

        this.add.text(width * 0.5, height * 0.3, 'Vitória', {
            fontSize: '52px',
            color: '#fff',
            align: 'center',
            fontStyle: 'bold',

        }).setOrigin(0.5);

        this.add.text(width * 0.5, height * 0.2, 'Tempo de Jogo: ' + gameTime + 's', {
            fontSize: '30px',
            color: '#fff',
            align: 'center'
        }).setOrigin(0.5);

        const button = this.add.rectangle(width * 0.5, height * 0.55, 150, 75, 0xffffff)
            .setInteractive();
        button.on('pointerdown', () => {
            this.scene.start('Game'); // Reinicia a cena de jogo
        });


        this.add.text(button.x, button.y, 'Play Again', {
            color: '#000000'
        }).setOrigin(0.5);
    }
});
