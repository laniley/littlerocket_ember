import Ember from 'ember';
import Rocket from './../custom-classes/game-src/rocket';
import AsteroidMaker from './../custom-classes/game-src/asteroid-maker';
import StarMaker from './../custom-classes/game-src/star-maker';

export default Ember.Service.extend({

	me: Ember.inject.service('me'),
	gameRenderer: Ember.inject.service('game-render-service'),
	gameState: Ember.inject.service('game-state-service'),

	gameSceneObserver: Ember.observer('gameState.currentScene', function() {

		console.log('Loading scene "' + this.get('gameState.currentScene') + '"...');

		var canvas, rocket;

		/************** MAIN MENU **********************/
		if(this.get('gameState.currentScene') === 'mainMenu') {

			this.get('gameState').get('game').get('audio').stop('rocket.mp3');
			this.get('gameState').get('game').get('audio').stop('racing.mp3');

			this.get('gameState').set('isPaused', true);
			this.get('gameState').set('showMenu', true);
			this.get('gameState').set('showPauseMenu', false);
			this.get('gameState').set('showHud', true);

			this.get('gameState').resetRocketComponents();

			if(Ember.isEmpty(this.get('gameState.rocket'))) {
				canvas = this.get('gameRenderer');

				rocket = Rocket.create({
					game: this.get('gameState').get('game'),
					stage: canvas
				});

				canvas.insert(rocket);

				this.get('gameState').set('rocket', rocket);
			}
		}
		/************** TRACK ***********************/
		else if(this.get('gameState.currentScene') === 'track') {

			// this.get('gameState').get('game').get('audio').start('rocket.mp3');
			// this.get('gameState').get('game').get('audio').start('racing.mp3');

			this.get('gameState').set('isPaused', false);
			this.get('gameState').set('showMenu', false);
			this.get('gameState').set('showPauseMenu', true);
			this.get('gameState').set('showHud', true);

			if(Ember.isEmpty(this.get('gameState.rocket'))) {
				canvas = this.get('gameRenderer');

				rocket = Rocket.create({
					game: this.get('gameState').get('game'),
					stage: canvas
				});

				canvas.insert(rocket);

				this.get('gameState').set('rocket', rocket);
			}

			if(Ember.isEmpty(this.get('gameState.asteroidMaker'))) {
				canvas = this.get('gameRenderer');

				var asteroidMaker = AsteroidMaker.create({
					game: this.get('gameState').get('game'),
					stage: canvas
				});

				canvas.insert(asteroidMaker);

				this.get('gameState').set('asteroidMaker', asteroidMaker);
			}

			if(Ember.isEmpty(this.get('gameState.starMaker'))) {
				canvas = this.get('gameRenderer');

				var starMaker = StarMaker.create({
					game: this.get('gameState').get('game'),
					stage: canvas
				});

				canvas.insert(starMaker);

				this.get('gameState').set('starMaker', starMaker);
			}
		}
		else {
			if(this.get('gameState.currentScene') !== '') {
				console.error('There is no scene with the name "' + this.get('gameState.currentScene') + '". Define it in the game-scenes service!');
			}
		}
	}).on('init')

});
