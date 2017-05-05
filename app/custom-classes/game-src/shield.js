import Ember from 'ember';
import Sprite2D from './../game-framework/game-rendering-engine/game-sprite-2d';

const Shield = Sprite2D.extend({

	name: 'Shield',
	type: 'sheet',
	assetName: 'shield.png',

	// Relations
	game: Ember.computed('rocket.game', function() {
		return this.get('rocket.game');
	}),
	rocket: null,
	children: [],

	tileW: 50,
	tileH: 140,

	points: Ember.computed('tileW', 'tileH', function() {
		var halfW = this.get('tileW') / 2;
        var halfH = this.get('tileH') / 2;
		return [
			// links oben
			[-halfW, -halfH],
			// rechts oben
			[halfW, -halfH],
			// rechts unten
			[halfW, halfH],
			// links unten
			[-halfW, halfH],
		];
	}),

	x: Ember.computed('rocket.x', function() {
		return this.get('rocket.x') || 0;
	}),
	y: Ember.computed('game.gameState.height', function() {
		var canvasH = this.get('game.gameState.height');
		var paddingBottom = (canvasH / 100 * 5);
		return Math.floor(canvasH - this.get('tileH') - paddingBottom);
	}),

	init() {
		this._super();
	}

});

export default Shield;
