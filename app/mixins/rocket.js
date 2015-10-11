/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  rocket: null,
  initRocket: function() {
    var self = this;
    var distanceToGoalRef = 50;

    var y  = Q.height/6 * 5;
    if(Q.touchDevice) {
    	y -= 100;
    }

    Q.TransformableSprite.extend("Rocket", {
    	init: function(p) {
    		  this._super(p, {
    				name:          "Rocket",
    				sheet:         "rocket",
    				frame:         0,
    				direction:     'up',
    				stars:         0,
    				vSpeed:        Q.state.get('speed'),
    				tileW:         50,
    				tileH:         140,
    				type:          Q.SPRITE_ROCKET,
    				collisionMask: Q.SPRITE_STAR,
            lastSpeedUp:   0,
            points:        [],
            collided:      false,
            scale: 			   Q.state.get('scale'),
            hasACannon: 	 false,
            cannon: null,
            cannonCapacity: 3
    		  });

          if(!Ember.isEmpty(self.get('rocket').get('cannon'))) {
            this.p.hasACannon = true;
          }
    		  else {
            this.p.hasACannon = false;
          }

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
    	},

    	step: function(dt) {
        if(!Q.state.get('isPaused')) {

    			this.p.lastSpeedUp += dt;

    			if(this.p.lastSpeedUp > 1) {
            Q.state.set('speed', Q.state.get('speed') + 1);

    				this.p.speed = Q.state.get('speed');

    				Q.state.set("distanceToGoal", Q.state.get("distanceToGoal") - 1);
    				Q.state.set("distance", Q.state.get("distance") + 1);
            self.set('distance', self.get('distance') + 1);

    				this.p.lastSpeedUp = 0;
    			}


    			if(Q.state.get("distanceToGoal") <= 0) {
    				this.levelUp();
    			}

    			// rocket can't leave the screen
    			if(this.p.x > Q.width - 30 && this.p.vx > 0 ||
             this.p.x < 30 && this.p.vx < 0)
    			{
    				this.p.vx = 0;
    			}

    		  // rotate the rocket
    		  // based on our velocity
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

    	fireCannon: function() {
    		if(this.p.hasACannon &&
          !Q.state.get('cannon_is_reloading') &&
          Q.state.get('bullets') > 0) {
          this.p.cannon.trigger("fire");
    	  }
    	},

      slowdown: function() {
        if(!Q.state.get('engine_is_reloading') && Q.state.get('slowdowns') > 0)
    		{
          Q.state.set('engine_is_reloading', true);
          Q.state.set('slowdowns', Q.state.get('slowdowns') - 1);

          var currentSpeed = Q.state.get('speed');
          var percent = currentSpeed * 0.1;

          while(Q.state.get('speed') > (currentSpeed - percent)) {
            Q.state.set('speed', Q.state.get('speed') - 1);
          }

          var timeout = setTimeout(function() {
            Q.state.set('engine_is_reloading', false);
          }, 1000 / Q.state.get('sdrr'));

          self.set('engineReloadingTimeout', timeout);
    	  }
      },

    	destroy: function() {
    		Q.pauseGame();
    	},

    	levelUp: function() {
    		Q.state.set('level', Q.state.get('level') + 1);
        self.set('level', self.get('level') + 1);

    		Q.state.set('distanceToGoal', Math.floor(distanceToGoalRef * ( 1 + ((Q.state.get('level') - 1) / 10) )));

        self.get('me').get('user').then(user => {
          if(Q.state.get('level') > user.get('reached_level') && Q.state.get('level') < 6) {
            user.set('reached_level', Q.state.get('level'));
            user.save();
          }
        });

        self.setupLevel(Q.state.get('level'));
    	}
    });
  }
});
