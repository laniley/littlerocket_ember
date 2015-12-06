/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  initBullet: function() {
    Q.TransformableSprite.extend("Bullet", {
    	init: function(p) {
    		  this._super(p, {
    				name:          "Bullet",
    				sheet:         "bullet",
    				tileW:         20,
    				tileH:         20,
    				x:             new Q('Rocket').first().p.x, // x location of the center
    				y:             400, // y location of the center
    				type:          Q.SPRITE_BULLET,
    				collisionMask: Q.SPRITE_ASTEROID,
    				collided:      false,
    				scale: 			   Q.state.get('scale'),
            mode:          1
    		  });

          if(this.p.mode === 1) {
            this.p.vy = -350;
            this.p.vx = 0;
          }
      		else if(p.mode === 2) {
            var random = Math.random();
            this.p.vy = -350 + (350 * Math.abs(0.5 - random));
            this.p.vx = 350 * (0.5 - random);
          }

    		  this.add("2d, bulletControls");
    	}
    });

    Q.component("bulletControls", {
    	// called when the component is added to an entity
    	added: function() {
    		var p = this.entity.p;

    		// add in our default properties
    		Q._defaults(p, this.defaults);

    		// every time our entity steps
    		// call our step method
    		this.entity.on("step",this,"step");
    	},

    	step: function(/*dt*/) {
    		if(this.entity.p.y < 0) {
    			this.entity.destroy();
    		}
    	}
    });
  }
});
