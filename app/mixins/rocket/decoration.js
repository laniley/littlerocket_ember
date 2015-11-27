/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  decoration: null,
  decorationQuintusObject: null,
  initDecoration: function() {
    var self = this;
    var y  = Q.height/6 * 5;
    if(Q.touchDevice) {
    	y -= 100;
    }

    Q.TransformableSprite.extend("Decoration", {
    	init: function(p) {
  		  this._super(p, {
  				name: 'Decoration',
          sprite: 'decoration',
  				sheet: 'decoration',
  				frame: 0,
          z: 3,
  				direction: 'up',
  				tileW: 50,
  				tileH: 140,
  				type: Q.SPRITE_ROCKET,
          collided: false,
          scale: Q.state.get('scale'),
          rocket: null
  		  });

        self.set('decorationQuintusObject', this);

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
