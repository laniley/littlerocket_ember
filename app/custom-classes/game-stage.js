import Ember from 'ember';
import HF from './../custom-classes/helper-functions';

const Stage = Ember.Object.extend({

	scene: null,
	assets: [],
	items: [],
	lists: {},
	index: {},
	removeList: [],
	grid: {},
	collisionLayers: [],
	sort: false,
    gridW: 400,
    gridH: 400,
    x: 0,
    y: 0,
	time: 0,

	// Needs to be separated out so the current stage can be set
    load() {
      	if(this.get('scene'))  {
			console.log('Loading scene "' + this.get('scene').name + '"...');
        	this.get('scene').load();
      	}
    },

});

export default Stage;
