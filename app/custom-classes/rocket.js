import Ember from 'ember';
import Sprite from './../custom-classes/game-sprite';

const Rocket = Sprite.extend({

	name: 'Rocket',
	type: 'sheet',
	assetName: 'rocket.png',

	tileW: 50,
	tileH: 140,

	x: Ember.computed('game.gameState.width', function() {
		var halfCanvasW = this.get('game.gameState.width') / 2;
		var halfTileW = this.get('tileW') / 2;
		return Math.floor(halfCanvasW - halfTileW);
	}),
	y: Ember.computed('game.gameState.height', function() {
		var canvasH = this.get('game.gameState.height');
		var paddingBottom = (canvasH / 100 * 5);
		return Math.floor(canvasH - this.get('tileH') - paddingBottom);
	}),

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
	})
});

export default Rocket;
