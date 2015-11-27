/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  shield: null,
  shieldQuintusObject: null,
  shieldReloadingTimeout: null,

  shieldFrame: function() {
    if(!Ember.isEmpty(this.get('shield')) &&
        this.get('shield').get('status') === 'unlocked' &&
        this.get('shield').get('currentValue') > 0 &&
        !this.get('shield').get('isReloading')) {
      return 1;
    }
    else {
      return 0;
    }
  }.property('shield.status', 'shield.isReloading', 'shield.currentValue'),

  updateShieldFrame: function() {
    if(this.get('shieldFrame') === 1) {
      this.get('shieldQuintusObject').play('reloaded');
    }
    else {
      this.get('shieldQuintusObject').play('reloading');
    }
  }.observes('shieldFrame'),

  initShield: function() {
    var self = this;
    var y  = Q.height/6 * 5;
    if(Q.touchDevice) {
    	y -= 100;
    }

    Q.TransformableSprite.extend("Shield", {
    	init: function(p) {
  		  this._super(p, {
  				name: 'Shield',
          sprite: 'shield',
  				sheet: 'shield',
  				frame: self.get('shieldFrame'),
  				direction: 'up',
  				tileW: 50,
  				tileH: 140,
  				type: Q.SPRITE_ROCKET,
          collided: false,
          scale: Q.state.get('scale'),
          rocket: null,
          capacity: 3
  		  });

        self.set('shieldQuintusObject', this);

        // x location of the center
        this.p.x = Q.width / 2;
        // y location of the center
        this.p.y = y;

        // Drehpunkt zentral
        this.p.points = [[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0],[0,0]];

        this.add("animation");
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

    	destroy: function() {
    		this.entity.destroy();
    	}
    });
  }
});
