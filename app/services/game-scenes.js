import Ember from 'ember';
import HF from './../custom-classes/helper-functions';
import Scene from './../custom-classes/game-scene';
import Stage from './../custom-classes/game-stage';

export default Ember.Service.extend({
	scenes: {},
	stages: [],
	activeStage: 0,
	// Stages a scene.
	// `num` is like a z-index. Higher numbered stages render on top of lower numbered stages!
	stageScene(scene, num, options) {
		console.log('Staging scene \'' + scene + '\'..., num: ' + num + ', options: ' + options);
      	// If it's a string, find a registered scene by that name
		// or create a new one
      	if(HF.isString(scene)) {
        	scene = this.getOrCreateScene(scene);
      	}
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
      	if(this.get('stages')[num]) {
        	this.get('stages')[num].destroy();
      	}
      	// Make this the active stage and initialize the stage,
      	// calling loadScene to popuplate the stage if we have a scene.
      	this.set('activeStage', num);

      	var stage = this.get('stages')[num] = Stage.create(scene, options);

      	// Load an assets object array
      	if(stage.get('assets').length > 0) {
        	stage.loadAssets(stage.get('assets'));
      	}

      	if(scene) {
        	stage.loadScene();
      	}

      	this.set('activeStage', 0);
      	// If there's no loop active, run the default stageGameLoop
      	if(!Q.loop) {
        	Q.gameLoop(Q.stageGameLoop);
      	}

      	// Finally return the stage to the user for use if needed
      	return stage;
  	},
	/**
		Set up a new scene or return an existing scene. If you don't pass in `sceneFunc`,
		it'll return a scene otherwise it'll create a new one.
	*/
	getOrCreateScene(name) {
      	if(this.get('scenes')[name]) {
        	return this.get('scenes')[name];
      	}
		else {
        	var scene = Scene.create({
				name: name
			});

			this.get('scenes')[name] = scene;

			return scene;
      	}
  	},
	/**
		Returns the default or currently active stage.
		If called from a sprites step() returns the stage that the sprite is member of
		If a number is passed in, this stages is returned
		*Warning* might return `undefined` if that stage doesnt exist!
	*/
	getStage(num) {
		// Use activeStage if num is undefined
		num = (num === void 0) ? this.get('activeStage') : num;
		return this.get('stages')[num];
	}
});
