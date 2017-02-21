import Ember from 'ember';
import Scene from './../custom-classes/game-scene';
import Rocket from './../custom-classes/rocket';

export default Ember.Service.extend({

	me: Ember.inject.service('me'),
	gameState: Ember.inject.service('game-state'),

	scenes: {},

	init() {
		this._super();
		var mainMenu = Scene.create({
			name: 'mainMenu',
			game: this.get('gameState').get('game'),
			load: (stage) => {
				this.get('gameState').get('game').pause();
			    this.get('gameState').get('game').get('audio').stop('rocket.mp3');
				this.get('gameState').get('game').get('audio').stop('racing.mp3');
				this.get('gameState').set('showHud', true);

				this.get('gameState').resetRocketComponents();

				var rocket = Rocket.create({
					game: this.get('gameState').get('game'),
				});

				stage.insert(rocket);

				this.get('gameState').set('rocket', rocket);
			}
		});
		this.scenes.mainMenu = mainMenu;
	},

});
