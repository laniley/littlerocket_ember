import Ember from 'ember';
import Sprite2D from './../game-framework/game-rendering-engine/game-sprite-2d';

const TrackObject = Sprite2D.extend({

	game: null,

	type: 'sheet',
	direction: 'down',

	speed: Ember.computed('game.gameState.speed', function() {
		return this.get('game.gameState.speed');
	}),

	x: Ember.computed('game.gameState.width', function() {
		return ((this.get('game.gameState.width') - 60) * Math.random()) + 30;
	}),
	y: 0,

	// when the asteroid leaves the screen, destroy it to prevent stack overflows
	positionObserver: Ember.observer('y', function() {
		if(this.get('y') > this.get('game.gameState.height')) {
			this.destroy();
		}
	}),

});

export default TrackObject;
