import Ember from 'ember';
import HF from './../custom-classes/helper-functions';

const SpriteSheet = Ember.Object.extend({

	game: null,
	name: '',
	asset: null,
	options: null,
	tileW: 0, // tile width
	tileH: 0, // tile height
	sx: 0, // start x
   	sy: 0, // start y
	spacingX: 0, // spacing between each tile x (after 1st)
	spacingY: 0, // spacing between each tile y
	marginX: 0, // margin around each tile x
	marginY: 0, // margin around each tile y
	cols: 0, // number of columns per row

    init: function(options) {
      	if(!this.get('game').get('assets')[this.get('asset')]) {
		  	throw "Invalid Asset:" + this.get('asset');
	  	}
      	HF.extend(this, {
        name: name,
        asset: asset,
        tileW: 64,
        tileH: 64,
        sx: 0,
        sy: 0,
        spacingX: 0,
        spacingY: 0,
        frameProperties: {}
        });
      if(options) { Q._extend(this,options); }

      this.cols = this.cols ||
                  Math.floor(this.w / (this.tileW + this.spacingX));

      this.frames = this.cols * (Math.floor(this.h/(this.tileH + this.spacingY)));
    },
});

export default SpriteSheet;
