/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  cannon: null,
  cannonQuintusObject: null,
  cannonReloadingTimeout: null,

  cannonFrame: function() {
    if(!Ember.isEmpty(this.get('cannon')) &&
        this.get('cannon').get('status') === 'unlocked' &&
        this.get('cannon').get('currentValue') > 0 &&
        !this.get('cannon').get('isReloading')) {
      return 1;
    }
    else {
      return 0;
    }
  }.property('cannon.status', 'cannon.isReloading', 'cannon.currentValue'),

  updateCannonFrame: function() {
    if(this.get('cannonFrame') === 1) {
      this.get('cannonQuintusObject').play('reloaded');
    }
    else {
      this.get('cannonQuintusObject').play('reloading');
    }
  }.observes('cannonFrame'),

  initCannon: function() {
    var self = this;
    var y  = Q.height/6 * 5;
    if(Q.touchDevice) {
    	y -= 100;
    }

    Q.TransformableSprite.extend("Cannon", {
    	init: function(p) {
  		  this._super(p, {
  				name: 'Cannon',
          sprite: 'cannon',
  				sheet: 'cannon',
  				frame: self.get('cannonFrame'),
  				direction: 'up',
  				tileW: 50,
  				tileH: 140,
  				type: Q.SPRITE_ROCKET,
          collided: false,
          scale: Q.state.get('scale'),
          rocket: null
  		  });

        self.set('cannonQuintusObject', this);

        // x location of the center
        this.p.x = Q.width / 2;
        // y location of the center
        this.p.y = y;

        // Drehpunkt zentral
        this.p.points = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];

        this.add("animation");

  		  this.on('fire', this, 'fire');
    	},

      setRocket: function(rocket) {
        this.p.rocket = rocket;
      },

    	step: function(/* dt */) {
        // x location of the center
        this.p.x = this.p.rocket.p.x;
        // y location of the center
        this.p.y = this.p.rocket.p.y;
        // rotation
        this.p.angle = this.p.rocket.p.angle;
    	},

    	fire: function() {
        // check if the cannon is not reloading currently and if there are still bullets left to shoot
    		if(!self.get('cannon').get('isReloading') && self.get('cannon').get('currentValue') > 0) {
          self.get('cannon').set('isReloading', true);
          self.get('cannon').set('currentValue', self.get('cannon').get('currentValue') - 1);
          self.get('cannon').get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
            var timeout = setTimeout(function() {
              self.get('cannon').set('isReloading', false);
            }, 10500 - selectedRocketComponentModelMm.get('recharge_rate') * 1000);
            self.set('cannonReloadingTimeout', timeout);
            selectedRocketComponentModelMm.get('rocketComponentModel').then(rocketComponentModel => {
              if(rocketComponentModel.get('model') === 1) {
                this.stage.insert(new Q.Bullet());
              }
            });
          });
    	  }
    	},

    	destroy: function() {
    		this.entity.destroy();
    	}
    });
  }
});
