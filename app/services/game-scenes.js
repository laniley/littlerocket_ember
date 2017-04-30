import Ember from 'ember';
import Scene from './../custom-classes/game-framework/game-scene';
import Rocket from './../custom-classes/game-src/rocket';

export default Ember.Service.extend({

	me: Ember.inject.service('me'),
	gameState: Ember.inject.service('game-state'),

	scenes: {},

	init() {
		this._super();
		/************** MAIN MENU **********************/
		var mainMenu = Scene.create({
			gameState: this.get('gameState'),
			name: 'mainMenu',
			load: (stage) => {
				this.get('gameState').set('isPaused', true);
			    this.get('gameState').get('game').get('audio').stop('rocket.mp3');
				this.get('gameState').get('game').get('audio').stop('racing.mp3');
				this.get('gameState').set('showHud', true);

				this.get('gameState').resetRocketComponents();

				var rocket = Rocket.create({
					game: this.get('gameState').get('game'),
					stage: stage
				});

				stage.insert(rocket);

				this.get('gameState').set('rocket', rocket);
			}
		});
		this.scenes.mainMenu = mainMenu;
		/************** TRACK ***********************/
		var track = Scene.create({
			gameState: this.get('gameState'),
			name: 'track',
			load: (stage) => {
				this.get('gameState').set('isPaused', false);
			    // this.get('gameState').get('game').get('audio').stop('rocket.mp3');
				// this.get('gameState').get('game').get('audio').stop('racing.mp3');
				this.get('gameState').set('showHud', true);
			}
		});
		this.scenes.track = track;
	},

});
