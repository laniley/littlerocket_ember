import Ember from 'ember';

const GameInputHandler = Ember.Object.extend({
	/**
	  * Provided key names mapped to key codes - add more names and key codes as necessary
	  */

	KEY_CODES: {
		LEFT: 	37,
		RIGHT: 	39,
		UP: 	38,
		DOWN: 	40,
		SPACE: 	32,
		Z: 		90,
		X: 		88,
		ENTER: 	13,
		ESC: 	27,
		P: 		80,
		S: 		83
	},

	DEFAULT_KEY_NAMES : {
		LEFT: 	'left',
		RIGHT: 	'right',
		UP: 	'up',
		DOWN: 	'down',
		SPACE: 	'fire',
		Z: 		'fire',
		X: 		'action',
		ENTER: 	'confirm',
		ESC: 	'esc',
		P: 		'P',
		S: 		'S'
  	},

	DEFAULT_TOUCH_CONTROLS: [
		['left','<' ],
  		[],
  		['fire', '*'],
  		[],
  		['right','>' ]
	],

	keyboardEnabled: false,
	touchEnabled: false,
	joypadEnabled: false,

	inputMethodSettings: {},
	inputMethods: null,

	keys: {},
	keypad: {},

	hasTouch: !!('ontouchstart' in window),

	game: null,

	init() {
		this._super();

		console.log('Initializing game input handler...');

		this.set('keyboardEnabled', this.get('inputMethodSettings.keyboardEnabled'));
	},

	/**
	 * Enable / Disable keyboard
	 */
	observeKeyboardState: Ember.on('init', Ember.observer('keyboardEnabled', function() {

		if(this.get('keyboardEnabled')) {

			Ember.$(document).on(
				'keydown',
				{ _self: this },
				function(event) {
					event.data._self.set('game.gameState.pressedKey', event.keyCode);
				}
			);

			Ember.$(document).on(
				'keyup',
				{ _self: this },
				function(event) {
					event.data._self.set('game.gameState.pressedKey', 0);
				}
			);

		}
	}))
});

export default GameInputHandler;
