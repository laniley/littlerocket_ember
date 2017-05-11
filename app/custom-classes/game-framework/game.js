import Ember from 'ember';
import AssetLoader from './game-asset-loader';
import GameMatrix2D from './game-matrix-2d';
import GameAudio from './game-audio';
import GameInputHandler from './game-input-handler';

const Game = Ember.Object.extend({

	gameState: null,
	gameCanvas: null,
	gameLoop: null,

	debug: false,
	debugFill: false,

	audio: null,

	imagePath: '',
	audioPath: '',

	assets: [],
	assetLoader: null,
	spriteSheeds: {},

	stage: null,

	matrices2d: [],
	matrix2d: Ember.computed('matrices2d.length', function() {
		if( this.get('matrices2d').length > 0 ) {
			return this.get('matrices2d').pop().identity();
		}
		else {
			return GameMatrix2D.create();
		}
	}),

	gameInputHandler: null,
	inputMethodSettings: {
		keyboardEnabled: true
	},

	nullContainer: {
      	cPoints: {
        	x: 0,
        	y: 0,
        	angle: 0,
        	scale: 1
      	},
      	matrix: null
  	},

	init() {

		this.set('assetLoader', AssetLoader.create({
			game: this,
			progressCallback: (loaded, total) => {

				var element = document.getElementById("loading_progress");

				if(element) {
					element.style.width = Math.floor(loaded/total*100) + "%";
				}

				if(loaded/total === 1) {
					this.get('gameState').set('isLoading', false);
					this.get('gameState').set('currentScene', 'mainMenu');
				}
			},
			finalCallback: () => {
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
			}
		}));

		this.set('audio', GameAudio.create({}));

		this.set('nullContainer.matrix', this.get('matrix2d'));

		this.set('gameInputHandler', GameInputHandler.create({
			game: this,
			inputMethodSettings: this.get('inputMethodSettings')
		}));
	},

	load() {
		console.log('Loading Game...');
		this.get('assetLoader').loadAssets (
			this.get('assets')
		);
	},

	rerender() {
		this.get('gameCanvas').render();
	},
});

export default Game;
