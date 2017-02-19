import Ember from 'ember';
import SpriteSheet from './../custom-classes/game-sprite-sheet';

const Sprite = Ember.Object.extend({

	game: null,

	type: '', // can be 'sprite', 'asset' or 'color'

	name: '',
	assetName: '',

	asset: Ember.computed('game.assets.length', function() {
		return this.get('game.assets')[this.get('assetName')];
	}),

	cPoints: null, // collision points in world coordinates
	matrix: null, // transformation matrix
	container: null,

	x: 0, // x location of the center
	y: 0, // y location of the center

	// width of the hole asset
	w: Ember.computed('asset', function() {
		return this.get('asset') ? this.get('asset').width : 0;
	}),
	// height of the hole asset
	h: Ember.computed('asset', function() {
		return this.get('asset') ? this.get('asset').height : 0;
	}),
	// collision points in object coordinates
    points: Ember.computed('w', 'h', function() {
		var halfW = this.get('w') / 2;
        var halfH = this.get('h') / 2;

      	return [
	        [ -halfW, -halfH ],
	        [  halfW, -halfH ],
	        [  halfW,  halfH ],
	        [ -halfW,  halfH ]
        ];
    }),

	tileW: 0, // width of one tile
	tileH: 0, // height of one tile

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

     	@method render
     	@for Sprite
     	@param {Context2D} ctx - context to render to
    */
    render(ctx) {

      	if(this.get('hidden')) {
		  	return;
	  	}
		// if no context has been provided as a parameter, get the default context of the game
      	if(!ctx) {
			ctx = this.get('game').get('context');
		}

		// this.trigger('predraw',ctx);
		ctx.save();

        if(this.get('opacity') !== void 0 && this.get('opacity') !== 1) {
          	ctx.globalAlpha = this.get('opacity');
        }

        this.get('matrix').setContextTransform(ctx);

        if(this.get('flip') !== "") {
			ctx.scale.apply(ctx,this._flipArgs[this.p.flip]);
		}

        // this.trigger('beforedraw',ctx);
        this.draw(ctx);
        // this.trigger('draw',ctx);

      	ctx.restore();

      	// Children set up their own complete matrix from the base stage matrix
      	if(this.get('sort')) {
			this.children.sort(this._sortChild);
		}
     //  	Q._invoke(this.children,"render",ctx);

     	// this.trigger('postdraw',ctx);

      	if(this.get('game').get('debug')) {
			this.debugRender(ctx);
		}

    },
	/**
     	Draw the asset on the stage. The context passed in is alreay transformed.
     	All you need to do is a draw the sprite centered at 0,0
    */
    draw: function(ctx) {
      	if(this.get('type') === 'sheet') {
        	this.getOrCreateSheet(this.get('sheet')).draw(ctx,-p.cx,-p.cy,p.frame);
      	}
		else if(this.get('type') === 'asset') {
        	ctx.drawImage(this.get('asset'),-p.cx,-p.cy);
      	}
		else if(this.get('color')) {
        	ctx.fillStyle = this.get('color');
        	ctx.fillRect(-p.cx,-p.cy,p.w,p.h);
      	}
    },
	debugRender(ctx) {
		var points = this.get('points');
		console.log(points);
      	ctx.save();
      	this.get('matrix').setContextTransform(ctx);
      	ctx.beginPath();
      	ctx.fillStyle = this.get('hit') ? "blue" : "red";
      	ctx.strokeStyle = "#FF0000";
      	ctx.fillStyle = "rgba(0,0,0,0.5)";

      	ctx.moveTo(points[0][0], points[0][1]);

	  	for(var i = 0; i < points.length; i++) {
        	ctx.lineTo(points[i][0], points[i][1]);
      	}

      	ctx.lineTo(points[0][0], points[0][1]);
      	ctx.stroke();

      	if(this.get('game').get('debugFill')) {
			ctx.fill();
		}

      	ctx.restore();

      	if(this.get('cPoints')) {
	        var c = this.get('cPoints');
	        ctx.save();
			ctx.globalAlpha = 1;
			ctx.lineWidth = 2;
			ctx.strokeStyle = "#FF00FF";
			ctx.beginPath();
			ctx.moveTo(c.x - c.cx,       c.y - c.cy);
			ctx.lineTo(c.x - c.cx + c.w, c.y - c.cy);
			ctx.lineTo(c.x - c.cx + c.w, c.y - c.cy + c.h);
			ctx.lineTo(c.x - c.cx      , c.y - c.cy + c.h);
			ctx.lineTo(c.x - c.cx,       c.y - c.cy);
			ctx.stroke();
	        ctx.restore();
      	}
    },
	/**
     	Generate a square set of `cPoints` on an object from the object transform matrix and `points`

     	`cPoints` represents the collision points of an sprite in world coordinates, scaled, rotated and taking into account any parent transforms.
    */
   	generateCollisionPoints() {

      	if(!this.get('matrix') && !this.get('refreshMatrix')) {
			return;
		}

      	if(Ember.isEmpty(this.get('cPoints'))) {
			this.set('cPoints', { points: [] } );
		}

      	var p = this.get('points'),
			c = this.get('cPoints');

  		if(
			!p.moved &&
     		c.origX === p.x &&
     		c.origY === p.y &&
     		c.origScale === p.scale &&
     		c.origScale === p.angle
		) {
      		return;
  		}

  		c.origX = p.x;
  		c.origY = p.y;
  		c.origScale = p.scale;
  		c.origAngle = p.angle;

  		this.refreshMatrix();

  		var i;
		var container = this.get('container');

		// Early out if we don't need to rotate / scale / deal with a container
  		if(Ember.isEmpty(container) && (!p.scale || p.scale === 1) && p.angle === 0) {
    		for(i=0; i < p.points.length; i++) {
      			c.points[i] = c.points[i] || [];
      			c.points[i][0] = p.x + p[i][0];
      			c.points[i][1] = p.y + p.points[i][1];
    		}
    		c.x = p.x; c.y = p.y;
    		c.cx = p.cx; c.cy = p.cy;
    		c.w = p.w; c.h = p.h;
    		return;
  		}
		else {
			container = this.get('container') || this.get('game').get('nullContainer');

			c.x = container.matrix.transformX(p.x,p.y);
	  		c.y = container.matrix.transformY(p.x,p.y);
	  		c.angle = p.angle + container.c.angle;
	  		c.scale = (container.c.scale || 1) * (p.scale || 1);

			var minX = Infinity,
	      		minY = Infinity,
	      		maxX = -Infinity,
	      		maxY = -Infinity;

			for(i=0; i<this.p.points.length;i++) {
	    		if(!this.c.points[i]) {
	      			this.c.points[i] = [];
	    		}

				this.matrix.transformArr(this.p.points[i],this.c.points[i]);

				var x = this.c.points[i][0],
		        	y = this.c.points[i][1];

				if(x < minX) { minX = x; }
		        if(x > maxX) { maxX = x; }
		        if(y < minY) { minY = y; }
		        if(y > maxY) { maxY = y; }

				if(minX === maxX) { maxX+=1; }
		      	if(minY === maxY) { maxY+=1; }

				c.cx = c.x - minX;
		      	c.cy = c.y - minY;

		      	c.w = maxX - minX;
		      	c.h = maxY - minY;
			}
		}
  	},
	/*
     	Regenerates this sprite's transformation matrix
    */
    refreshMatrix: function() {
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
	getOrCreateSheet(sheet) {
	  	if(!this.get('game').get('spriteSheeds')[sheet]) {
			return this.get('game').get('spriteSheeds')[sheet] = SpriteSheet.create({
				game: this.get('game'),
				asset: this.get('asset')
			});
	  	}
		else {
			return this.get('sheets')[name];
	  	}
	}
});

export default Sprite;
