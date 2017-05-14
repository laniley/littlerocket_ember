//
// Q.Asteroid.extend("FastAsteroid", {
//     init: function(p) {
// 	this._super(p, {
// 		name:   'FastAsteroid',
// 		sheet:  'asteroid',
// 		type:   Q.SPRITE_ASTEROID,
// 		collisionMask: Q.SPRITE_ROCKET | Q.SPRITE_BULLET,
// 		sensor: true,
// 		x:      ((Q.width - (70 * Q.state.get('scale'))) * Math.random()) + (35 * Q.state.get('scale')),
// 		y:      0,
// 		tileW:  70,
// 		tileH:  70,
// 		scale: Q.state.get('scale'),
//   speedFactor: 2,
//   hitPoints: 1,
// 		points: []
// 	});
//
// 	// collision points berechnen
// 	var radius = this.p.tileW / 2 - 3;
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
// 	this.on("sensor");
//
// 	this.add("2d, asteroidControls");
// }
// });
