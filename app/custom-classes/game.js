import Ember from 'ember';
import HF from './../custom-classes/helper-functions';
import AssetLoader from './../custom-classes/game-asset-loader';
import GameMatrix2D from './../custom-classes/game-matrix-2d';
import GameAudio from './../custom-classes/game-audio';
import Stage from './../custom-classes/game-stage';

const Game = Ember.Object.extend({

	debug: false,
	debugFill: false,

	gameState: null,

	canvas: null,
	context: null,
	audio: null,

	loop: null,
	lastGameLoopFrame: null,
	loopFrame: 0,
	frameTimeLimit: 100,

	imagePath: '',
	audioPath: '',

	assets: [],
	assetLoader: null,
	spriteSheeds: {},

	scenes: {},
	activeScene: null,

	matrices2d: [],
	matrix2d: Ember.computed('matrices2d.length', function() {
		if( this.get('matrices2d').length > 0 ) {
			return this.get('matrices2d').pop().identity();
		}
		else {
			return GameMatrix2D.create();
		}
	}),

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
					this.stageScene("mainMenu");
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
		this.set('audio', GameAudio.create({}));
		this.set('nullContainer.matrix', this.get('matrix2d'));
	},

	load() {
		console.log('Loading Game...');
		this.get('assetLoader').loadAssets (
			this.get('assets')
		);
	},
	// Stages a scene.
	// `num` is like a z-index. Higher numbered stages render on top of lower numbered stages!
	stageScene(scene, num, options) {

		console.log('Staging scene \'' + scene + '\'..., num: ' + num + ', options: ' + options);

		scene = this.getScene(scene);

      	// If the user skipped the num arg and went straight to options,
      	// swap num and options and grab a default for num
      	if(HF.isObject(num)) {
        	options = num;
        	num = HF.popProperty(options, "stage") || (scene && scene.get('stage')) || 0;
      	}
      	// Clone the options arg to prevent modification
      	options = HF.clone(options);
      	// Figure out which stage to use
      	num = HF.isUndefined(num) ? ((scene && scene.get('stage')) || 0) : num;
      	// Clean up an existing stage if necessary
      	if(scene.get('stages')[num]) {
        	scene.get('stages')[num].destroy();
      	}
      	// Make this the active stage and initialize the stage,
      	// calling loadScene to popuplate the stage if we have a scene.
      	scene.set('activeStage', num);
		this.set('activeScene', scene);

      	var stage = scene.get('stages')[num] = Stage.create({
			scene: scene
		});

		scene.get('stages')[num] = stage;

		stage.load();
  	},
	/**
		Set up a new scene or return an existing scene. If you don't pass in `sceneFunc`, it'll return a scene otherwise it'll create a new one.
	*/
	getScene(name) {
      	if(this.get('scenes')[name]) {
        	return this.get('scenes')[name];
      	}
		else {
        	console.error('There is no scene with the name "' + name + '". Initialize it in the game-scenes service!');
      	}
  	},
	/**
		The callback will be called with the fraction of a second that has elapsed since the last call to the loop method.
    */
  	startGameLoop: Ember.observer('gameState.isPaused', function() {
		this.set('lastGameLoopFrame', new Date().getTime());

		// Short circuit the loop check in case multiple scenes are staged immediately
		this.set('loop', true);

		// Keep track of the frame we are on (so that animations can be synced to the next frame)
		this.set('loopFrame', 0);

		this.set('loop', window.requestAnimationFrame(() => {
			this.gameLoopCallback();
		}));
 	}),

	gameLoopCallback() {
		var now = new Date().getTime();
		this.set('loopFrame', this.get('loopFrame') + 1);
		var dt = now - this.get('lastGameLoopFrame');
		console.log(now, this.get('loopFrame'), dt);
		/* Prevent fast-forwarding by limiting the length of a single frame. */
		if(dt > this.get('frameTimeLimit')) {
			dt = this.get('frameTimeLimit');
		}
		this.set('lastGameLoopFrame', now);
		window.requestAnimationFrame(() => {
			this.gameLoopCallback();
		});
	},
	/**
  		Pause the entire game by canceling the requestAnimationFrame call. If you use setTimeout or
  		setInterval in your game, those will, of course, keep on rolling...
    */
    pause() {
  		if(!Ember.isEmpty(this.get('loop'))) {
  			window.cancelAnimationFrame(this.get('loop'));
  		}

  		this.set('loop', null);

  		this.get('gameState').set('isPaused', true);
    },

	rerender() {
		this.get('activeScene.stages').forEach(stage => {
			stage.render();
		});
	}
});

export default Game;
