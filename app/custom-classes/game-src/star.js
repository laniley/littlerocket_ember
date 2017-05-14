import Ember from 'ember';
import TrackObject from './track-object';

const Star = TrackObject.extend({

	name: 'Star',
	assetName: 'star.png',

	tileW: 50,
	tileH: 50,

	// When a star is hit..
	// sensor: function(colObj) {
	//    // Collision with rocket
	//    if(colObj.isA('Rocket') && !this.p.collided) {
	// 	 this.p.collided = true;
	// 	 // Play sound
	// 	 Q.audio.play('collecting_a_star.mp3');
	//
	// 	 // Destroy it and count up score
	// 	 self.get('gameState').set('stars', self.get('gameState').get('stars') + 1);
	//
	// 	 this.destroy();
	//    }
	// },

});

export default Star;
