/**
  * Platformer Control Component
  *
  * Adds 2D platformer controls onto a Sprite
  *
  * Platformer controls bind to left, and right and allow the player to jump.
  *
  * Adds following properties to the entity to control speed and jumping:
  */
import Ember from 'ember';
import Sprite2D from './game-sprite-2d';

const Sprite2DControllable = Sprite2D.extend({

	game: null,

	ignoreControls: false,

	moved: false,
	stepDelay: 0.2,
	stepWait: 0,
	stepping: false,

	canLeaveTheViewport: true,

	init() {
		this._super();
	},

	step(dt) {

		if(
			(this.get('ignoreControls') === undefined || !this.get('ignoreControls')) &&
			!this.get('game.gameState.isPaused')
		) {

			this.set('stepWait', this.get('stepWait') - dt);

			// not moving
			if(
				Ember.isEmpty(this.get('game.gameState.pressedKey')) ||
				this.get('game.gameState.pressedKey') === 0
			) {
				this.set('direction', '');
				this.set('stepping', false);
			}

			// moving left
			if(this.get('game.gameState.pressedKey') === 37) {
				this.set('direction', 'left');
				this.set('stepping', true);
			}
			// moving right
			else if(this.get('game.gameState.pressedKey') === 39) {
				this.set('direction', 'right');
				this.set('stepping', true);
			}

			if(this.get('stepping')) {

				var diffX = 0;

				if(this.get('direction') === 'left') {
					diffX = -this.get('vx');
				}
				else {
					diffX = this.get('vx');
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

			  	this.set('x', this.get('x') + diffX * dt / this.get('stepDelay'));

				this.render();

				this.set('stepping', false);
			}
		}
   	},

});

export default Sprite2DControllable;
