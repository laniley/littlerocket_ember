import Ember from 'ember';
import GameObject from './game-object';
import SpriteSheet from './game-sprite-sheet';

const Sprite = GameObject.extend({

	class: 'Sprite',

	game: null,

	type: '', // can be 'sheet', 'asset' or 'color'

	name: '',
	assetName: '',
	asset: Ember.computed('game.assets.length', function() {
		return this.get('game.assets')[this.get('assetName')];
	}),

	model: null, // the belonging Ember Model

	children: [],

	matrix: null, // transformation matrix
	container: null,
	// x and y define the top left corner of the sprite
	x: 0, // x location of the sprite
	y: 0, // y location of the sprite

	x_percent: Ember.computed('x', function() {
		return this.get('x') / this.get('game.gameState.width');
	}),

	// x location of the sprite - scaled
	x_px: Ember.computed('x_percent', 'game.gameState.width', function() {
		return this.get('game.gameState.width') * this.get('x_percent');
	}),
	// cx and cy define the center of the sprite
	// it will rotate around that point per default
	cx: Ember.computed('x_px', function() {
		return this.get('x_px') + (this.get('tileW') / 2);
	}),
	cy: Ember.computed('y', function() {
		return this.get('y') + (this.get('tileH') / 2);
	}),
	// width of the hole asset
	w: Ember.computed('asset', function() {
		return this.get('asset') ? this.get('asset').width : 0;
	}),
	// height of the hole asset
	h: Ember.computed('asset', function() {
		return this.get('asset') ? this.get('asset').height : 0;
	}),
	// default width of one tile
	tileW: Ember.computed('w', function() {
		return this.get('w');
	}),
	// default height of one tile
	tileH: Ember.computed('h', function() {
		return this.get('asset');
	}),
	// default object coordinates - a simple rectangle
	// can be overriden on object level to better fit the precise form ob the object
	// used for collision detection
    points: Ember.computed('x_px', 'y', 'tileW', 'tileH', function() {
		var halfW = this.get('tileW') / 2;
        var halfH = this.get('tileH') / 2;

      	return [
	        [ -halfW, -halfH ],
	        [ halfW, -halfH ],
	        [ halfW, halfH ],
	        [ -halfW, halfH ]
        ];
    }),

	collisions: [],

	frame: 0, // first frame which will be rendered

	angle: 0, // amount of rotation
	opacity: 1,

	hidden: false, // set to true to hide the sprite
	flip: "", // set to "x", "y", or "xy" to flip sprite over that dimension
	sort: false, // set to true to force children to be sorted by their z-index,

	init() {
		this._super();
		this.set('matrix', this.get('game').get('matrix2d'));
	},
	/**
     	Default render method for the sprite.
		Don't overload this unless you want to handle all the transform and scale stuff yourself.
		Rather overload the `draw` method.
    */
    render() {
		// do not render if hidden is true
      	if(this.get('hidden')) {
		  	return;
	  	}
		else {
			// get the context of the game
	      	var ctx = this.get('game').get('context');

			ctx.save();

	        if(this.get('opacity') !== void 0 && this.get('opacity') !== 1) {
	          	ctx.globalAlpha = this.get('opacity');
	        }

	        this.get('matrix').setContextTransform(ctx);

	        if(this.get('flip') !== "") {
				ctx.scale.apply(ctx,this._flipArgs[this.p.flip]);
			}

	        this.draw(ctx);

	      	ctx.restore();

			this.get('children').forEach(child => {
				child.render();
			});

			if(this.get('game.debug')) {
				this.debugRender(ctx);
			}
		}
    },
	/**
     	Draw the asset on the stage. The context passed in is alreay transformed.
     	All you need to do is draw the sprite
    */
    draw(ctx) {
      	if(this.get('type') === 'sheet') {
			var spriteSheed = this.getOrCreateSheet(this.get('sheet'));
        	spriteSheed.draw(ctx, this.get('frame'));
      	}
		else if(this.get('type') === 'asset') {
        	ctx.drawImage(this.get('asset'), this.get('x_px'), this.get('y'));
      	}
		else if(this.get('color')) {
        	ctx.fillStyle = this.get('color');
        	ctx.fillRect(this.get('x_px'), this.get('y'), this.get('w'), this.get('h'));
      	}
		else {
			console.error('The provided sprite type "' + this.get('type') + '" does not match one of the allowed types [sheet, asset, color]');
		}
    },

	debugRender(ctx) {
		// draw object points
		this.debugRenderObjectPoints(ctx);
    },

	debugRenderObjectPoints(ctx) {
		var points = this.get('points');

		if(points.length > 0) {
			var cx = this.get('cx'),
				cy = this.get('cy');

	      	ctx.save();
	      	this.get('matrix').setContextTransform(ctx);
	      	ctx.beginPath();
	      	ctx.fillStyle = this.get('hit') ? "blue" : "red";
	      	ctx.strokeStyle = "#FF0000";
	      	ctx.fillStyle = "rgba(0,0,0,0.5)";

	      	ctx.moveTo(cx + points[0][0], cy + points[0][1]);

		  	for(var i = 0; i < points.length; i++) {
	        	ctx.lineTo(cx + points[i][0], cy + points[i][1]);
	      	}

	      	ctx.lineTo(cx + points[0][0], cy + points[0][1]);
	      	ctx.stroke();

	      	if(this.get('game').get('debugFill')) {
				ctx.fill();
			}

	      	ctx.restore();
		}
	},
	/**
     	Generate a square set of `cPoints` on an object from the object transform matrix and `points`

     	`cPoints` represents the collision points of an sprite in world coordinates, scaled, rotated and taking into account any parent transforms.
    */
 //   	generateCollisionPoints() {
	//
    //   	if(!this.get('matrix') && !this.get('refreshMatrix')) {
	// 		return;
	// 	}
	//
    //   	var p = this.get('points');
	//
 //  		if(
	// 		!p.moved &&
    //  		c.origX === p.x_px &&
    //  		c.origY === p.y &&
    //  		c.origScale === p.scale &&
    //  		c.origScale === p.angle
	// 	) {
    //   		return;
 //  		}
	//
 //  		c.origX = p.x_px;
 //  		c.origY = p.y;
 //  		c.origScale = p.scale;
 //  		c.origAngle = p.angle;
	//
 //  		this.refreshMatrix();
	//
 //  		var i;
	// 	var container = this.get('container');
	//
	// 	// Early out if we don't need to rotate / scale / deal with a container
 //  		if(Ember.isEmpty(container) && (!p.scale || p.scale === 1) && p.angle === 0) {
    // 		for(i=0; i < p.points.length; i++) {
    //   			c.points[i] = c.points[i] || [];
    //   			c.points[i][0] = p.x_px + p[i][0];
    //   			c.points[i][1] = p.y + p.points[i][1];
    // 		}
    // 		c.x_px = p.x_px; c.y = p.y;
    // 		c.cx = p.cx; c.cy = p.cy;
    // 		c.w = p.w; c.h = p.h;
    // 		return;
 //  		}
	// 	else {
	// 		container = this.get('container') || this.get('game').get('nullContainer');
	//
	// 		c.x_px = container.matrix.transformX(p.x_px,p.y);
	//   		c.y = container.matrix.transformY(p.x_px,p.y);
	//   		c.angle = p.angle + container.c.angle;
	//   		c.scale = (container.c.scale || 1) * (p.scale || 1);
	//
	// 		var minX = Infinity,
	//       		minY = Infinity,
	//       		maxX = -Infinity,
	//       		maxY = -Infinity;
	//
	// 		for(i=0; i<this.p.points.length;i++) {
	//     		if(!this.c.points[i]) {
	//       			this.c.points[i] = [];
	//     		}
	//
	// 			this.matrix.transformArr(this.p.points[i],this.c.points[i]);
	//
	// 			var x = this.c.points[i][0],
	// 	        	y = this.c.points[i][1];
	//
	// 			if(x < minX) { minX = x; }
	// 	        if(x > maxX) { maxX = x; }
	// 	        if(y < minY) { minY = y; }
	// 	        if(y > maxY) { maxY = y; }
	//
	// 			if(minX === maxX) { maxX+=1; }
	// 	      	if(minY === maxY) { maxY+=1; }
	//
	// 			c.cx = c.x - minX;
	// 	      	c.cy = c.y - minY;
	//
	// 	      	c.w = maxX - minX;
	// 	      	c.h = maxY - minY;
	// 		}
	// 	}
 //  	},
	/*
     	Regenerates this sprite's transformation matrix
    */
    refreshMatrix() {
      	var p = this.get('points');
      	var matrix = this.get('matrix').identity();

      	if(this.get('container')) {
			matrix.multiply(this.get('container').matrix);
		}

      	matrix.translate(p.x,p.y);

      	if(p.scale) {
		  	matrix.scale(p.scale,p.scale);
	  	}

      	matrix.rotateDeg(p.angle);
  	},

	rotate(degree) {
       this.set('angle', degree);
	},
	/**
	 	Return a `SpriteSheet` or  create a new one

	 	@param {String} name - name of sheet to return or create
	 	@param {String} [asset] - if provided, will create a sprite sheet using this asset
	*/
	getOrCreateSheet() {

		var sheet = this.get('name');

	  	if(!this.get('game').get('spriteSheeds')[sheet]) {
			return this.get('game').get('spriteSheeds')[sheet] = SpriteSheet.create({
				game: this.get('game'),
				sprite: this
			});
	  	}
		else {
			return this.get('game').get('spriteSheeds')[sheet];
	  	}
	},
	/**
		Update method is called each step with the time elapsed since the last step.

		Doesn't do anything other than trigger events, call a `step` method if defined
		and run update on all its children.

		Generally leave this method alone and define a `step` method that will be called
    */
    update(dt) {

		this.step(dt);

      	this.refreshMatrix();

      	// Reset collisions if we're tracking them
      	if(this.get('collisions')) {
			this.set('collisions', []);
		}
    },
});

export default Sprite;