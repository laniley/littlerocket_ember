import Ember from 'ember';

const Scene = Ember.Object.extend({
	name: '',
	gameState: null,
	stages: [],
	assets: [],
	activeStage: 0,
	load: null,

	game: Ember.computed('gameState.game', function() {
		return this.get('gameState').get('game');
	}),
	/**
		clears all stages
	*/
	clear() {

	},
	/**
		Returns the default or currently active stage.
		If called from a sprites step() returns the stage that the sprite is member of
		If a number is passed in, this stages is returned
		*Warning* might return `undefined` if that stage doesnt exist!
	*/
	getStage(num) {
		// Use activeStage if num is undefined
		num = (num === void 0) ? this.get('activeStage') : num;
		return this.get('stages')[num];
	},
});

export default Scene;
