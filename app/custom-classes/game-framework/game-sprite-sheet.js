import Ember from 'ember';

const SpriteSheet = Ember.Object.extend({

	game: null,
	sprite: null, // the sprite this sheet belongs to
	sx: 0, // start x
   	sy: 0, // start y
	spacingX: 0, // spacing between each tile x (after 1st)
	spacingY: 0, // spacing between each tile y
	marginX: 0, // margin around each tile x
	marginY: 0, // margin around each tile y
	// number of rows
	rows: Ember.computed('sprite.h', 'sprite.tileH', function() {
		return Math.floor(this.get('sprite.h') / (this.get('sprite.tileH') + this.get('spacingY')));
	}),
	// number of columns per row
	cols: Ember.computed('sprite.w', 'sprite.tileW', function() {
		return Math.floor(this.get('sprite.w') / (this.get('sprite.tileW') + this.get('spacingX')));
	}),
	// number of frames
	frames: Ember.computed('rows', 'cols', function() {
		return this.get('rows') * this.get('cols');
	}),
	// Returns the starting x position of a single frame
    fx(frame) {
      	return Math.floor((frame % this.get('cols')) * (this.get('sprite.tileW') + this.get('spacingX')) + this.get('sx'));
    },
    // Returns the starting y position of a single frame
    fy(frame) {
      	return Math.floor(Math.floor(frame / this.get('cols')) * (this.get('sprite.tileH') + this.get('spacingY')) + this.get('sy'));
    },
    // Draw a single frame at x, y on the provided context
    draw: function(ctx, frame) {
		var asset = this.get('sprite.asset');
  		ctx.drawImage(
			asset, // the img to draw
            this.fx(frame), // starting x position of the frame in the asset
			this.fy(frame), // starting y position of the frame in the asset
            this.get('sprite.tileW'), // width of the frame in the asset
			this.get('sprite.tileH'), // height of the frame in the asset
            Math.floor(this.get('sprite.x_px')), // the x coordinate where to place the image on the canvas
			Math.floor(this.get('sprite.y')), // the y coordinate where to place the image on the canvas
            this.get('sprite.tileW'), // Optional. The width of the image to use (stretch or reduce the image)
			this.get('sprite.tileH') // Optional. The height of the image to use (stretch or reduce the image)
		);
    }
});

export default SpriteSheet;
