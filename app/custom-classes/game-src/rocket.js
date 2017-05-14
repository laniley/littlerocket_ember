import Ember from 'ember';
import DS from 'ember-data';
import Sprite2DControllable from './../game-framework/game-rendering-engine/game-sprite-2d-controllable';
import Cannon from './cannon';
import Shield from './shield';
import Engine from './engine';

const Rocket = Sprite2DControllable.extend({

	name: 'Rocket',
	type: 'sheet',
	assetName: 'rocket.png',
	controlType: 'step',
	// do not allow rocket to leave the screen
	canLeaveTheViewport: false,

	model: Ember.computed('game.gameState.me.user.rocket', function() {
		return DS.PromiseObject.create({
	      	promise: this.get('game.gameState.me.user').then(user => {
				return user.get('rocket').then(rocket => {
					return rocket;
				});
			})
		});
	}),

	children: [],

	tileW: 50,
	tileH: 140,

	x: 0,
	y: Ember.computed('game.gameState.height', function() {
		var canvasH = this.get('game.gameState.height');
		var paddingBottom = (canvasH / 100 * 5);
		return Math.floor(canvasH - this.get('tileH') - paddingBottom);
	}),
	// the shape of the rocket in coordinates
	// needed for collision detection
	points: Ember.computed('tileW', 'tileH', function() {
		var halfW = this.get('tileW') / 2;
        var halfH = this.get('tileH') / 2;
		return [
			// links, halb oben
			[-halfW, -20],
			// Raketenspitze
			[0, -halfH],
			// rechts, halb oben
			[halfW, -20],
			// rechts, halb unten
			[halfW, 5],
			// Antriebsdüse rechts
			[10, 20],
			// rechts, unten
			[halfW, -35 + halfH],
			// mitte unten
			[0, -30 + halfH],
			// links, unten
			[-halfW, -35 + halfH],
			// Antriebsdüse links
			[-10, 20],
			// links, halb oben
			[-halfW, 5]
		];
	}),

	cannon: null,
	shield: null,
	engine: null,

	speed: 100,

	flownDisanceOfCurrentParsec: 0,

	init() {

		this._super();

		var halfCanvasW = this.get('game.gameState.width') / 2;
		var halfTileW = this.get('tileW') / 2;
		this.set('x', Math.floor(halfCanvasW - halfTileW));

		var cannon = Cannon.create({
			stage: this.get('stage'),
			rocket: this
		});
		this.set('cannon', cannon);
		this.get('children').push(cannon);

		var shield = Shield.create({
			stage: this.get('stage'),
			rocket: this
		});
		this.set('shield', shield);
		this.get('children').push(shield);

		var engine = Engine.create({
			stage: this.get('stage'),
			rocket: this
		});
		this.set('engine', engine);
		this.get('children').push(engine);

		// 	var decoration = new Q.Decoration();
		// 	decoration.setRocket(rocket);
		// 	rocket.setDecoration(decoration);
		// 	rocket.p.stage.insert(decoration);
		// });
	},

	step: function(dt) {

		this._super(dt);

		this.set('flownDisanceOfCurrentParsec', this.get('flownDisanceOfCurrentParsec') + (dt * this.get('speed')));

		if(this.get('flownDisanceOfCurrentParsec') > 1000) {
			this.set('game.gameState.distance_to_goal', this.get('game.gameState.distance_to_goal') - 1);
			this.set('flownDisanceOfCurrentParsec', 0);
		}

		/*
			rotate the rocket based on the velocity
		*/
		// nach rechts drehen
		// if(this.get('vx') > 0 && this.get('angle') < 45) {
		// 	this.rotate(this.get('angle') + 5);
		// }
		// nach links drehen
		// else if(this.get('vx') < 0 && this.get('angle') > -45) {
		// 	this.rotate(this.get('angle') - 5);
		// }
		// else if(this.get('vx') === 0) {
		// 	if(this.get('angle') > 0) {
		// 		if(this.get('angle') - 5 < 0) {
		// 			this.rotate(0);
		// 		}
		// 		else {
		// 			this.rotate(this.get('angle') - 5);
		// 		}
		// 	}
		// 	else {
		// 		if(this.get('angle') + 5 > 0) {
		// 			this.rotate(0);
		// 		}
		// 		else {
		// 			this.rotate(this.get('angle') + 5);
		// 		}
		// 	}
		// }

		// fire Cannon
		// if(Q.inputs['up'] && this.p.hasACannon) {
		// 	this.trigger("fireCannon");
		// }

		// slowdown
		// if(Q.inputs['down']) {
		// 	this.trigger("slowdown");
		// }
	},
});

export default Rocket;
