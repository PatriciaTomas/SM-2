var config = {
    type: Phaser.CANVAS,
    parent: 'conteudo', // ID do elemento HTML onde o jogo será renderizado
    width:  1000 ,  // Largura baseada na largura da tela
    height:  600,// Altura baseada na altura da tela
    pixelArt: true,
    physics: {
		default: 'matter',
		matter: {
			debug: true
		}
	},
    scene: [Loading, Game,UI, GameOver,Victory]
};

// Criação do jogo com a configuração dinâmica
var game = new Phaser.Game(config);

