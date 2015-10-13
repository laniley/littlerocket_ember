/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  cannon: null,
  cannonReloadingTimeout: null,
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
  				frame: 1,
  				direction: 'up',
  				vSpeed: Q.state.get('speed'),
  				tileW: 50,
  				tileH: 140,
  				type: Q.SPRITE_CANNON,
          collided: false,
          scale: Q.state.get('scale'),
          rocket: null,
          capacity: 3
  		  });

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

        var cannon = this;

    		if(!Q.state.get('cannon_is_reloading') && self.get('cannon').get('currentValue') > 0) {

          cannon.stage.insert(new Q.Bullet());

          self.get('cannon').set('currentValue', self.get('cannon').get('currentValue') - 1);
          Q.state.set('cannon_is_reloading', true);

          cannon.play('reloading');

          var timeout = setTimeout(function() {
            Q.state.set('cannon_is_reloading', false);
            if(self.get('cannon').get('currentValue') > 0) {
              cannon.play('reloaded');
            }
          }, 1000 / Q.state.get('bps'));

          self.set('cannonReloadingTimeout', timeout);
    	  }
    	},

    	destroy: function() {
    		this.entity.destroy();
    	}
    });
  }
});
