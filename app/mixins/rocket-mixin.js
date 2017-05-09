/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({

    gameState: Ember.inject.service('game-state-service'),

    initRocket: function() {

        var self = this;

        Q.TransformableSprite.extend("Rocket", {
            init: function(p) {
                this._super(p, {
                    z: 0,
    				type: Q.SPRITE_ROCKET,
    				collisionMask: Q.SPRITE_STAR,
                });

                this.add("2d, platformerControls, animation");

                // this.on('exploded', this, 'destroy');
                // this.on('fireCannon', this, 'fireCannon');
                // this.on('slowdown', this, 'slowdown');
                // this.on('collided', this, 'handleCollision');
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
