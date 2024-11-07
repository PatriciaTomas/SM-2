var BombController = new Phaser.Class({
    Extends: Phaser.Events.EventEmitter,

    initialize: function BombController(scene) {
        this.scene = scene;
        this.bomb = scene.bomb;
        this.explosion = scene.explosion;
        this.player = scene.player;

        this.createBombAnimations();

        this.bombRolling = false; // Flag para saber se a bomba deve rolar
        this.bombRollSpeed = 3; // Velocidade do movimento da bomba
        this.bombRotationSpeed = 6; // Velocidade de rotação da bomba
        this.bombRollDuration = 4000; // Duração do rolamento em milissegundos
        this.bombRollStartTime = 0;
    },

    update: function(time, delta) {
        this.handleMovement(time, delta);
    },

    handleMovement: function(time, delta) {
        if (this.bombRolling && this.bomb) {
            // Inicializa o tempo de início do rolamento, se ainda não estiver definido
            if (this.bombRollStartTime === 0) {
                this.bombRollStartTime = time; // Define o tempo de início da rolagem
                this.scene.sound.play('fuseSound');
            }

            // Move a bomba para a direita
            this.bomb.setVelocityX(this.bombRollSpeed);

            // Rotaciona a bomba conforme a velocidade
            this.bomb.angle += this.bombRotationSpeed * (delta / 16.666); // Ajusta a rotação com base no tempo delta

            // Verifica o tempo decorrido desde o início da rolagem
            let elapsed = time - this.bombRollStartTime;

            // Ajusta a taxa de quadros da animação da bomba com base no tempo decorrido
            if (elapsed <= 1000) {
                // Primeiro segundo: taxa de quadros baixa
                if (this.bomb.anims.msPerFrame !== 500) {
                    this.bomb.anims.msPerFrame = 500; // Ajusta para 2 FPS (500 ms por frame)
                }
            } else if (elapsed <= 3000) {
                // Entre 1 e 3 segundos: taxa de quadros original
                if (this.bomb.anims.msPerFrame !== 50) {
                    this.bomb.anims.msPerFrame = 50; // Ajusta para 20 FPS (50 ms por frame)
                }
            }

            // Verifica se o tempo de rolagem acabou
            if (elapsed > this.bombRollDuration) {
                this.bombRolling = false; // Para o rolamento da bomba
                this.bomb.setVelocityX(0); // Para o movimento da bomba

                let explosionX = this.bomb.x;
                let explosionY = this.bomb.y;

                // Após o término do rolamento, cria e toca a animação de explosão
                this.bomb.setVisible(false); // Torna a bomba invisível
                this.bomb.destroy(); // Remove a bomba do jogo
                this.bomb = null; // Limpa a referência à bomba

                // Cria e toca a animação de explosão
                this.explosion = this.scene.matter.add.sprite(explosionX, explosionY, 'explosion')
                    .setScale(8)
                    .setBounce(0)
                    .setFixedRotation()
                    .play('explosion');

                this.scene.sound.play('explosionSound2');

                // Adiciona evento para quando a animação de explosão termina
                this.explosion.on('animationcomplete', () => {
                    if (this.explosion) {
                        const distance = Phaser.Math.Distance.Between(this.scene.player.x, this.scene.player.y, this.explosion.x, this.explosion.y);
                        const explosionRadius = 400; // Ajuste o raio conforme necessário

                        if (distance <= explosionRadius) {
                            this.player.loseLife(2); // O jogador perde 2 vidas
                        }

                        this.explosion.destroy(); // Remove a explosão após aplicar o efeito
                        this.explosion = null; // Limpa a referência à explosão
                    }
                });
            }
        }
    },



    createBombAnimations: function () {
        this.bomb.anims.create({
            key: 'bomb',
            frames: this.bomb.anims.generateFrameNames('bomb', { start: '1', end: '2', prefix: 'bomb', suffix: '.png' }),
            frameRate: 2,
            repeat: -1,
        });
    },
    createExplosionAnimations: function () {
        this.explosion.anims.create({
            key: 'explosion',
            frames: this.explosion.anims.generateFrameNames('explosion', { start: '0', end: '9', prefix: 'explosion_', suffix: '.png' }),
            frameRate: 20,
            hideOnComplete: true
        });
    },
});
