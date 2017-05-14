//     Q.Asteroid.extend("ExplodingAsteroid", {
// 	init: function(p) {
// 		this._super(p, {
// 			name:   'ExplodingAsteroid',
// 			sheet:  'explodingAsteroid',
// 			sprite: 'explodingAsteroid', // name of the animation
// 			frame:  0,
// 			type:   Q.SPRITE_ASTEROID,
// 			collisionMask: Q.SPRITE_ROCKET | Q.SPRITE_BULLET,
// 			sensor: true,
// 			tileW:  200,
// 			tileH:  200,
//
// 			x:      ((Q.width - (200 * Q.state.get('scale'))) * Math.random()) + (100 * Q.state.get('scale')), // x location of the center of the sprite
// 			y:      0,
//
// 			scale: Q.state.get('scale'),
//       speedFactor: 1,
//       hitPoints: 3,
// 			points: [],
// 			isExploded: false
// 		});
//
// 		// collision points berechnen
// 		var radius = this.p.tileW / 4;
// 		var winkel = 0;
//
// 		for(var i = 0; i < 10; i++) {
// 			winkel += (Math.PI * 2) / 10;
//
// 			var x = Math.floor(Math.sin(winkel) * radius);
// 			var y = Math.floor(Math.cos(winkel) * radius);
//
// 			this.p.points.push([x, y]);
// 		}
//
// 		this.on("sensor");
// 		this.on('exploded', this, 'destroy');
//
// 		this.add("2d, asteroidControls, animation");
// 	},

//
// 	if(this.entity.isA('ExplodingAsteroid')	&& p.y > (Q.height * 0.75) && p.isExploded === false) {
// 	p.isExploded = true;
// 		Q.audio.play('explosion.mp3');
// 		this.entity.explode();
// 	}
// }


//
// 	explode: function() {
//     var winkel = 0;
//     var radiusStart = this.p.tileW / 4;
//     var radiusEnd = this.p.tileW / 2;
//
//     for(var radius = radiusStart; radius < radiusEnd; radius++) {
//       this.p.point = [];
//       for(var i = 0; i < 10; i++) {
//   			winkel += (Math.PI * 2) / 10;
//
//   			var x = Math.floor(Math.sin(winkel) * radius);
//   			var y = Math.floor(Math.cos(winkel) * radius);
//
//   			this.p.points.push([x, y]);
//   		}
//     }
//
//     this.play('explosion');
// 	}
// });
