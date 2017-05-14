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

	init() {
		this._super();
	},

	direction: Ember.computed('game.gameState.pressedKey', function() {
		// not moving
		var direction = '';

		// moving left
		if(this.get('game.gameState.pressedKey') === 37) {
			direction = 'left';
		}
		// moving right
		else if(this.get('game.gameState.pressedKey') === 39) {
			direction = 'right';
		}

		return direction;
	}),

	stepping: Ember.computed('game.gameState.pressedKey', 'ignoreControls', function() {
		// not moving
		var stepping = false;

		if(!this.get('ignoreControls')) {
			// moving left
			if(this.get('game.gameState.pressedKey') === 37) {
				stepping = true;
			}
			// moving right
			else if(this.get('game.gameState.pressedKey') === 39) {
				stepping = true;
			}
		}

		return stepping;
	}),

});

export default Sprite2DControllable;
