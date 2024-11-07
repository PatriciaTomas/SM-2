var PlayerController = new Phaser.Class({
    Extends: Phaser.Events.EventEmitter,

    initialize: function PlayerController(scene) {
        this.scene = scene;
        this.player = scene.player; // Referencia o jogador já criado na cena
        this.cursors = scene.cursors;
        this.spaceBar = scene.spaceBar;

        this.createPlayerAnimations();

        // Adiciona a função de colisão ao jogador
        this.player.setOnCollide((data) => {
            this.handleCollision(data);
        });
    },

    update: function (time, delta) {
        this.handleMovement();
    },

    handleMovement: function () {

        // Verifica se o jogador está no chão
        const isOnGround = this.player.body.velocity.y === 0; // Ou use uma abordagem mais robusta

        const speed = 10;
        if (this.cursors.left.isDown) {
            this.player.flipX = true;
            this.player.setVelocityX(-speed);
            this.player.anims.play('player-walk', true);
        } else if (this.cursors.right.isDown) {
            this.player.flipX = false;
            this.player.setVelocityX(speed);
            this.player.anims.play('player-walk', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('player-idle', true);
        }

        if (this.spaceBar.isDown && isOnGround) {
            this.player.setVelocityY(-12);
            this.player.anims.play('player-jump', true);
            this.isOnGround = false; // Desative a flag até o jogador retornar ao chão
        }

    },

    handleCollision: function (data) {
        const body = data.bodyB; // Objeto com o qual o jogador colidiu
        const gameObject = body.gameObject;

        if (!gameObject) return;

        // Verifica se o gameObject é um tipo específico
        const type = gameObject.getData('type');
        
        if (body.gameObject === this.player) {
            switch (type) {
                case 'water':
                    this.scene.itemCount.water++;
                    this.scene.collectedWaters++;
                    gameObject.destroy();
                    this.scene.sound.play('popSound');
                    break;

                case 'trash':
                    this.scene.itemCount.trash++;
                    this.scene.collectedTrash++;
                    gameObject.destroy();
                    this.scene.sound.play('popSound');
                    break;

                case 'spike':
                    this.scene.start('GameOver', { time: this.scene.totalGameTime });
                    break;

                case 'bomb':
                    if (!this.scene.bombActivated && this.scene.bomb) {
                        this.scene.bomb.setVisible(true);
                        this.scene.bombRolling = true;
                        this.scene.bombRollStartTime = this.scene.time.now;
                        this.scene.bombActivated = true;
                        if (this.scene.boxExplosive) {
                            this.scene.boxExplosive.anims.play('box');
                        }
                    }
                    break;

                case 'tornado':
                case 'fly':
                    this.loseLife(1);
                    break;

                default:
                    // Caso padrão para qualquer outro tipo
                    break;
            }
        }
    },

    loseLife: function (amount) {
        this.scene.lives -= amount;
        if (this.scene.lives <= 0) {
            this.scene.start('GameOver', { time: this.scene.totalGameTime });
        }
    },

    createPlayerAnimations: function () {
        this.player.anims.create({
            key: 'player-idle',
            frames: [{ key: 'player', frame: '5.png' }]
        });
        this.player.anims.create({
            key: 'player-jump',
            frames: [{ key: 'player', frame: '4.png' }]
        });
        this.player.anims.create({
            key: 'player-walk',
            frames: this.player.anims.generateFrameNames('player', { start: 6, end: 7, suffix: '.png' }),
            frameRate: 10,
            repeat: -1
        });
    },

});
