import Ember from 'ember';
import AssetLoader from './game-asset-loader';
import GameMatrix2D from './game-matrix-2d';
import GameAudio from './game-audio';
import GameInputHandler from './game-input-handler';
import Stage from './game-rendering-engine/game-stage';

const Game = Ember.Object.extend({

	gameState: null,

	debug: false,
	debugFill: false,

	canvas: null,
	context: null,
	audio: null,

	loop: null,
	lastGameLoopFrame: null,
	loopFrame: 0,
	loopDT: 0, // time delta since last iteration of the game loop
	frameTimeLimit: 100,

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
	            //
	            // Q.debug = true;
	            // Q.debugFill = true;
			}
		}));

		this.set('stage', Stage.create({
			game: this
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

	/**
		The callback will be called with the fraction of a second that has elapsed since the last call to the loop method.
    */
  	gameLoopHandler: Ember.observer('gameState.isPaused', function() {
		/**
	  		Pause the entire game by canceling the requestAnimationFrame call. If you use setTimeout or
	  		setInterval in your game, those will, of course, keep on rolling...
	    */
		if(this.get('gameState.isPaused')) {

			window.cancelAnimationFrame(this.get('loop'));

	  		this.set('loop', null);
		}
		/*
			Unpause the game by starting a requestAnimationFrame-based loop.
		*/
		else {
			this.set('lastGameLoopFrame', new Date().getTime());

			// Short circuit the loop check in case multiple scenes are staged immediately
			this.set('loop', true);

			// Keep track of the frame we are on (so that animations can be synced to the next frame)
			this.set('loopFrame', 0);

			window.requestAnimationFrame(loop => {
				this.set('loop', loop);
				this.gameLoopCallback();
			});
		}
 	}),

	gameLoopCallback() {

		var now = new Date().getTime();

		this.set('loopFrame', this.get('loopFrame') + 1);

		var dt = now - this.get('lastGameLoopFrame');
		/* Prevent fast-forwarding by limiting the length of a single frame. */
		if(dt > this.get('frameTimeLimit')) {
			dt =  this.get('frameTimeLimit');
		}

		this.set('loopDT', dt);

		this.set('lastGameLoopFrame', now);

	    if(dt < 0) {
			dt = 1.0/60;
		}
	    if(dt > 1/15) {
			dt  = 1.0/15;
		}

		this.get('stage').step(dt);

		this.rerender();

		if(!this.get('gameState.isPaused')) {
			window.requestAnimationFrame(() => {
				this.gameLoopCallback();
			});
		}
	},

	rerender() {
		// clear the canvas before rendering the stages
		this.clear();
		this.get('stage').render();
	},
	/**
   		Clear the canvas completely.

   		If you want it cleared to a specific color - set `Q.clearColor` to that color
	*/
	clear() {
	   	if(this.get('clearColor')) {
			this.set('context.globalAlpha', 1);
			this.set('context.fillStyle', this.get('clearColor'));
			this.get('context').fillRect(0,0, this.get('gameState.width'), this.get('gameState.height'));
	   	}
		else {
			this.get('context').clearRect(0, 0, this.get('gameState.width'), this.get('gameState.height'));
	   	}
    }

});

export default Game;
