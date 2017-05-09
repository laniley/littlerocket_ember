import Ember from 'ember';

export default Ember.Component.extend({

    me: Ember.inject.service('me'),
    gameState: Ember.inject.service('game-state-service'),

    elementId: 'game-canvas-container',
    classNames: ['game-canvas-container'],


    isLoading: Ember.computed('gameState.isLoading', function() {
        return this.get('gameState.isLoading');
    }),

	showHud: Ember.computed('gameState.showHud', function() {
        return this.get('gameState.showHud');
    }),

	showMenu: Ember.computed('gameState.showMenu', function() {
        return this.get('gameState.showMenu');
    }),

	showPauseMenu: Ember.computed('gameState.showPauseMenu', function() {
        return this.get('gameState.showPauseMenu');
    }),

	currentScene: Ember.computed('gameState.currentScene', function() {
        return this.get('gameState.currentScene');
    }),

	init() {
		this._super();
	},

    didInsertElement() {

    //     Q.GameObject.extend("BigAsteroidMaker", {
    // 	init: function() {
    // 		this.p = {
    // 			launchDelay: 1.2 * Q.state.get('scale') - (self.get('gameState').get('speed') / self.get('gameState').get('max_speed')),
    // 			launchRandomFactor: 1,
    // 			launch: 1
    // 		};
    // 	},
    //
    // 	update: function(dt) {
    // 		this.p.launch -= dt;
    // 		if(!Q.state.get('isPaused') && this.p.isActive && this.p.launch < 0) {
    // 			this.stage.insert(new Q.BigAsteroid());
    // 			this.p.launch = this.p.launchDelay + this.p.launchRandomFactor * Math.random();
    // 		}
    // 	}
    // });

        // Q.GameObject.extend("FastAsteroidMaker", {
    	// init: function() {
    	// 	this.p = {
    	// 		launchDelay: 1.2 * Q.state.get('scale') - (self.get('gameState').get('speed') / self.get('gameState').get('max_speed')),
    	// 		launchRandomFactor: 1,
    	// 		launch: 1
    	// 	};
    	// },

    // 	update: function(dt) {
    // 		this.p.launch -= dt;
    //
    // 		if(!Q.state.get('isPaused') && this.p.isActive && this.p.launch < 0) {
    // 			this.stage.insert(new Q.FastAsteroid());
    // 			this.p.launch = this.p.launchDelay + this.p.launchRandomFactor * Math.random();
    // 		}
    // 	}
    // });

    //     Q.GameObject.extend("ExplodingAsteroidMaker", {
    // 	init: function() {
    // 		this.p = {
    // 			launchDelay: 2 * Q.state.get('scale') - (self.get('gameState').get('speed') / self.get('gameState').get('max_speed')),
    // 			launchRandom: 1,
    // 			launch: 2
    // 		};
    // 	},
    //
    // 	update: function(dt) {
    // 		this.p.launch -= dt;
    //
    // 		if(!Q.state.get('isPaused') && this.p.isActive && this.p.launch < 0) {
    // 			this.stage.insert(new Q.ExplodingAsteroid( {size : 50} ));
    // 			this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    // 		}
    // 	}
    // });


    //
    //     Q.scene("level", stage => {
    //         self.set('currentScene', 'level');
    //         self.set('showHud', true);
    //         self.get('gameState').set('new_stage_reached', false);
    //
    //         self.resetRocketComponents();
    //
 //  		    Q.unpauseGame();
    //
    //         Q.audio.play('racing.mp3', { loop: true });
 //  		    Q.audio.play('rocket.mp3', { loop: true });
    //
    //         self.get('gameState').set('flown_distance', 0);
 //  		    self.get('gameState').set('stars', 0);
    //
    //         self.get('gameState').set('speed', 300);
    //
 //  		    stage.insert(new Q.StarMaker());
    //
    //         var rocket = new Q.Rocket({ stage: stage });
    //         stage.insert(rocket);
    //
    //
    //         var decoration = new Q.Decoration();
    //             decoration.setRocket(rocket);
    //             rocket.setDecoration(decoration);
    //             rocket.p.stage.insert(decoration);
    //
    //         self.setupLevel(this.get('gameState').get('level'));
    //
    //         // inputs
    //         Q.input.on("space", this, function() {
	// 	  		if(Q.loop)
	// 	  		{
	// 	  			Q.pauseGame();
	// 	  		}
	// 	  		else if(!Q.loop)
	// 	  		{
	// 	  			Q.unpauseGame();
	// 	  		}
    //         });
    //
    //         // Q.input.on("enter", this, function() {});
    //
 //  	    });
    //
    //     Q.scene("gameOver", function(/*stage*/) {
    //
    //   Q.pauseGame();
    //   Q.audio.stop('rocket.mp3');
 //  		Q.audio.stop('racing.mp3');
    //
    //   self.set('currentScene', 'gameOver');
    //   self.set('showHud', true);
    //
    //   self.get('cannon').set('isReloading', false);
    //   Q.state.set('shield_is_reloading', false);
    //   Q.state.set('engine_is_reloading', false);
    //
    //   if(self.get('asteroidMaker')) {
    //     self.get('asteroidMaker').destroy();
    //     self.set('asteroidMaker', null);
    //   }
    //   if(self.get('ufoMaker')) {
    //     self.get('ufoMaker').destroy();
    //     self.set('ufoMaker', null);
    //   }
    //   if(self.get('bigAsteroidMaker')) {
    //     self.get('bigAsteroidMaker').destroy();
    //     self.set('bigAsteroidMaker', null);
    //   }
    //   if(self.get('explodingAsteroidMaker')) {
    //     self.get('explodingAsteroidMaker').destroy();
    //     self.set('explodingAsteroidMaker', null);
    //   }
    //   if(self.get('fastAsteroidMaker')) {
    //     self.get('fastAsteroidMaker').destroy();
    //     self.set('fastAsteroidMaker', null);
    //   }
    //
    //   if(self.get('cannonReloadingTimeout')) {
    //     clearTimeout(self.get('cannonReloadingTimeout'));
    //   }
    //
    //   if(self.get('shieldReloadingTimeout')) {
    //     clearTimeout(self.get('shieldReloadingTimeout'));
    //   }
    //
    //   if(self.get('engineReloadingTimeout')) {
    //     clearTimeout(self.get('engineReloadingTimeout'));
    //   }
    // });
    //
    //     this.loadGameCanvas();
    // },

    // newScore: function() {
    //     return (this.get('gameState').get('flown_distance') + this.get('gameState').get('stars')) * this.get('gameState').get('level');
    // }.property('gameState.flown_distance', 'gameState.stars', 'gameState.level'),
    //
    // observeRocketComponentStates: function() {
    //     if(this.get('Q') !== null) {
    //   if(!Ember.isEmpty(this.get('me'))) {
    //     this.get('me').get('user').then(user => {
    //       if(!Ember.isEmpty(user)) {
    //         this.set('components_ready', 0);
    //         user.get('rocket').then(rocket => {
    //           if(!Ember.isEmpty(rocket)) {
    //             this.set('rocket', rocket);
    //             var Q = this.get('Q');
    //             rocket.get('cannon').then(cannon => {
    //               if(!Ember.isEmpty(cannon)) {
    //                 if(cannon.get('status') !== 'unlocked') {
    //                   cannon.set('currentValue', 0);
    //                   Q.state.set('bps', 0);
    //                   this.bumpUpReadyRocketComponents();
    //                 }
    //                 else {
    //                   cannon.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
    //                     if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
    //                       cannon.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
    //                       this.bumpUpReadyRocketComponents();
    //                     }
    //                   });
    //                 }
    //               }
    //             });
    //
    //             rocket.get('shield').then(shield => {
    //               if(!Ember.isEmpty(shield)) {
    //                 if(shield.get('status') !== 'unlocked') {
    //                   shield.set('currentValue', 0);
    //                   Q.state.set('srr', 0);
    //                   this.bumpUpReadyRocketComponents();
    //                 }
    //                 else {
    //                   shield.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
    //                     if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
    //                       shield.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
    //                       this.bumpUpReadyRocketComponents();
    //                     }
    //                   });
    //                 }
    //               }
    //             });
    //
    //             rocket.get('engine').then(engine => {
    //               if(!Ember.isEmpty(engine)) {
    //                 if(engine.get('status') !== 'unlocked') {
    //                   engine.set('currentValue', 0);
    //                   Q.state.set('sdrr', 0);
    //                   this.bumpUpReadyRocketComponents();
    //                 }
    //                 else {
    //                   engine.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
    //                     if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
    //                       engine.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
    //                       this.bumpUpReadyRocketComponents();
    //                     }
    //                   });
    //                 }
    //               }
    //             });
    //           }
    //         });
    //       }
    //     });
    //   }
    // }
    // }.observes(
    //     'me.user.rocket.cannon.status',
    //     'me.user.rocket.cannon.selectedRocketComponentModelMm',
    //     'me.user.rocket.shield.status',
    //     'me.user.rocket.shield.selectedRocketComponentModelMm',
    //     'me.user.rocket.engine.status',
    //     'me.user.rocket.engine.selectedRocketComponentModelMm'
    // ).on('init'),

    // bumpUpReadyRocketComponents() {
    //     this.set('components_ready', this.get('components_ready') + 1);
    //     if(this.get('components_ready') === 3) {
    //       // now all relevant data for the game to load is present, e.g. the reached level
    //       if(!this.get('gameCanvasIsLoaded')) {
    //         this.loadGameCanvas();
    //       }
    //     }
    // },



  //   setupLevel: function(level) {
  //       var Q = this.get('Q');
  //       var width = Ember.$('#game').width();
  //
  //       this.get('gameState').set('distance_to_goal', 50);
  //       this.get('gameState').set('reached_end', false);
  //
  //       if(!this.get('asteroidMaker')) {
  //           this.set('asteroidMaker', new Q.AsteroidMaker());
  //           Q.stage().insert(this.get('asteroidMaker'));
  //       }
  //
  //       this.get('asteroidMaker').p.launchRandomFactor = 0.3 - (width / 10000);
  //
  //       if(level >= 2) {
  //           if(!this.get('ufoMaker')) {
  //               this.set('ufoMaker', new Q.UfoMaker());
  //               Q.stage().insert(this.get('ufoMaker'));
  //           }
  //
  //           this.get('asteroidMaker').p.launchRandomFactor = 0.3 - (width / 10000);
  //           this.get('ufoMaker').p.isActive = 1;
  //           this.get('ufoMaker').p.launchRandomFactor = 1 - (width / 10000);
  //       }
  //   if(level >= 3) {
  //     if(!this.get('bigAsteroidMaker')) {
  //       this.set('bigAsteroidMaker', new Q.BigAsteroidMaker());
  //       Q.stage().insert(this.get('bigAsteroidMaker'));
  //     }
  //     this.get('ufoMaker').p.isActive = 0;
  //     this.get('bigAsteroidMaker').p.isActive = 1;
  //
  //     this.get('asteroidMaker').p.launchRandomFactor = 1 - (width / 10000);
  //     this.get('bigAsteroidMaker').p.launchRandomFactor = 1.5 - (width / 10000);
  //   }
  //   if(level >= 4) {
  //     this.get('ufoMaker').p.isActive = 1;
  //     this.get('bigAsteroidMaker').p.isActive = 1;
  //
  //     this.get('asteroidMaker').p.launchRandomFactor = 1.5 - (width / 10000);
  //     this.get('bigAsteroidMaker').p.launchRandomFactor = 1.5 - (width / 10000);
  //     this.get('ufoMaker').p.launchRandomFactor = 1.5 - (width / 10000);
  //   }
  //   if(level >= 5) {
  //     if(!this.get('explodingAsteroidMaker')) {
  //       this.set('explodingAsteroidMaker', new Q.ExplodingAsteroidMaker());
  //       Q.stage().insert(this.get('explodingAsteroidMaker'));
  //     }
  //
  //     this.get('ufoMaker').p.isActive = 0;
  //     this.get('bigAsteroidMaker').p.isActive = 1;
  //     this.get('explodingAsteroidMaker').p.isActive = 1;
  //
  //     // this.get('asteroidMaker').p.launchRandomFactor = 1.3;
  //     this.get('bigAsteroidMaker').p.launchRandomFactor = 1.5 - (width / 10000);
  //     this.get('explodingAsteroidMaker').p.launchRandomFactor = 2 - (width / 10000);
  //   }
  //   if(level >= 6) {
  //     if(!this.get('fastAsteroidMaker')) {
  //       this.set('fastAsteroidMaker', new Q.FastAsteroidMaker());
  //       Q.stage().insert(this.get('fastAsteroidMaker'));
  //     }
  //
  //     this.get('ufoMaker').p.isActive = 0;
  //     this.get('explodingAsteroidMaker').p.isActive = 0;
  //     this.get('bigAsteroidMaker').p.isActive = 1;
  //     this.get('fastAsteroidMaker').p.isActive = 1;
  //
  //     this.get('asteroidMaker').p.launchRandomFactor = 1.5 - (width / 10000);
  //     this.get('bigAsteroidMaker').p.launchRandomFactor = 2.5 - (width / 10000);
  //     this.get('fastAsteroidMaker').p.launchRandomFactor = 1.8 - (width / 10000);
  //   }
  //   if(level >= 7) {
  //     this.get('ufoMaker').p.isActive = 1;
  //     this.get('explodingAsteroidMaker').p.isActive = 0;
  //     this.get('bigAsteroidMaker').p.isActive = 1;
  //     this.get('fastAsteroidMaker').p.isActive = 1;
  //
  //     this.get('asteroidMaker').p.launchRandomFactor = 1.5 - (width / 10000);
  //     this.get('bigAsteroidMaker').p.launchRandomFactor = 2.5 - (width / 10000);
  //     this.get('fastAsteroidMaker').p.launchRandomFactor = 1.8 - (width / 10000);
  //   }
  //   },
  //
  // aChallengeIsActive: function() {
  //   if(!Ember.isEmpty(this.get('me').get('activeChallenge'))) {
  //     return true;
  //   }
  //   else {
  //     return false;
  //   }
  // }.property('me.activeChallenge'),

  // initRocketComponents: function() {
  //   this.get('me').get('user').then(user => {
  //     if(!Ember.isEmpty(user)) {
  //       user.get('rocket').then(rocket => {
  //         if(!Ember.isEmpty(rocket)) {
  //           rocket.get('cannon').then(cannon => {
  //             if(!Ember.isEmpty(cannon)) {
  //               this.set('cannon', cannon);
  //               this.resetCannon();
  //             }
  //           });
  //
  //           rocket.get('shield').then(shield => {
  //             if(!Ember.isEmpty(shield)) {
  //               this.set('shield', shield);
  //               this.resetShield();
  //             }
  //           });
  //
  //           rocket.get('engine').then(engine => {
  //             if(!Ember.isEmpty(engine)) {
  //               this.set('engine', engine);
  //               this.resetEngine();
  //             }
  //           });
  //         }
  //       });
  //     }
  //   });
  // }.observes(
  //   'me.user',
  //   'me.user.rocket',
  //   'me.user.rocket.canon',
  //   'me.user.rocket.shield',
  //   'me.user.rocket.engine'
  // ),

  // startStage() {
  //   this.get('me').get('user').then(user => {
  //     user.get('energy').then(energy => {
  //       if(energy.get('current') > 0) {
  //         energy.set('current', energy.get('current') - 1);
  //         energy.save();
  //         this.get('Q').clearStages();
  //         this.get('Q').stageScene('level');
  //         Ember.$("#game").focus();
  //       }
  //     });
  //   });
  // },
  }

});
