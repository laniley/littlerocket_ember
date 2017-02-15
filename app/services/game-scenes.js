import Ember from 'ember';

export default Ember.Service.extend({
	scenes: {},
	stages: [],
	activeStage: 0,
	/**
     	Stages a scene.
		`num` is like a z-index. Higher numbered stages render on top of lower numbered stages!
	*/
	stageScene(scene, num, options) {
      	// If it's a string, find a registered scene by that name
      	if(this.HF.isString(scene)) {
        	scene = this.scene(scene);
      	}

      // If the user skipped the num arg and went straight to options,
      // swap the two and grab a default for num
      if(Q._isObject(num)) {
        options = num;
        num = Q._popProperty(options,"stage") || (scene && scene.opts.stage) || 0;
      }

      // Clone the options arg to prevent modification
      options = Q._clone(options);

      // Grab the stage class, pulling from options, the scene default, or use
      // the default stage
      var StageClass = (Q._popProperty(options,"stageClass")) ||
                       (scene && scene.opts.stageClass) || Q.Stage;

      // Figure out which stage to use
      num = Q._isUndefined(num) ? ((scene && scene.opts.stage) || 0) : num;

      // Clean up an existing stage if necessary
      if(Q.stages[num]) {
        Q.stages[num].destroy();
      }

      // Make this this the active stage and initialize the stage,
      // calling loadScene to popuplate the stage if we have a scene.
      Q.activeStage = num;
      var stage = Q.stages[num] = new StageClass(scene,options);

      // Load an assets object array
      if(stage.options.asset) {
        stage.loadAssets(stage.options.asset);
      }

      if(scene) {
        stage.loadScene();
      }
      Q.activeStage = 0;

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
	scene(name, sceneFunc, opts) {
      	if(sceneFunc === void 0) {
        	return this.get('scenes')[name];
      	}
		else {
        	if(this.HF.isFunction(sceneFunc)) {
          		sceneFunc = new Q.Scene(sceneFunc,opts);
          		sceneFunc.name = name;
        	}
        	this.get('scenes')[name] = sceneFunc;
        	return sceneFunc;
      	}
  	},
	/**
		Returns the default or currently active stage.
		If called from a sprites step() returns the stage that the sprite is member of
		If a number is passed in, this stages is returned
		*Warning* might return `undefined` if that stage doesnt exist!
	*/
	stage(num) {
		// Use activeStage is num is undefined
		num = (num === void 0) ? this.get('activeStage') : num;
		return Q.stages[num];
	}
});
