import Ember from 'ember';
import TrackObject from './track-object';

const Asteroid = TrackObject.extend({

	name: 'Asteroid',
	assetName: 'asteroid.png',

	tileW:  70,
	tileH:  70,

    // collision points
	points: Ember.computed('tileW', function() {
		var points = [];
		var radius = this.get('tileW') / 2 - 3;
	    var winkel = 0;

	    for(var i = 0; i < 10; i++) {
	        winkel += (Math.PI * 2) / 10;

	        var x = Math.floor(Math.sin(winkel) * radius);
	        var y = Math.floor(Math.cos(winkel) * radius);

	        points.push([x, y]);
	    }

		return points;
	}),

	// When an asteroid is hit..
	// sensor: function(colObj) {
	//   // Destroy it
	//   if(colObj.isA('Rocket') && !colObj.collided && !this.collided) {
	// 	this.collided = true;
	// 	colObj.trigger('collided');
	//   }
	//   else if(colObj.isA('Bullet') && !colObj.collided) {
	// 	colObj.collided = true;
	// 	colObj.destroy();
	//   }
	//
	//   Q.audio.play('explosion.mp3');
	//   this.destroy();
	// }
});

export default Asteroid;
