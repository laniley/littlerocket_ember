import Ember from 'ember';
import Game from './../../custom-classes/game';

export default Ember.Component.extend({

    gameState: Ember.inject.service('game-state'),
	gameScenes: Ember.inject.service('game-scenes'),

    elementId: 'game',
    tagName: 'canvas',

    attributeBindings: [
		'width',
		'height'
	],

	imagePath: "./assets/images/",
	audioPath: "./assets/audio/",

	assets: [
		"rocket.png",
		"cannon.png",
		"shield.png",
		"engine.png",
		"bullet.png",
		"decoration_stars.png",
		"star.png",
		"asteroid.png",
		"bigAsteroid.png",
		"explodingAsteroid.png",
		"ufo.png",
		"rocket.mp3",
		"collecting_a_star.mp3",
		"racing.mp3",
		"explosion.mp3"
	],

    init: function() {
        this._super();

		var game = Game.create({
			debug: true,
			debugFill: true,
			gameState: this.get('gameState'),
			scenes: this.get('gameScenes').get('scenes'),
			assets: this.get('assets'),
			imagePath: this.get('imagePath'),
			audioPath: this.get('audioPath')
		});

		this.get('gameState').set('game', game);
    },

    didInsertElement() {
        var ctx = this.get('element').getContext('2d');
        this.get('gameState').get('game').set('canvas', this);
        this.get('gameState').get('game').set('context', ctx);

        ctx.canvas.width  = Ember.$('#game-canvas-container').innerWidth();
        ctx.canvas.height = Ember.$('#game-canvas-container').innerHeight();

		this.get('gameState').set('width', ctx.canvas.width);
		this.get('gameState').set('height', ctx.canvas.height);

    	this.get('gameState').get('game').load();

        // Q.setup('game', {
        //     scaleToFit: true,
        //     maximize: "touch"
        // })
        // .controls()
        // .touch()
        // .enableSound();
        // // Add in the controls
        // Q.input.keyboardControls({
        //   	LEFT: "left",
        //   	RIGHT: "right",
        //   	UP: "up",
        //     DOWN: "down",
        //   	SPACE: "space",
        //     ENTER: "enter"
        // });
        //
        // Q.input.touchControls({
     //  	    controls: [
        //         ['left','<' ],
        //         [],
        //         ['up', '*'],
        //         [],
        //         ['right','>' ]
        //     ]
        // });
        //
        // Q.gravityX = 0;
        // Q.gravityY = 0;
        //
        // Q.SPRITE_ROCKET   = 1;
        // Q.SPRITE_STAR     = 2;
        // Q.SPRITE_ASTEROID = 4;
        // Q.SPRITE_BULLET	  = 16;
    },

});
