/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({

    gameState: Ember.inject.service('game-state'),

    initRocket: function() {

        var self = this;

        Q.TransformableSprite.extend("Rocket", {
            init: function(p) {
                this._super(p, {
    				direction: 'up',
    				stars: 0,
                    z: 0,
    				type: Q.SPRITE_ROCKET,
    				collisionMask: Q.SPRITE_STAR,
                    flownDisanceOfCurrentParsec: 0,
                    scale: Q.state.get('scale'),
                    hasACannon: false,
                    cannon: null,
                    shield: null,
                    engine: null
                });

                this.p.speed = 300;

                this.add("2d, platformerControls, animation");

                // this.on('exploded', this, 'destroy');
                // this.on('fireCannon', this, 'fireCannon');
                // this.on('slowdown', this, 'slowdown');
                // this.on('collided', this, 'handleCollision');
    	    },

            step: function(dt) {

                if(!Q.state.get('isPaused')) {

                    this.p.flownDisanceOfCurrentParsec += dt;

                    if(this.p.flownDisanceOfCurrentParsec > 1) {
                        this.get('gameState').set('distance_to_goal', this.get('gameState').get('distance_to_goal') - 1);
                        this.p.flownDisanceOfCurrentParsec = 0;
                    }

                    // do not allow rocket to leave the screen
                    if( this.p.x > Q.width - 30 && this.p.vx > 0 || this.p.x < 30 && this.p.vx < 0 ) {
                        this.p.vx = 0;
                    }

                    // rotate the rocket based on the velocity
                    if(this.p.vx > 0 && this.p.angle < 45) { // nach rechts drehen
                        this.rotate(this.p.angle + 5);
                    }
                    else if(this.p.vx < 0 && this.p.angle > -45) { // nach links drehen
                        this.rotate(this.p.angle - 5);
                    }
                    else if(this.p.vx === 0) {
                        if(this.p.angle > 0) {
                            if(this.p.angle - 5 < 0) {
                                this.rotate(0);
                            }
                            else {
                                this.rotate(this.p.angle - 5);
                            }
		                }
                        else {
                            if(this.p.angle + 5 > 0) {
                                this.rotate(0);
                            }
                            else {
                                this.rotate(this.p.angle + 5);
                            }
                        }
                    }

                    // fire Cannon
                    if(Q.inputs['up'] && this.p.hasACannon) {
                        this.trigger("fireCannon");
                    }

                    // slowdown
                    if(Q.inputs['down']) {
                        this.trigger("slowdown");
                    }
                }
                else {
                    this.p.speed = 0;
                }
            },

            fireCannon: function() {
            	if( this.p.hasACannon &&
                    !self.get('cannon').get('isReloading') &&
                    self.get('cannon').get('currentValue') > 0 ) {
                        this.p.cannon.trigger("fire");
                }
            },

            handleCollision: function() {
                // no shield
                if(self.get('shield').get('currentValue') === 0 ||
                   self.get('shield').get('isReloading')) {
                      Q.audio.stop('rocket.mp3');
                      Q.audio.stop('racing.mp3');
                      Q.audio.play('explosion.mp3');
                      Q.stageScene("gameOver", 2);
                }
                // with shield
                else {
                  self.get('shield').set('isReloading', true);
                  self.get('shield').set('currentValue', self.get('shield').get('currentValue') - 1);

                  self.get('shield').get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                    var timeout = setTimeout(function() {
                      self.get('shield').set('isReloading', false);
                    }, 10000 - selectedRocketComponentModelMm.get('recharge_rate') * 1000);

                    self.set('shieldReloadingTimeout', timeout);
                  });
                }
            },

            slowdown: function() {
                if(!self.get('engine').get('isReloading') && self.get('engine').get('currentValue') > 0) {
                  self.get('engine').set('isReloading', true);
                  self.get('engine').set('currentValue', self.get('engine').get('currentValue') - 1);

                  var gameState = self.store.peekRecord('gameState', 1);

                  var currentSpeed = gameState.get('speed');
                  var percent = currentSpeed * 0.1;

                  while(gameState.get('speed') > (currentSpeed - percent)) {
                    gameState.set('speed', gameState.get('speed') - 1);
                  }

                  self.get('engine').get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                    var timeout = setTimeout(function() {
                      self.get('engine').set('isReloading', false);
                    }, 10500 - selectedRocketComponentModelMm.get('recharge_rate') * 1000);

                    self.set('engineReloadingTimeout', timeout);
                  });
                    }
            },

            destroy: function() {
    			Q.pauseGame();
    		},

        });
    }
});
