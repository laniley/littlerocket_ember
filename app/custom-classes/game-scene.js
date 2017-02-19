import Ember from 'ember';

const Scene = Ember.Object.extend({
	name: '',
	game: null,
	stages: [],
	assets: [],
	load: null
});

export default Scene;
