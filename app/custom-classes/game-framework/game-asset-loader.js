/**
  	Asset Loading Support

  	The engine supports loading assets of different types using `load` or `preload`. Assets are stored by their name so the same asset won't be loaded twice if it already exists.

	Augmentable list of asset types, loads a specific asset type if the file type matches, otherwise defaults to an Ajax load of the data.

  	You can add new types of assets by adding the file extension to `assetTypes` and a method called loadAssetTYPENAME where TYPENAME is the name of the type you added in.

  	Default bindings are:

	* png, jpg, gif, jpeg -> Image
	* ogg, wav, m4a, mp3 -> Audio
	* Everything else -> Data

  	To add a new file extension to an existing type you can just add it to asset types:

	   	assetTypes['bmp'] = "Video";

  	 	and add new loader, e.g.:

	   	loadAssetVideo(key, src) {
		   ...
	   	};
*/

import Ember from 'ember';
import ENV from  '../../config/environment';
import HF from './helper-functions';

const GameAssetLoader = Ember.Object.extend({

	game: null,

	assetTypes: {
	   png: 'Image', jpg: 'Image', gif: 'Image', jpeg: 'Image',
	   ogg: 'Audio', wav: 'Audio', m4a: 'Audio', mp3: 'Audio'
	},

	errors: false,

	amountOfAssetsTotal: 0,
	amountOfAssetsRemaining: 0,
	finalCallback: null,

	loadAssets(assets) {
		console.log('Loading Assets...');
  	    var assetObj = {};

        this.set('errors', false);

        /* Convert to an array if it's a string */
        if(HF.isString(assets)) {
	        assets = this.normalizeArg(assets);
        }

        /* If the user passed in an array, convert it */
        /* to a hash with lookups by filename */
        if(Ember.isArray(assets)) {
	        assets.forEach(itm => {
	            if(HF.isObject(itm)) {
	               	this.extend(assetObj, itm);
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
		this.set('amountOfAssetsTotal', HF.keys(assetObj).length);
  		this.set('amountOfAssetsRemaining', this.get('amountOfAssetsTotal'));

		var loadedAssets = this.get('game').get('assets');

        /* Now actually load each asset */
        HF.each(assetObj, ( asset , key ) => {
			/* If we already have the asset loaded, */
  			/* don't load it again */
  			if(loadedAssets[key]) {
				this.loadedCallback(key, loadedAssets[key], true);
  			}
			else {
				// load the current asset
				this.loadAsset(asset, key);
			}
		});
	},
	// load an asset using the matching asset loading function
	// depending on the asset-type
	loadAsset(asset, key) {
		/* Determine the type of the asset */
		var assetType = this.getAssetType(asset);
		/* Call the appropriate loader function */
		/* passing in our per-asset callback */
		/* Dropping our asset by name into assets */
		if(assetType === "Image") {
			this.loadAssetImage(key, asset);
		}
		else if(assetType === "WebAudio") {
			this.loadAssetWebAudio(key, asset);
		}
		else {
			console.log("ERROR: No loading function available for assetType \"" + assetType + "\"");
		}
	},
	// Asset loader for Images, creates a new `Image` object and uses the
	// load callback to determine that the image has been loaded
	loadAssetImage(key, src) {
		var img = new Image();
		img.onload = this.loadedCallback( key, img );
		// img.onerror = this.loadAssetImageErrorCallback( src );
		img.src = this.getAssetUrl(this.get('game').get('imagePath'), src);
	},

	loadAssetImageErrorCallback(asset) {
		this.set('errors', true);
		console.error("Error Loading: " + this.getAssetUrl(this.get('game').get('imagePath'), asset));
	},
	// Asset loader for Audio files if using the WebAudio API engine
	loadAssetWebAudio(key, src) {
		var request = new XMLHttpRequest();
  		var baseName = HF.removeExtension(src);
  		var extension = this.getAudioAssetExtension();

		request.open("GET", this.getAssetUrl(this.get('game').get('audioPath'), baseName + "." + extension), true);
		request.responseType = "arraybuffer";

  	 	// Our asynchronous callback
		request.onload = () => {
			var self = this;
			this.get('game.audio.audioContext').decodeAudioData(
				request.response,
				function(buffer) {
					self.loadedCallback(key, buffer);
				}
				// self.loadAssetWebAudioErrorCallback( src )
			);
		};
		request.send();
 	},

	loadAssetWebAudioErrorCallback(asset) {
		this.set('errors', true);
		console.error("Error Loading: " + this.getAssetUrl(this.get('game').get('audioPath'), asset));
	},
	/* gets called each time an asset is successfully loadded */
	loadedCallback(key, obj, force) {
		if(this.get('errors')) { return true; }
		// Prevent double callbacks (I'm looking at you Firefox, canplaythrough)
		if(!this.get('game').get('assets')[key] || force) {
			/* Add the object to our asset list */
			this.get('game').get('assets')[key] = obj;
			/* Update amount of remaining assets to be loaded */
			this.set('amountOfAssetsRemaining', this.get('amountOfAssetsRemaining') - 1);
			/* Update our progress if we have it */
			if(this.get('progressCallback')) {
				if(this.get('amountOfAssetsRemaining')) {
					console.log('[' + '-'.repeat(this.get('amountOfAssetsTotal') - this.get('amountOfAssetsRemaining')) + ' '.repeat(this.get('amountOfAssetsRemaining')) + ']');
				}
				else {
					console.log('All assets loaded!');
				}
				this.get('progressCallback')(this.get('amountOfAssetsTotal') - this.get('amountOfAssetsRemaining'), this.get('amountOfAssetsTotal'));
			}
		}

		/* If we're out of assets, call our success callback */
		/* if there is one */
		if(this.get('amountOfAssetsRemaining') === 0 && this.get('successCallback')) {
			/* if we haven't set up our canvas element yet, */
			/* assume we're using a canvas with id 'quintus' */
			this.get('finalCallback')();
		}
	},

	getAudioAssetExtension() {
	 	if(this.get('game.audio.preferredExtension')) {
			return this.get('game.audio.preferredExtension');
		}
		else {
			var snd = new Audio();

		 	/* Find a supported type */
			var extension = HF.detect(
				this.get('game.audio.supportedTypes'),
				function(extension) {
					return snd.canPlayType(this.get('game.audio.mimeTypes')[extension]) ? extension : null;
				}
			);
			this.get('game.audio').set('preferredExtension', extension);
		 	return extension;
		}
	},
	// Determine the type of an asset based on the `assetTypes` lookup table
	getAssetType(asset) {
		/* Determine the lowercase extension of the file */
		var fileExt = HF.fileExtension(asset);
		/* Use the web audio loader instead of the regular loader
		   if it's supported. */
		var fileType =  this.get('assetTypes')[fileExt];
		if(fileType === 'Audio' && this.get('game').get('audio').get('type') === "WebAudio") {
			fileType = 'WebAudio';
		}
		/* Lookup the asset in the assetTypes hash, or return other */
		return fileType || 'Other';
	},
	// Either return an absolute URL, or add a base to a relative URL
	getAssetUrl(base, url) {
		var timestamp = "";
		if(ENV.environment === 'development') {
			timestamp = (/\?/.test(url) ? "&" : "?") + "_t=" + new Date().getTime();
		}
		if(/^https?:\/\//.test(url) || url[0] === "/") {
			return url + timestamp;
		}
		else {
			return base + url + timestamp;
		}
	},
});

export default GameAssetLoader;
