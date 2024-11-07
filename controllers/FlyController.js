var FlyController = new Phaser.Class({
    Extends: Phaser.Events.EventEmitter,

    initialize: function FlyController(scene) {
        this.scene = scene;
        this.fly = scene.fly;
        this.createFlyAnimations();
        
        this.fly = null;
        this.flyDirection = -1; // 1 para direita, -1 para esquerda
        this.flyMoveTimer = 0;
        this.flyVerticalDirection = -1; // 1 para cima, -1 para baixo
        this.flyVerticalMoveTimer = 0;
    },

    update: function(time, delta) {
        this.handleMovement(delta);
    },

    handleMovement: function(delta) {
        if (!this.fly) return; // Verifica se a mosca foi inicializada

        // Atualizar o movimento da mosca
        this.flyMoveTimer += delta;
        this.flyVerticalMoveTimer += delta;

        // Mudar de direção horizontal a cada 4 segundos
        if (this.flyMoveTimer >= 4000) {
            this.flyDirection *= -1; // Inverter a direção
            this.flyMoveTimer -= 4000;
            this.fly.setFlipX(this.flyDirection === 1); // Inverter a orientação horizontal
        }

        // Mudar a direção vertical a cada 5 segundos
        if (this.flyVerticalMoveTimer >= 5000) {
            this.flyVerticalDirection *= -1; // Inverter a direção vertical
            this.flyVerticalMoveTimer -= 5000;
        }

        // Velocidade do movimento da mosca
        var flySpeed = 3;
        var flyVerticalSpeed = 3;

        // Mover a mosca de acordo com a direção atual
        this.fly.setVelocityX(flySpeed * this.flyDirection);
        this.fly.setVelocityY(flyVerticalSpeed * this.flyVerticalDirection);
    },

    
createFlyAnimations: function () {
    this.fly.anims.create({
        key: 'fly',
        frames: this.fly.anims.generateFrameNames('fly', { start: 1, end: 2, prefix: 'fly_', suffix: '.png' }),
        frameRate: 10,
        repeat: -1
    });
},
});
