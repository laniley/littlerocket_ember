import Ember from 'ember';
import HF from './../custom-classes/helper-functions';

export default Ember.Service.extend({

	gameState: Ember.inject.service('game-state'),
	gameScenes: Ember.inject.service('game-scenes'),
	gameAudio: Ember.inject.service('game-audio'),

	canvas: null,
	context: null,

	imagePath: '',
	audioPath: '',

	assets: [],

	assetTypes: {
	   png: 'Image', jpg: 'Image', gif: 'Image', jpeg: 'Image',
	   ogg: 'Audio', wav: 'Audio', m4a: 'Audio', mp3: 'Audio'
   	},

	load() {
		console.log('Loading Game...');
		this.loadAssets (
			// assets
			this.get('assets'),
			// callback
			() => {
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
        	},
			// options
			{
	            progressCallback: (loaded,total) => {

	                var element = document.getElementById("loading_progress");

	                if(element) {
	                    element.style.width = Math.floor(loaded/total*100) + "%";
	                }

	                if(loaded/total === 1) {
	                    this.get('gameState').set('isLoading', false);
	                    this.get('gameScenes').stageScene("mainMenu");
	                }
	            }
        	}
		);
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
					if(assetsRemaining) {
						console.log('[' + '-'.repeat(assetsTotal - assetsRemaining) + ' '.repeat(assetsRemaining) + ']');
					}
					else {
						console.log('All assets loaded!');
					}
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
				if(this.get("loadAsset" + assetType)) {

					this.get("loadAsset" + assetType)(
						this,
						key,
						itm,
						loadedCallback,
						() => { errorCallback(itm); }
					);
				}
				else {
					console.log("ERROR: No loading function available for assetType \"" + assetType + "\"");
				}
			}
		});
	},
	// Loader for Images, creates a new `Image` object and uses the
	// load callback to determine that the image has been loaded
	loadAssetImage(self, key, src, callback, errorCallback) {
		var img = new Image();
		img.onload = function() {  callback(key,img); };
		img.onerror = errorCallback;
		img.src = HF.assetUrl(self, self.get('imagePath'), src);
	},
	//Asset loader for Audio files if using the WebAudio API engine
	loadAssetWebAudio(self, key, src, callback, errorCallback) {
		var request = new XMLHttpRequest(),
  		  	baseName = HF.removeExtension(src),
  		  	extension = self._audioAssetExtension(self);

		request.open("GET", HF.assetUrl(self, self.get('audioPath'), baseName + "." + extension), true);
		request.responseType = "arraybuffer";

  	 	// Our asynchronous callback
		request.onload = function() {
			self.get('gameAudio').get('audioContext').decodeAudioData(
				request.response,
				function(buffer) {
					callback(key,buffer);
				},
				errorCallback
			);
		};
		request.send();
 	},

	_keys(obj) {
		if(Ember.typeOf(obj) !== 'object') {
			throw new TypeError('Invalid object');
		}
		var keys = [];
		for (var key in obj) {
			if (HF.has(obj, key)) {
				keys[keys.length] = key;
			}
		}
		return keys;
	},

	_each(obj, iterator, context) {
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

	// Basic detection method, returns the first instance where the
	// iterator returns truthy.
	_detect(obj, iterator, context, arg1, arg2) {
		var result;
		if (obj == null) { return; }
		if (obj.length === +obj.length) {
			for (var i = 0, l = obj.length; i < l; i++) {
				result = iterator.call(context, obj[i], i, arg1,arg2);
				if(result) { return result; }
			}
			return false;
		} else {
			for (var key in obj) {
				result = iterator.call(context, obj[key], key, arg1,arg2);
				if(result) { return result; }
			}
			return false;
		}
	},
	// Determine the type of asset based on the `assetTypes` lookup table
	_assetType(asset) {
		/* Determine the lowercase extension of the file */
		var fileExt = HF.fileExtension(asset);
		/* Use the web audio loader instead of the regular loader
		   if it's supported. */
		var fileType =  this.get('assetTypes')[fileExt];
		if(fileType === 'Audio' && this.get('gameAudio').get('settings.type') === "WebAudio") {
   			fileType = 'WebAudio';
		}
		/* Lookup the asset in the assetTypes hash, or return other */
		return fileType || 'Other';
	},

	_audioAssetExtension(self) {
	 	if(self.get('gameAudio').get('settings.audioAssetPreferredExtension')) {
			return self.get('gameAudio').get('settings.audioAssetPreferredExtension');
		}
		else {
			var snd = new Audio();

		 	/* Find a supported type */
			var extension = self._detect(
				self.get('gameAudio').get('settings.supportedTypes'),
				function(extension) {
					return snd.canPlayType(self.get('gameAudio').get('mimeTypes')[extension]) ? extension : null;
				}
			);
			self.get('gameAudio').get('settings.audioAssetPreferredExtension', extension);
		 	return extension;
		}
	},
});
