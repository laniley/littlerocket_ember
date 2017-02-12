/* global Quintus */
import Ember from 'ember';
// import RocketMixin from './../../mixins/rocket-mixin';

export default Ember.Component.extend(/*RocketMixin,*/ {

    gameState: Ember.inject.service('game-state'),

    elementId: 'game',
    tagName: 'canvas',

    attributeBindings: [
		'width',
		'height'
	],

	assets: [
		"rocket.png",
		"cannon.png",
		"shield.png",
		"engine.png",
		"bullet.png",
		"decoration_stars.png",
		"star.png",
		"asteroid.png",
		"bigAsteroid.png",
		"explodingAsteroid.png",
		"ufo.png",
		"rocket.mp3",
		"collecting_a_star.mp3",
		"racing.mp3",
		"explosion.mp3"
	],

	assetTypes: {
	   png: 'Image', jpg: 'Image', gif: 'Image', jpeg: 'Image',
	   ogg: 'Audio', wav: 'Audio', m4a: 'Audio', mp3: 'Audio'
   	},

    init: function() {
        this._super();

        // var Q = window.Q = new Quintus({
        //     development: false,
        //     audioSupported: [ 'mp3' ],
        //     imagePath: "./assets/images/",
        //     audioPath: "./assets/audio/",
        //     dataPath: "./assets/data/"
        // })
        // .include("Sprites, Anim, Input, Scenes, 2D, Touch, UI, Audio");
        //
        // this.set('Q', Q);
    },

    didInsertElement() {
        var ctx = this.get('element').getContext('2d');
        this.get('gameState').set('canvas', this);
        this.get('gameState').set('context', ctx);

        ctx.canvas.width  = Ember.$('#game-canvas-container').innerWidth();
        ctx.canvas.height = Ember.$('#game-canvas-container').innerHeight();

        this.loadAssets();

        // this.draw();

        // var Q = this.get('Q');
        // var self = this;
        // Q.setup('game', {
        //     scaleToFit: true,
        //     maximize: "touch"
        // })
        // .controls()
        // .touch()
        // .enableSound();
        // // Add in the controls
        // Q.input.keyboardControls({
        //   	LEFT: "left",
        //   	RIGHT: "right",
        //   	UP: "up",
        //     DOWN: "down",
        //   	SPACE: "space",
        //     ENTER: "enter"
        // });
        //
        // Q.input.touchControls({
     //  	    controls: [
        //         ['left','<' ],
        //         [],
        //         ['up', '*'],
        //         [],
        //         ['right','>' ]
        //     ]
        // });
        //
        // Q.gravityX = 0;
        // Q.gravityY = 0;
        //
        // Q.SPRITE_ROCKET   = 1;
        // Q.SPRITE_STAR     = 2;
        // Q.SPRITE_ASTEROID = 4;
        // Q.SPRITE_BULLET	  = 16;

        // var rocket_y  = Q.height/6 * 5;
        //
        // if(Q.touchDevice) {
        //     Q.state.set('scale', 2.5);
        //     rocket_y -= 100;
        // }

        // this.initRocket();

        // Q.scene("mainMenu", function(stage) {
        //
        //     Q.pauseGame();
        //     Q.audio.stop('rocket.mp3');
        //     Q.audio.stop('racing.mp3');

            // self.set('showHud', true);

            // self.get('gameState').resetRocketComponents();

            // var rocket = new Q.Rocket({ stage: stage });
            // stage.insert(rocket);

            // if(!Ember.isEmpty(self.get('rocket').get('cannon'))) {
            //     var cannon = new Q.Cannon();
            //     cannon.setRocket(rocket);
            //     rocket.setCannon(cannon);
    		//     stage.insert(cannon);
            // }
            // if(!Ember.isEmpty(self.get('rocket').get('shield'))) {
            //     var shield = new Q.Shield();
            //     shield.setRocket(rocket);
            //     rocket.setShield(shield);
            //     stage.insert(shield);
            // }
            // if(!Ember.isEmpty(self.get('rocket').get('engine'))) {
            //     var engine = new Q.Engine();
            //     engine.setRocket(rocket);
            //     rocket.setShield(engine);
            //     stage.insert(engine);
            // }
            // var decoration = new Q.Decoration();
            // decoration.setRocket(rocket);
            // rocket.setDecoration(decoration);
            // rocket.p.stage.insert(decoration);
  	  //   });


    },
    loadAssets() {
        console.log('Loading Assets...');

        this.load (this.get('assets'), () => {
            // Q.sheet("rocket", "rocket.png", { tileW: 50, tileH: 140 });
            // Q.sheet("cannon", "cannon.png", { tileW: 50, tileH: 140 });
            // Q.sheet("shield", "shield.png", { tileW: 50, tileH: 140 });
            // Q.sheet("engine", "engine.png", { tileW: 50, tileH: 140 });
            // Q.sheet("decoration", "decoration_stars.png", { tileW: 50, tileH: 140 });
            // Q.sheet("bullet","bullet.png", { tileW: 20, tileH: 20 });
            // Q.sheet("star","star.png", { tileW: 60, tileH: 60 });
            // Q.sheet("asteroid","asteroid.png", { tileW: 70, tileH: 70 });
            // Q.sheet("bigAsteroid","bigAsteroid.png", { tileW: 100, tileH: 100 });
            // Q.sheet("explodingAsteroid","explodingAsteroid.png", { tileW: 200, tileH: 200 });
            // Q.sheet("ufo","ufo.png", { tileW: 72, tileH: 40 });

            // Q.animations('rocket', {
            //   explosion: { frames: [1,2,3,4,5], rate: 1/15, loop: false, trigger: "exploded" }
            // });

            // Q.animations('cannon', {
            //   reloading: { frames: [0], rate: 1/1, loop: false },
            //   reloaded: { frames: [1], rate: 1/1, loop: false }
            // });

            // Q.animations('shield', {
            //   reloading: { frames: [0], rate: 1/1, loop: false },
            //   reloaded: { frames: [1], rate: 1/1, loop: false }
            // });

            // Q.animations('engine', {
            //   reloading: { frames: [0], rate: 1/1, loop: false },
            //   reloaded: { frames: [1], rate: 1/1, loop: false }
            // });

            // Q.animations('explodingAsteroid', {
            //   // flying: { frames: [0], loop: false },
            //   explosion: { frames: [0,1,2], rate: 1/15, loop: false, trigger: "exploded" }
            // });
            //
            // Q.debug = true;
            // Q.debugFill = true;
        }, {
            progressCallback: function(loaded,total) {

                var element = document.getElementById("loading_progress");

                if(element) {
                    element.style.width = Math.floor(loaded/total*100) + "%";
                }

                if(loaded/total === 1) {
                    this.get('gameState').set('isLoading', false);
                    this.stageScene("mainMenu");
                }
            }
        });
    },

    load(assets,callback,options) {
  	    var assetObj = {};
			assetObj.assets = [];
			assetObj.keys = Object.keys || function(obj)
			{
				if(Q._isObject(obj)) { throw new TypeError('Invalid object'); }
				var keys = [];
				for (var key in obj) { if (Q._has(obj, key)) { keys[keys.length] = key; } }
				return keys;
			};

        /* Make sure we have an options hash to work with */
        if(!options) { options = {}; }

        /* Get our progressCallback if we have one */
        var progressCallback = options.progressCallback;

        var errors = false,
        	errorCallback = function(itm) {
            	errors = true;
            	(options.errorCallback || function(itm) { throw("Error Loading: " + itm ); })(itm);
        	};

        /* Convert to an array if it's a string */
        if(Ember.typeOf(assets) === 'string') {
	        assets = this.normalizeArg(assets);
        }

		console.log(assets);

        /* If the user passed in an array, convert it */
        /* to a hash with lookups by filename */
        if(Ember.isArray(assets)) {
	        assets.forEach(itm => {
				assetObj.keys[itm] = itm;
	            if(Ember.typeOf(itm) === 'object') {
	               	this.extend(assetObj.assets,itm);
                }
				else {
	               assetObj.assets[itm] = itm;
	            }
	        });
        }
		/* Otherwise just use the assets as is */
		else {
	        assetObj.assets = assets;
        }

		console.log(assetObj.assets);

        /* Find the # of assets we're loading */
        var assetsTotal = assetObj.assets.length,
  		    assetsRemaining = assetsTotal;

		console.log(assetsTotal);

		var loadedAssets = [];

        /* Closure'd per-asset callback gets called */
        /* each time an asset is successfully loadded */
        var loadedCallback = function(key,obj,force) {
	        if(errors) { return; }

	        // Prevent double callbacks (I'm looking at you Firefox, canplaythrough

	        if(!loadedAssets[key]||force) {

	            /* Add the object to our asset list */
	           loadedAssets[key] = obj;

	            /* We've got one less asset to load */
	            assetsRemaining--;

	            /* Update our progress if we have it */
	            if(progressCallback) {
	               progressCallback(assetsTotal - assetsRemaining, assetsTotal);
	            }
	        }

	        /* If we're out of assets, call our full callback */
            /* if there is one */
	        if(assetsRemaining === 0 && callback) {
	            /* if we haven't set up our canvas element yet, */
	            /* assume we're using a canvas with id 'quintus' */
	            callback();
	        }
        };

        /* Now actually load each asset */
        this.each(assetObj.assets, (itm,key) => {
  			/* Determine the type of the asset */
			console.log(itm,key);
  			var assetType = this.assetType(itm);
console.log(assetType);
  			/* If we already have the asset loaded, */
  			/* don't load it again */
  	// 		if(loadedAssets[key]) {
			// 	loadedCallback(key, loadedAssets[key], true);
  	// 		}
			// else {
			// 	/* Call the appropriate loader function */
			// 	/* passing in our per-asset callback */
			// 	/* Dropping our asset by name into Q.assets */
			// 	if(assetType === 'Image') {
			// 		this.loadAssetImage(key,itm,loadedCallback,function() { errorCallback(itm); } );
			// 	}
			// }
		});

	},

	loadAssetImage(key,src,callback,errorCallback) {
		var img = new Image();
		img.onload = function() {  callback(key,img); };
		img.onerror = errorCallback;
		img.src = Q.assetUrl(Q.options.imagePath,src);
	},

	assetType(asset) {
		/* Determine the lowercase extension of the file */
		// console.log(asset);
		// var fileExt = this.fileExtension(asset);

		// Use the web audio loader instead of the regular loader
		// if it's supported.
		// var fileType =  this.assetTypes[fileExt];
		// if(fileType === 'Audio' && Q.audio && Q.audio.type === "WebAudio") {
		// 	fileType = 'WebAudio';
		// }
		//
		// /* Lookup the asset in the assetTypes hash, or return other */
		// return fileType || 'Other';
    },

	fileExtension(filename) {
	   var fileParts = filename.split("."),
			fileExt = fileParts[fileParts.length-1].toLowerCase();
	   return fileExt;
   	},

	each(obj,iterator,context) {
		if (obj == null) { return; }
		if (obj.forEach) {
			obj.forEach(iterator,context);
		} else if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				iterator.call(context, obj[i], i, obj);
			}
		} else {
			for (var key in obj) {
				iterator.call(context, obj[key], key, obj);
			}
		}
	},

	normalizeArg(arg) {
        if(Ember.typeOf(arg) === 'string') {
            arg = arg.replace(/\s+/g,'').split(",");
        }
        if(!Ember.isArray(arg)) {
            arg = [ arg ];
        }
        return arg;
    },

	extend(dest,source) {
		if(!source) { return dest; }
		for (var prop in source) {
		 dest[prop] = source[prop];
		}
		return dest;
	},

    // stageScene(scene) {
    //     console.log('Staging scene "' + scene + '" ...');
    //     this.get('gameState').set('currentScene', scene);
    //     this.get('Q').stageScene(scene);
    // },
    draw() {
        // var ctx = this.get('element').getContext('2d');
        // var image = new Image();
        //     image.onload = function () {
        //         ctx.drawImage(image, 0, 0);
        //     };
        // image.src = "assets/images/rocket.png";
    },

});
