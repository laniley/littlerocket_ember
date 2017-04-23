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

			this.set('moved', false);
			this.set('stepWait', this.get('stepWait') - dt);

			// left
			if(this.get('game.gameState.pressedKey') === 37) {
				this.set('diffX', -this.get('stepDistance'));
			}
			// right
			else if(this.get('game.gameState.pressedKey') === 39) {
				this.set('diffX', this.get('stepDistance'));
			}

			//
			// if(this.get('stepping')) {
			// 	  	this.set('x', this.get('x') + this.get('diffX') * dt / this.get('stepDelay'));
			// 	  	this.set('y', this.get('y') + this.get('diffY') * dt / this.get('stepDelay'));
			// 	}
			//
			// if(this.get('stepWait') > 0) {
			// 		return;
			// 	}
			//
			// if(this.get('stepping')) {
			// 	  	this.set('x', this.get('destX'));
			// 	  	this.get('y', this.get('destY'));
			// 	}
			//
			// this.set('stepping', false);
			// this.set('diffX', 0);
			// this.set('diffY', 0);
			//
			// if(this.get('game.inputs')['up']) {
			// 	  	this.set('diffY', -this.get('stepDistance'));
			// 	}
			// else if(this.get('game.inputs')['down']) {
			// 	  	this.set('diffY', this.get('stepDistance'));
			// 	}
			//
			// if(this.get('diffY') || this.get('diffX') ) {
			// 		this.set('stepping', true);
			// 		this.set('origX', this.get('x'));
			// 		this.set('origY', this.get('y'));
			// 		this.set('destX', this.get('x') + this.get('diffX'));
			// 		this.set('destY', this.get('y') + this.get('diffY'));
			// 		this.set('stepWait', this.get('stepDelay'));
			// 	}
		}
   	},

});

export default Sprite2DControllable;
