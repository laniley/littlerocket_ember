import Ember from 'ember';
import Star from './star';

const StarMaker = Ember.Object.extend({

	class: 'Object',

	name: 'Star Maker',

	launchRandomFactor: 0.6,
	launch: 1,
	isActive: 1,
	counter: 0,

	launchDelay: Ember.computed('game.gameState.speed', 'game.gameState.max_speed', function() {
		return (this.get('game.gameState.speed') / this.get('game.gameState.max_speed')) * 0.3;
	}),

	init() {
		this._super();
	},

 	update(dt) {

		this.set('launch', this.get('launch') - dt);

		if(!this.get('game.gameState.isPaused') && this.get('isActive') && this.get('launch') < 0) {

			var counter = this.get('counter') + 1;

			var star = Star.create({
				name: 'Star ' + counter,
				game: this.get('game'),
				stage: this.get('stage'),
			});
  			this.get('stage').insert(star);
			this.set('counter', counter);
			this.set('launch', this.get('launchDelay') + this.get('launchRandomFactor') * Math.random());
		}
 	}

});

export default StarMaker;
