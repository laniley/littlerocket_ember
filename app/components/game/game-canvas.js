import Ember from 'ember';
import Game from './../../custom-classes/game-framework/game';


export default Ember.Component.extend({

    gameState: Ember.inject.service('game-state'),
	gameScenes: Ember.inject.service('game-scenes-service'),

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
			audioPath: this.get('audioPath'),
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
    },

});
