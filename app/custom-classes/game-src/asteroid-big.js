//
// Q.Asteroid.extend("BigAsteroid", {
// init: function(p) {
// 	this._super(p, {
// 		name:   'BigAsteroid',
// 		sheet:  'bigAsteroid',
// 		sprite: 'bigAsteroid', // name of the animation
// 		frame:  0,
// 		type:   Q.SPRITE_ASTEROID,
// 		collisionMask: Q.SPRITE_ROCKET | Q.SPRITE_BULLET,
// 		sensor: true,
// 		tileW:  100,
// 		tileH:  100,
//
// 		x:      ((Q.width - (200 * Q.state.get('scale'))) * Math.random()) + (100 * Q.state.get('scale')), // x location of the center of the sprite
// 		y:      0,
//
// 		scale: Q.state.get('scale'),
// 		points: [],
//   speedFactor: 0.8,
//   hitPoints: 2,
// 		isExploded: false
// 	});
//
// 	// collision points berechnen
// 	var radius = this.p.tileW / 2;
// 	var winkel = 0;
//
// 	for(var i = 0; i < 10; i++) {
// 		winkel += (Math.PI * 2) / 10;
//
// 		var x = Math.floor(Math.sin(winkel) * radius);
// 		var y = Math.floor(Math.cos(winkel) * radius);
//
// 		this.p.points.push([x, y]);
// 	}
//
// 	this.add("2d, asteroidControls, animation");
// },
//
// explode: function() {
// 	this.play('explosion');
// }
// });
