/* global Q */
/* global FB */
import Ember from 'ember';

export default Ember.Mixin.create({

  FB: null,
  rocket: null,

  initRocket: function() {

    this.set('FB', FB);

    var self = this;
    var y  = Q.height/6 * 5;

    if(Q.touchDevice) {
    	y -= 100;
    }

    Q.TransformableSprite.extend("Rocket", {
    	init: function(p) {
    		  this._super(p, {
    				name: "Rocket",
    				sheet: "rocket",
    				frame: 0,
    				direction: 'up',
    				stars: 0,
            z: 0,
    				tileW: 50,
    				tileH: 140,
    				type: Q.SPRITE_ROCKET,
    				collisionMask: Q.SPRITE_STAR,
            lastSpeedUp: 0,
            points: [],
            scale: Q.state.get('scale'),
            hasACannon: false,
            cannon: null,
            shield: null,
            engine: null
    		  });

          if(!Ember.isEmpty(self.get('rocket').get('cannon'))) {
            this.p.hasACannon = true;
          }
    		  else {
            this.p.hasACannon = false;
          }

          this.p.speed = 300;

          // x location of the center
          this.p.x = Q.width / 2;
          // y location of the center
          this.p.y = y;

    		  // Drehpunkt zentral
    		  this.p.points = [
							  // links, halb oben
							  [-this.p.tileW / 2, -20],
							  // Raketenspitze
							  [0, -this.p.tileH / 2],
							  // rechts, halb oben
							  [this.p.tileW / 2, -20],
							  // rechts, halb unten
							  [this.p.tileW / 2, 5],
							  // Antriebsdüse rechts
							  [10, 20],
							  // rechts, unten
							  [this.p.tileW / 2, -35 + this.p.tileH / 2],
							  // mitte unten
							  [0, -30  + this.p.tileH / 2],
							  // links, unten
							  [-this.p.tileW / 2, -35  + this.p.tileH / 2],
                // Antriebsdüse links
							  [-10, 20 ],
                // links, halb oben
							  [-this.p.tileW / 2, 5]
					];

    		  this.add("2d, platformerControls, animation");

    		  this.on('exploded', this, 'destroy');
    		  this.on('fireCannon', this, 'fireCannon');
          this.on('slowdown', this, 'slowdown');
          this.on('collided', this, 'handleCollision');
    	},

    	step: function(dt) {
        if(!Q.state.get('isPaused')) {

          var gameState = self.store.peekRecord('gameState', 1);

    			this.p.lastSpeedUp += dt;

    			if(this.p.lastSpeedUp > 1) {

            gameState.set('flown_distance', gameState.get('flown_distance') + 1);
            gameState.set('distance_to_goal', gameState.get('distance_to_goal') - 1);

            if(self.get('gameState.mode') === 'arcade') {
              gameState.set('speed', gameState.get('speed') + 1);
            }

    				this.p.lastSpeedUp = 0;
    			}


    			if(self.get('gameState.mode') === 'adventure' && gameState.get('distance_to_goal') <= 0) {
    				this.levelUp();
    			}

    			// don't allow rocket to leave the screen
    			if(this.p.x > Q.width - 30 && this.p.vx > 0 ||
             this.p.x < 30 && this.p.vx < 0) {

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

      setCannon: function(cannon) {
        this.p.cannon = cannon;
      },

      setShield: function(shield) {
        this.p.shield = shield;
      },

      setEngine: function(engine) {
        this.p.engine = engine;
      },

      setDecoration: function(decoration) {
        this.p.decoration = decoration;
      },

    	fireCannon: function() {
    		if(this.p.hasACannon &&
          !self.get('cannon').get('isReloading') &&
          self.get('cannon').get('currentValue') > 0) {
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

    	levelUp: function() {
        var gameState = self.store.peekRecord('gameState', 1);
        var new_level = gameState.get('level') + 1;

        if(new_level < 8) {
          gameState.set('level', new_level);

          self.setupLevel(new_level);

          self.get('me').get('user').then(user => {
            if(new_level > user.get('reached_level')) {
              gameState.set('new_stage_reached', true);
              user.set('reached_level', new_level);
              user.save();

              if(self.get('FB') && self.get('FB').AppEvents) {
                var params = {};
                params[self.get('FB').AppEvents.ParameterNames.LEVEL] = new_level; //player level
                self.get('FB').AppEvents.logEvent(
                  self.get('FB').AppEvents.EventNames.ACHIEVED_LEVEL,
                  null,  // numeric value for this event - in this case, none
                  params
                );
              }
            }
          });
        }
        else {
          gameState.set('reached_end', true);
          Q.stageScene("gameOver", 2);
        }
    	}
    });
  }
});
