/**
  * Platformer Control Component
  *
  * Adds 2D platformer controls onto a Sprite
  *
  * Platformer controls bind to left, and right and allow the player to jump.
  *
  * Adds the following properties to the entity to control speed and jumping:
  *
  *      {
  *        speed: 200,
  *        jumpSpeed: -300
  *      }
  */
import Ember from 'ember';
import Sprite from './../custom-classes/game-sprite-2d';

const Sprite2DControllable = Sprite2D.extend({

	init(control_type /*options: platformer, step */) {
		this._super();

		if(control_type === 'platformer') {
			this.set('speed', 200);
			this.set('jumpSpeed', -300);
			this.set('collisions', []);
			this.set('landed', false);
			this.set('direction', 'right');

			// this.entity.on("step",this,"step");
			// this.entity.on("bump.bottom",this,"landed");
		}
		else {
			if(Ember.isEmpty(this.get('stepDistance'))) {
				this.set('stepDistance', 32);
			}
			if(Ember.isEmpty(this.get('stepDelay'))) {
				this.set('stepDelay', 0.2);
			}

			this.set('stepWait', 0);
			// this.entity.on("step",this,"step");
			// this.entity.on("hit", this,"collision");
		}
	},

	landed(col) {
	   var p = this.entity.p;
	   p.landed = 1/5;
	},

	step(dt) {
	   var p = this.entity.p;

	   if(p.ignoreControls === undefined || !p.ignoreControls) {
		 var collision = null;

		 // Follow along the current slope, if possible.
		 if(p.collisions !== undefined && p.collisions.length > 0 && (Q.inputs['left'] || Q.inputs['right'] || p.landed > 0)) {
			if(p.collisions.length === 1) {
			   collision = p.collisions[0];
			} else {
			   // If there's more than one possible slope, follow slope with negative Y normal
			   collision = null;

			   for(var i = 0; i < p.collisions.length; i++) {
				 if(p.collisions[i].normalY < 0) {
					collision = p.collisions[i];
				 }
			   }
			}

			// Don't climb up walls.
			if(collision !== null && collision.normalY > -0.3 && collision.normalY < 0.3) {
			   collision = null;
			}
		 }

		 if(Q.inputs['left']) {
			p.direction = 'left';
			if(collision && p.landed > 0) {
			   p.vx = p.speed * collision.normalY;
			   p.vy = -p.speed * collision.normalX;
			} else {
			   p.vx = -p.speed;
			}
		 } else if(Q.inputs['right']) {
			p.direction = 'right';
			if(collision && p.landed > 0) {
			   p.vx = -p.speed * collision.normalY;
			   p.vy = p.speed * collision.normalX;
			} else {
			   p.vx = p.speed;
			}
		 } else {
			p.vx = 0;
			if(collision && p.landed > 0) {
			   p.vy = 0;
			}
		 }

		 if(p.landed > 0 && (Q.inputs['up'] || Q.inputs['action']) && !p.jumping) {
			p.vy = p.jumpSpeed;
			p.landed = -dt;
			p.jumping = true;
		 } else if(Q.inputs['up'] || Q.inputs['action']) {
			this.entity.trigger('jump', this.entity);
			p.jumping = true;
		 }

		 if(p.jumping && !(Q.inputs['up'] || Q.inputs['action'])) {
			p.jumping = false;
			this.entity.trigger('jumped', this.entity);
			if(p.vy < p.jumpSpeed / 3) {
			   p.vy = p.jumpSpeed / 3;
			}
		 }
	   }
	   p.landed -= dt;
   },

});

export default Sprite2DControllable;
