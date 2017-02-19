import Ember from 'ember';
import Sprite from './../custom-classes/game-sprite';

const Rocket = Sprite.extend({

	name: 'Rocket',
	type: 'sprite',
	assetName: 'rocket.png',

	// tileW: 50,
	// tileH: 140,

	x: Ember.computed('game.gameState.height', () => {
		return this.get('game.gameState.width') / 2;
	}),
	y: Ember.computed('game.gameState.height', () => {
		return this.get('game.gameState.height') / 6 * 5;
	})
});

export default Rocket;
