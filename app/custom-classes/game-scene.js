import Ember from 'ember';

const Scene = Ember.Object.extend({
	name: '',
	game: null,
	stage: null,
	assets: [],
	load: null
});

export default Scene;
