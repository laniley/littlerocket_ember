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
        	this.get('scene').load(this);
      	}
    },

	/**
     	inserts an item into the scene, or inside a container
    */
    insert: function(itm, container) {
      	this.get('items').push(itm);
    //   	itm.stage = this;
    //   	itm.container = container;
    //   	if(container) {
    //     		container.children.push(itm);
    //   	}
	 //
    //   	itm.grid = {};
	 //
      	// Make sure we have a square of collision points
      	itm.generateCollisionPoints();
	 //
    //   	if(itm.className) {
	// 		this.addToList(itm.className, itm);
	// 	}
    //   	if(itm.activeComponents) {
	// 		this.addToLists(itm.activeComponents, itm);
	// 	}
	 //
    //   	if(itm.p) {
    //     	this.index[itm.p.id] = itm;
    //   	}
    //  //  	this.trigger('inserted',itm);
    //  //  	itm.trigger('inserted',this);
	 //
    //  //  	this.regrid(itm);
    //   	return itm;
		itm.render();
    },
	render() {
		this.get('items').forEach(itm => {
			itm.render();
		});
	},
	clear() {
		this.get('items').forEach(itm => {
			itm.destroy();
		});
	}
});

export default Stage;
