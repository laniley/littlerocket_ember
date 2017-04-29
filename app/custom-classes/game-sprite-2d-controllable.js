/**
  * Platformer Control Component
  *
  * Adds 2D platformer controls onto a Sprite
  *
  * Platformer controls bind to left, and right and allow the player to jump.
  *
  * Adds following properties to the entity to control speed and jumping:
  */
import Sprite2D from './../custom-classes/game-sprite-2d';

const Sprite2DControllable = Sprite2D.extend({

	game: null,

	ignoreControls: false,

	moved: false,
	stepDistance: 32,
	stepDelay: 0.2,
	stepWait: 0,
	stepping: false,

	init() {
		this._super();
	},

	step(dt) {
		if(this.get('ignoreControls') === undefined || !this.get('ignoreControls')) {

			this.set('stepWait', this.get('stepWait') - dt);

			// move left
			if(this.get('game.gameState.pressedKey') === 37) {
				this.set('diffX', -this.get('stepDistance'));
				this.set('stepping', true);
			}
			// move right
			else if(this.get('game.gameState.pressedKey') === 39) {
				this.set('diffX', this.get('stepDistance'));
				this.set('stepping', true);
			}

			if(this.get('stepping')) {
			  	this.set('x', this.get('x') + this.get('diffX') * dt / this.get('stepDelay'));
				this.render();
				this.set('stepping', false);
			}
		}
   	},

});

export default Sprite2DControllable;
