import Ember from 'ember';

export default Ember.Service.extend({

	gameState: Ember.inject.service('game-state-service'),

	canvas: null,
	context: null,

	assets: [],
	objects: [],
	lists: {},
	index: {},
	removeList: [],
	grid: {},
	gridW: 400,
	gridH: 400,
	collisionLayers: [],
	sort: false,
	x: 0,
	y: 0,

	sprites: Ember.computed('objects.length', function() {
		return this.get('objects').filterBy('class', 'Sprite');
	}),

	// Needs to be separated out so the current stage can be set
    load() {
      	console.log('Loading stage...');
        this.get('scene').load();
    },

	/**
     	inserts an object into the stage
    */
    insert(object) {

		console.log('Inserting ' + object.get('name') + ' into stage...');

		this.get('objects').push(object);

		if(object.get('class') === 'Sprite') {

			object.set('grid', {});

			// Make sure we have a square of collision points
			//  	object.generateCollisionPoints();

			// 	if(object.p) {
			// 	this.index[itm.p.id] = itm;
			// 	}

			// this.regrid(object);

			object.render();
		}
    },

	render() {
		this.get('sprites').forEach(sprite => {
			sprite.render();
		});
	},

	/**
		Clear the canvas completely.
		If you want it cleared to a specific color - set `Q.clearColor` to that color
	*/
	clear() {
		if(this.get('clearColor')) {
			this.set('context.globalAlpha', 1);
			this.set('context.fillStyle', this.get('clearColor'));
			this.get('context').fillRect(0,0, this.get('gameState.width'), this.get('gameState.height'));
		}
		else {
			if(!Ember.isEmpty(this.get('context'))) {
				this.get('context').clearRect(0, 0, this.get('gameState.width'), this.get('gameState.height'));
			}
		}
	},

	step(dt) {
		// this.markSprites();
		this.updateObjects(dt);
    },

	// markSprites() {
		// console.log('markSprites');
		// var gameState = this.get('game.gameState');
		// var scale = 1;
		// var x = 0;
		// var y = 0;
		// var viewW = gameState.get('width') / scale;
		// var viewH = gameState.get('height') / scale;
		// var gridX1 = Math.floor(x / this.get('gridW'));
		// var gridY1 = Math.floor(y / this.get('gridH'));
		// var gridX2 = Math.floor((x + viewW) / this.get('gridW'));
		// var gridY2 = Math.floor((y + viewH) / this.get('gridH'));
		// var gridRow, gridBlock;

		// for(var iy = gridY1; iy <= gridY2; iy++) {
		// 	if(gridRow = this.get('grid')[iy]) {
		// 		for(var ix = gridX1; ix <= gridX2; ix++) {
		// 			if(gridBlock = gridRow[ix]) {
		// 				for(var id in gridBlock) {
		// 					if(this.get('index')[id]) {
		// 						this.get('index')[id].mark = this.get('time');
		// 						if(this.grt('index')[id].container) {
		// 							this.index[id].container.mark = this.get('time');
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }
    // },

	updateObjects(dt) {
		this.get('objects').forEach(object => {
	        object.update(dt);
			//   Q._generateCollisionPoints(item);
			//   this.regrid(item);
		});
    },

	// Add a sprite into the collision detection grid,
	// Ignore collision layers
	// regrid(sprite, skipAdd) {

		// if(sprite.collisionLayer) { return; }
		// sprite.grid = sprite.grid || {};
		//
		// var c = sprite.get('cPoints') || sprite.get('points');

	// 	var gridX1 = Math.floor((c.x - c.cx) / this.options.gridW),
	// 		gridY1 = Math.floor((c.y - c.cy) / this.options.gridH),
	// 		gridX2 = Math.floor((c.x - c.cx + c.w) / this.options.gridW),
	// 		gridY2 = Math.floor((c.y - c.cy + c.h) / this.options.gridH),
	// 		grid = item.grid;
	  //
	//   if(grid.X1 !== gridX1 || grid.X2 !== gridX2 ||
	// 	 grid.Y1 !== gridY1 || grid.Y2 !== gridY2) {
	  //
	// 	 if(grid.X1 !== void 0) { this.delGrid(item); }
	// 	 grid.X1 = gridX1;
	// 	 grid.X2 = gridX2;
	// 	 grid.Y1 = gridY1;
	// 	 grid.Y2 = gridY2;
	  //
	// 	 if(!skipAdd) { this.addGrid(item); }
	//   }
	// },


/*
 Q.Sprite.extend("TileLayer",{

 init: function(props) {
   this._super(props,{
 	tileW: 32,
 	tileH: 32,
 	blockTileW: 10,
 	blockTileH: 10,
 	type: 1,
 	renderAlways: true
   });
   if(this.p.dataAsset) {
 	this.load(this.p.dataAsset);
   }

   this.setDimensions();

   this.blocks = [];
   this.p.blockW = this.p.tileW * this.p.blockTileW;
   this.p.blockH = this.p.tileH * this.p.blockTileH;
   this.colBounds = {};
   this.directions = [ 'top','left','right','bottom'];
   this.tileProperties = {};

   this.collisionObject = {
 	p: {
 	  w: this.p.tileW,
 	  h: this.p.tileH,
 	  cx: this.p.tileW/2,
 	  cy: this.p.tileH/2
 	}
   };

   this.tileCollisionObjects = {};

   this.collisionNormal = { separate: []};

   this._generateCollisionObjects();
 },

 // Generate the tileCollisionObject overrides where needed
 _generateCollisionObjects: function() {
   var self = this;

   function returnPoint(pt) {
 	return [ pt[0] * self.p.tileW - self.p.tileW/2,
 			 pt[1] * self.p.tileH - self.p.tileH/2
 		   ];
   }

   if(this.sheet() && this.sheet().frameProperties) {
 	var frameProperties = this.sheet().frameProperties;
 	for(var k in frameProperties) {
 	  var colObj = this.tileCollisionObjects[k] = { p: Q._clone(this.collisionObject.p) };
 	  Q._extend(colObj.p,frameProperties[k]);

 	  if(colObj.p.points) {
 		colObj.p.points = Q._map(colObj.p.points, returnPoint);
 	  }

 	  this.tileCollisionObjects[k] = colObj;
 	}
   }

 },

 load: function(dataAsset) {
   var fileParts = dataAsset.split("."),
 	  fileExt = fileParts[fileParts.length-1].toLowerCase(),
 	  data;

   if (fileExt === "json") {
 	data = Q._isString(dataAsset) ?  Q.asset(dataAsset) : dataAsset;
   }
   else {
 	throw "file type not supported";
   }
   this.p.tiles = data;
 },

 setDimensions: function() {
   var tiles = this.p.tiles;

   if(tiles) {
 	this.p.rows = tiles.length;
 	this.p.cols = tiles[0].length;
 	this.p.w = this.p.cols * this.p.tileW;
 	this.p.h = this.p.rows * this.p.tileH;
   }
 },

 getTile: function(tileX,tileY) {
   return this.p.tiles[tileY] && this.p.tiles[tileY][tileX];
 },

 getTileProperty: function(tile, prop) {
   if(this.tileProperties[tile] !== undefined) {
 	return this.tileProperties[tile][prop];
   } else {
 	return;
   }
 },

 getTileProperties: function(tile) {
   if(this.tileProperties[tile] !== undefined) {
 	return this.tileProperties[tile];
   } else {
 	return {};
   }
 },

 getTilePropertyAt: function(tileX, tileY, prop) {
   return this.getTileProperty(this.getTile(tileX, tileY), prop);
 },

 getTilePropertiesAt: function(tileX, tileY) {
   return this.getTileProperties(this.getTile(tileX, tileY));
 },

 tileHasProperty: function(tile, prop) {
   return(this.getTileProperty(tile, prop) !== undefined);
 },

 setTile: function(x,y,tile) {
   var p = this.p,
 	  blockX = Math.floor(x/p.blockTileW),
 	  blockY = Math.floor(y/p.blockTileH);

   if(x >= 0 && x < this.p.cols &&
 	 y >= 0 && y < this.p.rows) {

 	this.p.tiles[y][x] = tile;

 	if(this.blocks[blockY]) {
 	  this.blocks[blockY][blockX] = null;
 	}
   }
 },

 tilePresent: function(tileX,tileY) {
   return this.p.tiles[tileY] && this.collidableTile(this.p.tiles[tileY][tileX]);
 },

 // Overload this method to draw tiles at frame 0 or not draw
 // tiles at higher number frames
 drawableTile: function(tileNum) {
   return tileNum > 0;
 },

 // Overload this method to control which tiles trigger a collision
 // (defaults to all tiles > number 0)
 collidableTile: function(tileNum) {
   return tileNum > 0;
 },

 getCollisionObject: function(tileX, tileY) {
   var p = this.p,
 	  tile = this.getTile(tileX, tileY),
 	  colObj;

   colObj = (this.tileCollisionObjects[tile] !== undefined) ?
 	this.tileCollisionObjects[tile] : this.collisionObject;

   colObj.p.x = tileX * p.tileW + p.x + p.tileW/2;
   colObj.p.y = tileY * p.tileH + p.y + p.tileH/2;

   return colObj;
 },

 collide: function(obj) {
   var p = this.p,
 	  objP = obj.c || obj.p,
 	  tileStartX = Math.floor((objP.x - objP.cx - p.x) / p.tileW),
 	  tileStartY = Math.floor((objP.y - objP.cy - p.y) / p.tileH),
 	  tileEndX =  Math.ceil((objP.x - objP.cx + objP.w - p.x) / p.tileW),
 	  tileEndY =  Math.ceil((objP.y - objP.cy + objP.h - p.y) / p.tileH),
 	  normal = this.collisionNormal,
 	  col, colObj;

   normal.collided = false;

   for(var tileY = tileStartY; tileY<=tileEndY; tileY++) {
 	for(var tileX = tileStartX; tileX<=tileEndX; tileX++) {
 	  if(this.tilePresent(tileX,tileY)) {
 		colObj = this.getCollisionObject(tileX, tileY);

 		col = Q.collision(obj,colObj);

 		if(col && col.magnitude > 0) {
 		  if(colObj.p.sensor) {
 			colObj.tile = this.getTile(tileX,tileY);
 			if(obj.trigger) {
 			  obj.trigger('sensor.tile',colObj);
 			}
 		  } else if(!normal.collided || normal.magnitude < col.magnitude ) {
 			 normal.collided = true;
 			 normal.separate[0] = col.separate[0];
 			 normal.separate[1] = col.separate[1];
 			 normal.magnitude = col.magnitude;
 			 normal.distance = col.distance;
 			 normal.normalX = col.normalX;
 			 normal.normalY = col.normalY;
 			 normal.tileX = tileX;
 			 normal.tileY = tileY;
 			 normal.tile = this.getTile(tileX,tileY);
 			 if(obj.p.collisions !== undefined) {
 			   obj.p.collisions.push(normal);
 			 }
 		  }
 		}
 	  }
 	}
   }

   return normal.collided ? normal : false;
 },

 prerenderBlock: function(blockX,blockY) {
   var p = this.p,
 	  tiles = p.tiles,
 	  sheet = this.sheet(),
 	  blockOffsetX = blockX*p.blockTileW,
 	  blockOffsetY = blockY*p.blockTileH;

   if(blockOffsetX < 0 || blockOffsetX >= this.p.cols ||
 	 blockOffsetY < 0 || blockOffsetY >= this.p.rows) {
 	   return;
   }

   var canvas = document.createElement('canvas'),
 	  ctx = canvas.getContext('2d');

   canvas.width = p.blockW;
   canvas.height= p.blockH;
   this.blocks[blockY] = this.blocks[blockY] || {};
   this.blocks[blockY][blockX] = canvas;

   for(var y=0;y<p.blockTileH;y++) {
 	if(tiles[y+blockOffsetY]) {
 	  for(var x=0;x<p.blockTileW;x++) {
 		if(this.drawableTile(tiles[y+blockOffsetY][x+blockOffsetX])) {
 		  sheet.draw(ctx,
 					 x*p.tileW,
 					 y*p.tileH,
 					 tiles[y+blockOffsetY][x+blockOffsetX]);
 		}
 	  }
 	}
   }
 },

 drawBlock: function(ctx, blockX, blockY) {
   var p = this.p,
 	  startX = Math.floor(blockX * p.blockW + p.x),
 	  startY = Math.floor(blockY * p.blockH + p.y);

   if(!this.blocks[blockY] || !this.blocks[blockY][blockX]) {
 	this.prerenderBlock(blockX,blockY);
   }

   if(this.blocks[blockY]  && this.blocks[blockY][blockX]) {
 	ctx.drawImage(this.blocks[blockY][blockX],startX,startY);
   }
 },

 draw: function(ctx) {
   var p = this.p,
 	  viewport = this.stage.viewport,
 	  scale = viewport ? viewport.scale : 1,
 	  x = viewport ? viewport.x : 0,
 	  y = viewport ? viewport.y : 0,
 	  viewW = Q.width / scale,
 	  viewH = Q.height / scale,
 	  startBlockX = Math.floor((x - p.x) / p.blockW),
 	  startBlockY = Math.floor((y - p.y) / p.blockH),
 	  endBlockX = Math.floor((x + viewW - p.x) / p.blockW),
 	  endBlockY = Math.floor((y + viewH - p.y) / p.blockH);

   for(var iy=startBlockY;iy<=endBlockY;iy++) {
 	for(var ix=startBlockX;ix<=endBlockX;ix++) {
 	  this.drawBlock(ctx,ix,iy);
 	}
   }
 }
  });
  */
});
