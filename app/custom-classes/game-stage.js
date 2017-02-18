import Ember from 'ember';
import HF from './../custom-classes/helper-functions';
import Game from './../custom-classes/game';

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

	init(scene, opts) {
		this._super();
      	this.set('scene', scene);

     //  	this.defaults['w'] = Q.width;
     //  	this.defaults['h'] = Q.height;
		//
     //  	this.options = Q._extend({},this.defaults);
     //  	if(this.scene)  {
        // 	Q._extend(this.options,scene.opts);
     //  	}
     //  	if(opts) { Q._extend(this.options,opts); }
		//
		//
     //  	if(this.options.sort && !Q._isFunction(this.options.sort)) {
        //   	this.options.sort = function(a,b) { return ((a.p && a.p.z) || -1) - ((b.p && b.p.z) || -1); };
     //  	}
    },
	/**
      	Load an array of assets of the form:

          [ [ "Player", { x: 15, y: 54 } ],
            [ "Enemy",  { x: 54, y: 42 } ] ]

      	Either pass in the array or a string of asset name
    */
    loadAssets(asset) {
		console.log('Loading assets of stage...');
      var assetArray = HF.isArray(asset) ? asset : Game.asset(asset);
      for(var i=0;i<assetArray.length;i++) {
        var spriteClass = assetArray[i][0];
        var spriteProps = assetArray[i][1];
        this.insert(new Q[spriteClass](spriteProps));
      }
    },
	// Needs to be separated out so the current stage can be set
    loadScene() {
		console.log('Loading scene...');
      	if(this.get('scene'))  {
        	this.get('scene').sceneFunc(this);
      	}
    },
});

export default Stage;
