import Ember from 'ember';
import Scene from './../custom-classes/game-scene';
import Rocket from './../custom-classes/rocket';

export default Ember.Service.extend({

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

			// 	self.get('gameState').resetRocketComponents();

				var rocket = Rocket.create({
					game: this.get('gameState').get('game')
				});

				stage.insert(rocket);
			//
			// 	if(!Ember.isEmpty(self.get('rocket').get('cannon'))) {
			// 	    var cannon = new Q.Cannon();
			// 	    cannon.setRocket(rocket);
			// 	    rocket.setCannon(cannon);
			// 	    stage.insert(cannon);
			// 	}
			// 	if(!Ember.isEmpty(self.get('rocket').get('shield'))) {
			// 	    var shield = new Q.Shield();
			// 	    shield.setRocket(rocket);
			// 	    rocket.setShield(shield);
			// 	    stage.insert(shield);
			// 	}
			// 	if(!Ember.isEmpty(self.get('rocket').get('engine'))) {
			// 	    var engine = new Q.Engine();
			// 	    engine.setRocket(rocket);
			// 	    rocket.setShield(engine);
			// 	    stage.insert(engine);
			// 	}
			// 	var decoration = new Q.Decoration();
			// 	decoration.setRocket(rocket);
			// 	rocket.setDecoration(decoration);
			// 	rocket.p.stage.insert(decoration);
		    // });
			}
		});
		this.scenes.mainMenu = mainMenu;
	},

});
