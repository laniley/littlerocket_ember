import Ember from 'ember';

const Scene = Ember.Object.extend({
	name: '',
	gameState: null,
	stage: [],
	layers: [],
	assets: [],
	// abstract function
	// gets defined in the game-scenes service
	load: null,

	game: Ember.computed('gameState.game', function() {
		return this.get('gameState').get('game');
	}),

	getLayer(num) {
		return this.get('layers')[num];
	},

	// collisionLayer(layer) {
	//   this._collisionLayers.push(layer);
	//   layer.collisionLayer = true;
	//   return this.insert(layer);
	// },
});

export default Scene;
