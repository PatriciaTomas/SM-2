var Loading = new Phaser.Class({
    Extends: Phaser.Scene,

    initialize: function Loading() {
        Phaser.Scene.call(this, { key: 'Loading' });
    },

    preload: function() {
        // Load assets
        this.load.image('tiles', 'Assets/Sprites/spritesheet.png');
        this.load.image('timer', 'Assets/PNG/Items/timer.png');
        this.load.image('backgroundDesert', 'Assets/PNG/Background/colored_desert.png');
        this.load.image('backgroundGrass', 'Assets/PNG/Background/colored_grass.png');
        this.load.image('garbage', 'Assets/PNG/Items/drinkGarbage.png');
        this.load.image('water', 'Assets/PNG/Items/BottleWater.png');
        this.load.image('YflagDown', 'Assets/PNG/Items/flagYellow_down.png');
        this.load.image('GflagDown', 'Assets/PNG/Items/flagGreen_down.png');
        this.load.tilemapTiledJSON('map', 'Assets/Map/mapaTeste7.json');
        this.load.atlas('player', 'Assets/Sprites/PlayerSprite.png', 'Assets/Sprites/PlayerSprite.json');
        this.load.atlas('fly', 'Assets/Sprites/FlySprite.png', 'Assets/Sprites/FlySprite.json');
        this.load.atlas('tornado', 'Assets/Sprites/TornadoSprite.png', 'Assets/Sprites/TornadoSprite.json');
        this.load.image('heart-full', 'Assets/PNG/Items/Heart_full.png');
        this.load.image('heart-empty', 'Assets/PNG/Items/Heart_empty.png');
        this.load.image('spike', 'Assets/PNG/Items/spikes.png');
        this.load.atlas('bomb', 'Assets/Sprites/bombSprite.png', 'Assets/Sprites/bombSprite.json');
        this.load.atlas('explosion', 'Assets/Sprites/explosionSprite.png', 'Assets/Sprites/explosionSprite.json');
        this.load.atlas('box', 'Assets/Sprites/boxSprite.png', 'Assets/Sprites/boxSprite.json');
        this.load.atlas('Yflag', 'Assets/Sprites/yellowFlagSprite.png', 'Assets/Sprites/yellowFlagSprite.json');
        this.load.atlas('Gflag', 'Assets/Sprites/greenFlagSprite.png', 'Assets/Sprites/greenFlagSprite.json');
        this.load.audio('gameOverSound', 'Assets/Audio/game_over.mp3'); // Carregue o som de Game Over
        this.load.audio('tornadoSound', 'Assets/Audio/wind.mp3'); // Carregue o som de Game Over
        this.load.audio('victorySound', 'Assets/Audio/Victory.mp3'); // Carregue o som de Game Over
        this.load.audio('explosionSound2', 'Assets/Audio/explosion2.mp3');
        this.load.audio('explosionSound', 'Assets/Audio/explosion.wav'); // Carregue o som de Game Over
        this.load.audio('flySound', 'Assets/Audio/fly.wav'); // Carregue o som de Game Over
        this.load.audio('popSound', 'Assets/Audio/pop.wav'); // Carregue o som de Game Over
        this.load.audio('songSound', 'Assets/Audio/song.ogg'); // Carregue o som de Game Over
        this.load.audio('fuseSound', 'Assets/Audio/fuse.ogg'); // Carregue o som de Game Over

    },

    create: function() {
        this.scene.start('Game');
    }
});
