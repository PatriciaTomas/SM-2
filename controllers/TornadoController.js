var TornadoController = new Phaser.Class({
    Extends: Phaser.Events.EventEmitter,

    initialize: function TornadoController(scene) {
        Phaser.Events.EventEmitter.call(this);
        this.scene = scene;
        this.tornado = scene.tornado;

        this.createTornadoAnimations();

        this.tornadoDirection = -1; // 1 para direita, -1 para esquerda
        this.tornadoMoveTimer = 0;
    },

    update: function(time, delta) {
        this.handleMovement(delta);
    },

    handleMovement: function(delta) {
        if (!this.tornado) return;

        // Atualizar o movimento do tornado
        this.tornadoMoveTimer += delta;

        // Mudar de direção a cada 5000 milissegundos
        if (this.tornadoMoveTimer >= 5000) {
            this.tornadoDirection *= -1; // Inverter a direção
            this.tornadoMoveTimer -= 5000;
        }

        // Velocidade do movimento lateral do tornado
        var tornadoSpeed = 5;

        // Mover o tornado de acordo com a direção atual
        this.tornado.setVelocityX(tornadoSpeed * this.tornadoDirection);
    },
    
    createTornadoAnimations: function () {
        this.tornado.anims.create({
            key: 'tornado',
            frames: this.tornado.anims.generateFrameNames('tornado', { start: 1, end: 44, prefix: 'tornado-', suffix: '.png' }),
            frameRate: 5,
            repeat: -1
        });
    },

    
});
