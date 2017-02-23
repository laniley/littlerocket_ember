import Ember from 'ember';
import Sprite from './../custom-classes/game-sprite';

const Sprite2D = Sprite.extend({

	gameState: Ember.inject.service('game-state'),

	init() {
		this._super();
		this.set('vx', 0);
		this.set('vy', 1);
		this.set('ax', 0);
		this.set('ay', 0);
		this.set('gravity', 1);
		// this.set('collisinMask', Q.SPRITE_DEFAULT);
		// entity.on('step',this,"step");
		// entity.on('hit',this,'collision');
	},

	// collision: function(col,last) {
    //   var entity = this.entity,
    //       p = entity.p,
    //       magnitude = 0;
	//
    //   if(col.obj.p && col.obj.p.sensor) {
    //     col.obj.trigger("sensor",entity);
    //     return;
    //   }
	//
    //   col.impact = 0;
    //   var impactX = Math.abs(p.vx);
    //   var impactY = Math.abs(p.vy);
	//
    //   p.x -= col.separate[0];
    //   p.y -= col.separate[1];
	//
    //   // Top collision
    //   if(col.normalY < -0.3) {
    //     if(!p.skipCollide && p.vy > 0) { p.vy = 0; }
    //     col.impact = impactY;
    //     entity.trigger("bump.bottom",col);
    //   }
    //   if(col.normalY > 0.3) {
    //     if(!p.skipCollide && p.vy < 0) { p.vy = 0; }
    //     col.impact = impactY;
	//
    //     entity.trigger("bump.top",col);
    //   }
	//
    //   if(col.normalX < -0.3) {
    //     if(!p.skipCollide && p.vx > 0) { p.vx = 0;  }
    //     col.impact = impactX;
    //     entity.trigger("bump.right",col);
    //   }
    //   if(col.normalX > 0.3) {
    //     if(!p.skipCollide && p.vx < 0) { p.vx = 0; }
    //     col.impact = impactX;
	//
    //     entity.trigger("bump.left",col);
    //   }
    // },

	step: function(dt) {
      	var dtStep = dt;
		// TODO: check the entity's magnitude of vx and vy,
		// reduce the max dtStep if necessary to prevent
		// skipping through objects.
      	while(dtStep > 0) {
        	dt = Math.min(1/30, dtStep);
	        // Updated based on the velocity and acceleration
			var vx = this.get('vx');
			var vy = this.get('vy');
			var ax = this.get('ax');
			var ay = this.get('ay');
			var gravityX = this.get('gravityX');
			var gravityY = this.get('gravityY');
			var gravity = this.get('gravity');

			vx += ax * dt + gravityX * dt * gravity;
			vy += ay * dt + gravityY * dt * gravity;

			this.set('vx', vx);
			this.set('vy', vy);

			this.set('x', vx * dt);
			this.set('y', vy * dt);

	        // this.entity.stage.collide(this.entity);
	        dtStep -= dt;
      	}
  	},

});

export default Sprite2D;
