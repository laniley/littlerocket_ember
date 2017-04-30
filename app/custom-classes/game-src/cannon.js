import Ember from 'ember';
import Sprite2D from './../../custom-classes/game-framework/game-sprite-2d';

const Cannon = Sprite2D.extend({

	name: 'Cannon',
	type: 'sheet',
	assetName: 'cannon.png',
	controlType: 'step',

	tileW: 50,
	tileH: 140,

	x: Ember.computed('rocket.x', function() {
		return this.get('rocket.x');
	}),
	y: Ember.computed('game.gameState.height', function() {
		var canvasH = this.get('game.gameState.height');
		var paddingBottom = (canvasH / 100 * 5);
		return Math.floor(canvasH - this.get('tileH') - paddingBottom);
	}),

	// Relations
	game: Ember.computed('rocket.game', function() {
		return this.get('rocket.game');
	}),

	rocket: null,

	init() {
		this._super();
	}

});

export default Cannon;
