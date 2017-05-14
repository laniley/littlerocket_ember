import Ember from 'ember';
import Sprite from './game-sprite';

const Sprite2D = Sprite.extend({

	gameState: Ember.inject.service('game-state-service'),
	// the direction the sprite is currently moving in
	direction: '',
	// if the sprite is moving
	stepping: true,
	// the speed of the sprite
	speed: 0,
	// whether or not the sprite can leave the visible part of the canvas
	canLeaveTheViewport: true,

	diffX: Ember.computed(
		'direction',
		'speed',
		'x_px',
		'tileW',
		'game.gameState.width',
		'canLeaveTheViewport',

		function() {

			var diffX = 0;

			if(this.get('direction') === 'left') {
				diffX = -this.get('speed');
			}
			else if(this.get('direction') === 'right') {
				diffX = this.get('speed');
			}

			if(!this.get('canLeaveTheViewport')) {
				if(
					(
						this.get('x_px') > this.get('game.gameState.width') - this.get('tileW') && this.get('direction') === 'right'
					) ||
					(
						this.get('x_px') < 0 && this.get('direction') === 'left'
					)
				) {
					diffX = 0;
				}
			}

			return diffX;
		}
	),

	diffY: Ember.computed(
		'direction',
		'speed',
		'y_px',
		'tileH',
		'game.gameState.height',
		'canLeaveTheViewport',

		function() {

			var diffY = 0;

			if(this.get('direction') === 'up') {
				diffY = -this.get('speed');
			}
			else if(this.get('direction') === 'down') {
				diffY = this.get('speed');
			}

			if(!this.get('canLeaveTheViewport')) {
				if(
					(
						this.get('y_px') > this.get('game.gameState.height') - this.get('tileH') && this.get('direction') === 'up'
					) ||
					(
						this.get('y_px') < 0 && this.get('direction') === 'down'
					)
				) {
					diffY = 0;
				}
			}

			return diffY;
		}
	),

	init() {
		this._super();
		this.set('vy', 1);
		this.set('ax', 0);
		this.set('ay', 0);
		this.set('gravity', 1);
		// this.set('collisinMask', Q.SPRITE_DEFAULT);
	},

	step(dt) {

		if(!this.get('game.gameState.isPaused')) {

			if(this.get('stepping')) {

			  	this.set('x', this.get('x') + this.get('diffX') * dt);
				this.set('y', this.get('y') + this.get('diffY') * dt);

				this.render();
			}
		}
   	},
	/*
		collision: function(col,last) {
	      var entity = this.entity,
	          p = entity.p,
	          magnitude = 0;

	      if(col.obj.p && col.obj.p.sensor) {
	        col.obj.trigger("sensor",entity);
	        return;
	      }

	      col.impact = 0;
	      var impactX = Math.abs(p.vx);
	      var impactY = Math.abs(p.vy);

	      p.x -= col.separate[0];
	      p.y -= col.separate[1];

	      // Top collision
	      if(col.normalY < -0.3) {
	        if(!p.skipCollide && p.vy > 0) { p.vy = 0; }
	        col.impact = impactY;
	        entity.trigger("bump.bottom",col);
	      }
	      if(col.normalY > 0.3) {
	        if(!p.skipCollide && p.vy < 0) { p.vy = 0; }
	        col.impact = impactY;

	        entity.trigger("bump.top",col);
	      }

	      if(col.normalX < -0.3) {
	        if(!p.skipCollide && p.vx > 0) { p.vx = 0;  }
	        col.impact = impactX;
	        entity.trigger("bump.right",col);
	      }
	      if(col.normalX > 0.3) {
	        if(!p.skipCollide && p.vx < 0) { p.vx = 0; }
	        col.impact = impactX;

	        entity.trigger("bump.left",col);
	      }
	    },
	*/
});

export default Sprite2D;
