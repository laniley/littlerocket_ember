import Ember from 'ember';

export default Ember.Service.extend({

	gameState: Ember.inject.service('game-state'),

	canvas: null,
	context: null,

	assets: [],

	assetTypes: {
	   png: 'Image', jpg: 'Image', gif: 'Image', jpeg: 'Image',
	   ogg: 'Audio', wav: 'Audio', m4a: 'Audio', mp3: 'Audio'
   	},

	audio: {
		supportedTypes: [ 'mp3' ],
      	channels: [],
      	channelMax:  10,
      	active: {},
      	play: function() {}
  	},

	load() {
		console.log('Loading Game...');
		this.loadAssets (this.get('assets'), () => {
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

	loadAssets(assets, callback, options) {
		console.log('Loading Assets...');
  	    var assetObj = {};

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
	            if(Ember.typeOf(itm) === 'object') {
	               	this.extend(assetObj,itm);
                }
				else {
	               assetObj[itm] = itm;
	            }
	        });
        }
		/* Otherwise just use the assets as is */
		else {
	        assetObj = assets;
        }

		console.log(assetObj);

        /* Find the # of assets we're loading */
        var assetsTotal = this._keys(assetObj).length,
  		    assetsRemaining = assetsTotal;

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
        this._each(assetObj, (itm,key) => {
  			/* Determine the type of the asset */
  			var assetType = this._assetType(itm);
  			/* If we already have the asset loaded, */
  			/* don't load it again */
  			if(loadedAssets[key]) {
				loadedCallback(key, loadedAssets[key], true);
  			}
			/* Call the appropriate loader function */
			/* passing in our per-asset callback */
			/* Dropping our asset by name into assets */
			else {
				this["loadAsset" + assetType](
					key,
					itm,
					loadedCallback,
					function() { errorCallback(itm);
				);
			}
		});

	},

	loadAssetImage() {
		var func = function(key, src, callback, errorCallback) {
			var img = new Image();
			img.onload = function() {  callback(key,img); };
			img.onerror = errorCallback;
			// img.src = Q.assetUrl(Q.options.imagePath,src);
		};
		return func;
	},

	_has(obj, key) {
		return Object.prototype.hasOwnProperty.call(obj, key);
	},

	_keys(obj) {
		if(Ember.typeOf(obj) !== 'object') {
			throw new TypeError('Invalid object');
		}
		var keys = [];
		for (var key in obj) {
			if (this._has(obj, key)) {
				keys[keys.length] = key;
			}
		}
		return keys;
	},

	_each(obj,iterator,context) {
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

	_assetType(asset) {
		/* Determine the lowercase extension of the file */
		var fileExt = this._fileExtension(asset);
		/* Use the web audio loader instead of the regular loader
		   if it's supported. */
		var fileType =  this.get('assetTypes')[fileExt];
		/* Lookup the asset in the assetTypes hash, or return other */
		return fileType || 'Other';
	},

	_fileExtension(filename) {
	   var fileParts = filename.split("."),
			fileExt = fileParts[fileParts.length-1].toLowerCase();
	   return fileExt;
   	},

});
