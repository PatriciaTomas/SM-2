var Game = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Game() {
        Phaser.Scene.call(this, { key: 'Game' });
        this.messages = [];

        this.collectedWaters = 0;
        this.totalWaters = 7;
        this.collectedTrash = 0;
        this.totalTrash = 8;

        this.itemCount = {
            water: 0,
            trash: 0
        };

        this.tornadoController = null;
        this.flyController = null;
        this.bombController = null;
        this.playerController = null;
    },

    preload: function () {
        // Carregar recursos se necessário
    },

    create: function () {
        this.scene.launch('UI');
        this.UI = this.scene.get('UI');

        var mapa = this.make.tilemap({ key: 'map' });
        var tiles = mapa.addTilesetImage('spritesheet', 'tiles', 126, 126);
        var backgroundset1 = mapa.addTilesetImage('desert', 'backgroundDesert', 126, 126);
        var backgroundset2 = mapa.addTilesetImage('grass', 'backgroundGrass', 126, 126);
        mapa.createLayer('Background', [backgroundset1, backgroundset2], 0, 0);

        var ground = mapa.createLayer('Ground', tiles, 0, 0);
        ground.setCollisionByProperty({ colides: true });
        this.matter.world.convertTilemapLayer(ground);

        var platformsLayer = mapa.createLayer('Plataforms', tiles, 0, 0);
        platformsLayer.setCollisionByProperty({ colides: true });
        if (platformsLayer) {
            this.matter.world.convertTilemapLayer(platformsLayer);
        } else {
            console.error("Erro: O layer 'Plataforms' não foi criado corretamente.");
        }

        var box = mapa.createLayer('Box', tiles, 0, 0);
        box.setCollisionByProperty({ colides: true });
        this.matter.world.convertTilemapLayer(box);

        // Inicializa o jogador
        this.player = this.matter.add.sprite(100, 200, 'player')
            .play('player-idle')
            .setFixedRotation()
            .setScale(0.7)
            .isSensor(true);

        // Inicializa a mosca
        var flyObject = mapa.findObject("Objects", obj => obj.name === "fly-spawm");
        if (flyObject) {
            this.fly = this.matter.add.sprite(flyObject.x, flyObject.y, 'fly')
                .play('fly')
                .setScale(1.5)
                .setFixedRotation();
        } else {
            console.error("Erro: Objeto 'fly' não encontrado no Tiled.");
        }

        // Inicializa o tornado
        var tornadoObject = mapa.findObject("Objects", obj => obj.name === "tornado");
        if (tornadoObject) {
            this.tornado = this.matter.add.sprite(tornadoObject.x, tornadoObject.y, 'tornado')
                .play('tornado')
                .setScale(1.5)
                .setFixedRotation();

            this.tornado.setFrictionAir(0.1);
            this.tornado.setMass(10);
        } else {
            console.error("Erro: Objeto 'tornado' não encontrado no Tiled.");
        }

        // Inicializa a bomba
        var bombObject = mapa.findObject("Objects", obj => obj.name === "bomb");
        if (bombObject) {
            this.bomb = this.matter.add.sprite(bombObject.x + 62, bombObject.y, 'bomb')
                .setVisible(false) // Inicialmente invisível
                .play('bomb')
                .setData('type', 'bomb')
                .setScale(0.7)
                .setFrictionAir(0) // Define a fricção do ar para movimento livre
                .setBounce(0); // Define o coeficiente de elasticidade para o movimento
            this.bombActivated = false;
        } else {
            console.error("Erro: Objeto 'bomb' não encontrado no Tiled.");
        }


        // Configuração da câmera
        this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(0.5);

        this.matter.world.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);

        // Configuração dos controles
        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);


        this.createObjectsFromLayer(mapa.getObjectLayer('Objects'));

        this.setupCollisionEvents();


        this.createBoxAnimations();
        this.createGFlagAnimations();
        this.createYFlagAnimations();


        // Inicializa controladores
        this.playerController = new PlayerController(this);
        this.tornadoController = new TornadoController(this);
        this.flyController = new FlyController(this);
        this.flyController.fly = this.fly; // Atribua a mosca ao FlyController
        this.bombController = new BombController(this);

        // Configura a flag de estar no chão
        this.isOnGround = false;

        // Defina a colisão do jogador
        this.player.setOnCollide((event) => {
            const { bodyA, bodyB } = event;

            // Verifique se a colisão é com o chão
            if (bodyA.gameObject === this.player || bodyB.gameObject === this.player) {
                // Verifique se o outro corpo é um chão ou uma plataforma
                this.isOnGround = this.isGroundCollision(bodyA, bodyB);
            }
        });
    },

    update: function (time, delta) {


        // Atualiza o UI
        if (this.UI) {
            this.UI.update();
        }
        this.playerController.update(time, delta);
        this.tornadoController.update(time, delta);
        this.flyController.update(time, delta);
        this.bombController.update(time, delta);

        // Verificar a posição do jogador e a coleta das águas
        if (this.player.x >= 4900 && this.player.x <= 5036 + 50) { // Ajuste o intervalo se necessário
            if (this.collectedWaters === this.totalWaters) {
                this.showMessage('Boa! Coletas-te todas as águas! Avança para o próximo desafio.', this.player.x, this.player.y);
            } else {
                this.showMessage('Coleta todas as águas antes de avançar!', this.player.x, this.player.y);
            }
        }

        // Verificar a posição do jogador e a coleta do lixo
        if (this.player.x >= 9000 && this.player.x <= 9956) { // Ajuste o intervalo se necessário
            if (this.collectedTrash === this.totalTrash) {
                this.showMessage('Parabéns, apanhas-te todo o lixo!', this.player.x, this.player.y);
            } else {
                this.showMessage('Ainda há lixo por apanhar!', this.player.x, this.player.y);
            }
        }

        // Coordenada x máxima permitida
        const maxX = 5000;

        // Verifique a posição atual do jogador e aciona a animação das bandeiras
        if (this.player.x > maxX) {
            // Se o jogador ultrapassou a coordenada x máxima
            if (this.collectedWaters !== this.totalWaters) {
                // Se o jogador não coletou todas as águas, não permita que ele se mova além do limite
                this.player.x = maxX; // Ajuste a posição do jogador de volta ao limite
                console.log('Você precisa coletar todas as águas antes de prosseguir!');
            }
        }

        // Verifique se a bandeira amarela está definida e se a animação deve ser tocada
        if (this.collectedWaters === this.totalWaters && this.yellowFlag) {
            if (this.yellowFlag.anims.currentAnim && this.yellowFlag.anims.currentAnim.key !== 'Yflag') {
                this.yellowFlag.setTexture('Yflag').play('Yflag');
            } else if (!this.yellowFlag.anims.currentAnim) {
                this.yellowFlag.setTexture('Yflag').play('Yflag');
            }
        }

        // Verifique se a bandeira verde está definida e se a animação deve ser tocada
        if (this.collectedTrash === this.totalTrash && this.greenFlag) {
            if (this.greenFlag.anims.currentAnim && this.greenFlag.anims.currentAnim.key !== 'Gflag') {
                this.greenFlag.setTexture('Gflag').play('Gflag');
            } else if (!this.greenFlag.anims.currentAnim) {
                this.greenFlag.setTexture('Gflag').play('Gflag');
            }

            this.scene.start('Victory', { time: this.totalGameTime });
        }
    },

    isGroundCollision: function(bodyA, bodyB) {
        // Verifica se a colisão é com um objeto que deve ser considerado chão
        return bodyA.isStatic || bodyB.isStatic;
    },
    createObjectsFromLayer: function (objectLayer) {
        objectLayer.objects.forEach(objData => {
            var { x = 0, y = 0, name } = objData;

            console.log(`Creating ${name} at x: ${x}, y: ${y}`);

            switch (name) {
                case 'water':
                    var water = this.matter.add.sprite(x + 10, y + 30, 'water', undefined, {
                        isStatic: true,
                        isSensor: true
                    });
                    water.setData('type', 'water');
                    break;

                case 'trash':
                    var trash = this.matter.add.sprite(x, y, 'garbage', undefined, {
                        isStatic: true,
                        isSensor: true
                    });
                    trash.setData('type', 'trash');
                    break;

                case 'spike':
                    var spikeSprite = this.matter.add.sprite(x + 62, y + 62, 'spike', null, {
                        isStatic: true,
                        isSensor: true
                    });
                    spikeSprite.setData('type', 'spike');
                    break;

                case 'box':
                    var boxExplosive = this.matter.add.sprite(x + 62, y + 62, 'box', null, {
                        isStatic: true
                    });
                    boxExplosive.setData('type', 'box');
                    this.boxExplosive = boxExplosive;
                    break;

                case 'yellowFlag':
                    this.yellowFlag = this.matter.add.sprite(x + 62, y + 62, 'YflagDown', null, {
                        isStatic: true,
                        isSensor: true
                    });
                    this.yellowFlag.setData('type', 'yellowFlag');
                    break;

                case 'greenFlag':
                    this.greenFlag = this.matter.add.sprite(x + 62, y + 62, 'GflagDown', null, {
                        isStatic: true,
                        isSensor: true
                    });
                    this.greenFlag.setData('type', 'greenFlag');
                    break;

                default:
                    break;
            }
        });
    },
    createYFlagAnimations: function () {
        this.anims.create({
            key: 'Yflag',
            frames: this.anims.generateFrameNames('Yflag', { start: '1', end: '2', prefix: 'flagYellow', suffix: '.png' }),
            frameRate: 5,
            repeat: -1
        });
    },

    createGFlagAnimations: function () {
        this.anims.create({
            key: 'Gflag',
            frames: this.anims.generateFrameNames('Gflag', { start: '1', end: '2', prefix: 'flagGreen', suffix: '.png' }),
            frameRate: 5,
            repeat: -1
        });
    },
    createBoxAnimations: function () {
        this.anims.create({
            key: 'box',
            frames: this.anims.generateFrameNames('box', { start: '1', end: '3', prefix: 'box_', suffix: '.png' }),
            frameRate: 5,
        });
    },



    setupCollisionEvents: function () {
        this.matter.world.on('collisionstart', (event) => {
            const pairs = event.pairs;

            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;

                if (bodyA.gameObject && bodyB.gameObject) {
                    this.playerController.handleCollision({ bodyB });
                }


            });
        });
    },

    showMessage: function (message) {
        if (this.yellowFlag) {
            this.createMessageBubble(this.yellowFlag.x, this.yellowFlag.y - 100, message);
        } else {
            console.log("Bandeira amarela não encontrada para exibir a mensagem.");
        }

        if (this.greenFlag) {
            this.createMessageBubble(this.greenFlag.x - 300, this.greenFlag.y - 100, message);
        } else {
            console.log("Bandeira verde não encontrada para exibir a mensagem.");
        }
    },

    createMessageBubble: function (x, y, message) {
        // Cria um gráfico para desenhar o balão de mensagem
        const bubble = this.add.graphics();

        // Desenha o balão de mensagem (um retângulo branco com borda preta)
        bubble.fillStyle(0xffffff, 1); // Branco
        bubble.lineStyle(2, 0x000000, 1); // Preto
        bubble.fillRoundedRect(x - message.length * 10 - 10, y - 50, message.length * 20 + 20, 60, 10); // Ajustado para acomodar o texto
        bubble.strokeRoundedRect(x - message.length * 10 - 10, y - 50, message.length * 20 + 20, 60, 10); // Borda do balão

        // Adiciona o texto dentro do balão
        const textStyle = { font: '38px Arial', fill: '#404040', fontWeight: 'bold' }; // Texto cinza escuro e mais grosso
        const messageText = this.add.text(x, y - 30, message, textStyle); // Ajuste a posição do texto
        messageText.setOrigin(0.5);

        // Adiciona uma animação de desaparecimento para o balão e o texto
        this.tweens.add({
            targets: [bubble, messageText],
            alpha: 0,
            duration: 3000,
            ease: 'Power2',
            onComplete: function () {
                bubble.destroy();
                messageText.destroy();
            }
        });
    },



});
