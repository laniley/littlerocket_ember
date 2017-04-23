import Ember from 'ember';

const Stage = Ember.Object.extend({

	scene: null,
	assets: [],
	items: [],
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
	time: 0,

	// gameState: Ember.computed('scene.game.gameState', function() {
	// 	return this.get('scene.game.gameState');
	// }),

	// Needs to be separated out so the current stage can be set
    load() {
      	if(this.get('scene'))  {
			console.log('Loading scene "' + this.get('scene').name + '"...');
        	this.get('scene').load(this);
      	}
    },

	/**
     	inserts an item into the scene, or inside a container
    */
    insert: function(itm/*, container*/) {
      	this.get('items').push(itm);
		itm.get('stages').push(this);
		//   	itm.stage = this;
		//   	itm.container = container;
		//   	if(container) {
		//     		container.children.push(itm);
		//   	}
		//
		//   	itm.grid = {};
		//
      	// Make sure we have a square of collision points
      	itm.generateCollisionPoints();
		//
		//   	if(itm.className) {
		// 		this.addToList(itm.className, itm);
		// 	}
		//   	if(itm.activeComponents) {
		// 		this.addToLists(itm.activeComponents, itm);
		// 	}
		//
		//   	if(itm.p) {
		//     	this.index[itm.p.id] = itm;
		//   	}
		//  //  	this.trigger('inserted',itm);
		//  //  	itm.trigger('inserted',this);
		//
		//  //  	this.regrid(itm);
		//   	return itm;
		itm.render();
    },
	render() {
		this.get('items').forEach(itm => {
			itm.render();
		});
	},
	clear() {
		this.get('items').forEach(itm => {
			itm.destroy();
		});
	},
	step(dt) {
		if(this.get('gameState.isPaused') || !this.get('scene.game.gameState')) {
			return false;
		}
		else {
			this.set('time', this.get('time') + dt);

			this.markSprites();
			// this.updateSprites(this.items, dt);
			//
			// if(this.removeList.length > 0) {
			// 	for(var i=0,len=this.removeList.length;i<len;i++) {
			// 	  this.forceRemove(this.removeList[i]);
			// 	}
			// 	this.removeList.length = 0;
			// }
		}
    },

	markSprites() {
		var gameState = this.get('scene.game.gameState');
		// var viewport = this.get('viewport'),
		// 	scale = viewport ? viewport.scale : 1,
		// 	x = viewport ? viewport.x : 0,
		// 	y = viewport ? viewport.y : 0,
		// 	viewW = gameState.get('width') / scale,
		// 	viewH = gameState.get('height') / scale,
		// 	gridX1 = Math.floor(x / this.get('gridW')),
		// 	gridY1 = Math.floor(y / this.get('gridH')),
		// 	gridX2 = Math.floor((x + viewW) / this.get('gridW')),
		// 	gridY2 = Math.floor((y + viewH) / this.get('gridH')),
		// 	gridRow, gridBlock;
		//
		// for(var iy=gridY1; iy<=gridY2; iy++) {
		// 	if((gridRow = this.grid[iy])) {
		// 		for(var ix=gridX1; ix<=gridX2; ix++) {
		// 			if((gridBlock = gridRow[ix])) {
		// 				for(var id in gridBlock) {
		// 					if(this.index[id]) {
		// 						this.index[id].mark = time;
		// 						if(this.index[id].container) {
		// 							this.index[id].container.mark = time;
		// 						}
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// }
    },

  // .component('viewport',
  //
  // added: function() {
  // 	this.x = 0;
  // 	this.y = 0;
  // 	this.offsetX = 0;
  // 	this.offsetY = 0;
  // 	this.centerX = Q.width/2;
  // 	this.centerY = Q.height/2;
  // 	this.scale = 1;
  // },
  //
  // xtend: {
  //  follow: function(sprite,directions,boundingBox) {
  // this.off('poststep',this.viewport,'follow');
  // this.viewport.directions = directions || { x: true, y: true };
  // this.viewport.following = sprite;
  // this.viewport.boundingBox = boundingBox;
  // this.on('poststep',this.viewport,'follow');
  // this.viewport.follow(true);
  //  },
  //
  //  unfollow: function() {
  // this.off('poststep',this.viewport,'follow');
  //  },
  //
  //  centerOn: function(x,y) {
  // this.viewport.centerOn(x,y);
  //  },
  //
  //  moveTo: function(x,y) {
  // return this.viewport.moveTo(x,y);
  //  }
  // ,
  //
  // ollow: function(first) {
  //  var followX = Q._isFunction(this.directions.x) ? this.directions.x(this.following) : this.directions.x;
  //  var followY = Q._isFunction(this.directions.y) ? this.directions.y(this.following) : this.directions.y;
  //
  //  this[first === true ? 'centerOn' : 'softCenterOn'](
  // 			followX ?
  // 			  this.following.p.x + this.following.p.w/2 - this.offsetX :
  // 			  undefined,
  // 			followY ?
  // 			 this.following.p.y + this.following.p.h/2 - this.offsetY :
  // 			 undefined
  // 		  );
  // ,
  //
  // ffset: function(x,y) {
  //  this.offsetX = x;
  //  this.offsetY = y;
  // ,
  //
  // oftCenterOn: function(x,y) {
  //  if(x !== void 0) {
  // var dx = (x - Q.width / 2 / this.scale - this.x)/3;
  // if(this.boundingBox) {
  //   if(this.x + dx < this.boundingBox.minX) {
  // 	this.x = this.boundingBox.minX / this.scale;
  //   }
  //   else if(this.x + dx > (this.boundingBox.maxX - Q.width) / this.scale) {
  // 	this.x = (this.boundingBox.maxX - Q.width) / this.scale;
  //   }
  //   else {
  // 	this.x += dx;
  //   }
  // }
  // else {
  //   this.x += dx;
  // }
  //  }
  //  if(y !== void 0) {
  // var dy = (y - Q.height / 2 / this.scale - this.y)/3;
  // if(this.boundingBox) {
  //   if(this.y + dy < this.boundingBox.minY) {
  // 	this.y = this.boundingBox.minY / this.scale;
  //   }
  //   else if(this.y + dy > (this.boundingBox.maxY - Q.height) / this.scale) {
  // 	this.y = (this.boundingBox.maxY - Q.height) / this.scale;
  //   }
  //   else {
  // 	this.y += dy;
  //   }
  // }
  // else {
  //   this.y += dy;
  // }
  //  }
  //
  // ,
  // enterOn: function(x,y) {
  //  if(x !== void 0) {
  // this.x = x - Q.width / 2 / this.scale;
  //  }
  //  if(y !== void 0) {
  // this.y = y - Q.height / 2 / this.scale;
  //  }
  //
  // ,
  //
  // oveTo: function(x,y) {
  //  if(x !== void 0) {
  // this.x = x;
  //  }
  //  if(y !== void 0) {
  // this.y = y;
  //  }
  //  return this.entity;
  //
  // ,
  //
  // rerender: function() {
  //  this.centerX = this.x + Q.width / 2 /this.scale;
  //  this.centerY = this.y + Q.height / 2 /this.scale;
  //  Q.ctx.save();
  //  Q.ctx.translate(Math.floor(Q.width/2),Math.floor(Q.height/2));
  //  Q.ctx.scale(this.scale,this.scale);
  //  Q.ctx.translate(-Math.floor(this.centerX), -Math.floor(this.centerY));
  // ,
  //
  // ostrender: function() {
  //  Q.ctx.restore();
  //
  // });


 // Q.Sprite.extend("TileLayer",{
 //
 // init: function(props) {
 //   this._super(props,{
 // 	tileW: 32,
 // 	tileH: 32,
 // 	blockTileW: 10,
 // 	blockTileH: 10,
 // 	type: 1,
 // 	renderAlways: true
 //   });
 //   if(this.p.dataAsset) {
 // 	this.load(this.p.dataAsset);
 //   }
 //
 //   this.setDimensions();
 //
 //   this.blocks = [];
 //   this.p.blockW = this.p.tileW * this.p.blockTileW;
 //   this.p.blockH = this.p.tileH * this.p.blockTileH;
 //   this.colBounds = {};
 //   this.directions = [ 'top','left','right','bottom'];
 //   this.tileProperties = {};
 //
 //   this.collisionObject = {
 // 	p: {
 // 	  w: this.p.tileW,
 // 	  h: this.p.tileH,
 // 	  cx: this.p.tileW/2,
 // 	  cy: this.p.tileH/2
 // 	}
 //   };
 //
 //   this.tileCollisionObjects = {};
 //
 //   this.collisionNormal = { separate: []};
 //
 //   this._generateCollisionObjects();
 // },
 //
 // // Generate the tileCollisionObject overrides where needed
 // _generateCollisionObjects: function() {
 //   var self = this;
 //
 //   function returnPoint(pt) {
 // 	return [ pt[0] * self.p.tileW - self.p.tileW/2,
 // 			 pt[1] * self.p.tileH - self.p.tileH/2
 // 		   ];
 //   }
 //
 //   if(this.sheet() && this.sheet().frameProperties) {
 // 	var frameProperties = this.sheet().frameProperties;
 // 	for(var k in frameProperties) {
 // 	  var colObj = this.tileCollisionObjects[k] = { p: Q._clone(this.collisionObject.p) };
 // 	  Q._extend(colObj.p,frameProperties[k]);
 //
 // 	  if(colObj.p.points) {
 // 		colObj.p.points = Q._map(colObj.p.points, returnPoint);
 // 	  }
 //
 // 	  this.tileCollisionObjects[k] = colObj;
 // 	}
 //   }
 //
 // },
 //
 // load: function(dataAsset) {
 //   var fileParts = dataAsset.split("."),
 // 	  fileExt = fileParts[fileParts.length-1].toLowerCase(),
 // 	  data;
 //
 //   if (fileExt === "json") {
 // 	data = Q._isString(dataAsset) ?  Q.asset(dataAsset) : dataAsset;
 //   }
 //   else {
 // 	throw "file type not supported";
 //   }
 //   this.p.tiles = data;
 // },
 //
 // setDimensions: function() {
 //   var tiles = this.p.tiles;
 //
 //   if(tiles) {
 // 	this.p.rows = tiles.length;
 // 	this.p.cols = tiles[0].length;
 // 	this.p.w = this.p.cols * this.p.tileW;
 // 	this.p.h = this.p.rows * this.p.tileH;
 //   }
 // },
 //
 // getTile: function(tileX,tileY) {
 //   return this.p.tiles[tileY] && this.p.tiles[tileY][tileX];
 // },
 //
 // getTileProperty: function(tile, prop) {
 //   if(this.tileProperties[tile] !== undefined) {
 // 	return this.tileProperties[tile][prop];
 //   } else {
 // 	return;
 //   }
 // },
 //
 // getTileProperties: function(tile) {
 //   if(this.tileProperties[tile] !== undefined) {
 // 	return this.tileProperties[tile];
 //   } else {
 // 	return {};
 //   }
 // },
 //
 // getTilePropertyAt: function(tileX, tileY, prop) {
 //   return this.getTileProperty(this.getTile(tileX, tileY), prop);
 // },
 //
 // getTilePropertiesAt: function(tileX, tileY) {
 //   return this.getTileProperties(this.getTile(tileX, tileY));
 // },
 //
 // tileHasProperty: function(tile, prop) {
 //   return(this.getTileProperty(tile, prop) !== undefined);
 // },
 //
 // setTile: function(x,y,tile) {
 //   var p = this.p,
 // 	  blockX = Math.floor(x/p.blockTileW),
 // 	  blockY = Math.floor(y/p.blockTileH);
 //
 //   if(x >= 0 && x < this.p.cols &&
 // 	 y >= 0 && y < this.p.rows) {
 //
 // 	this.p.tiles[y][x] = tile;
 //
 // 	if(this.blocks[blockY]) {
 // 	  this.blocks[blockY][blockX] = null;
 // 	}
 //   }
 // },
 //
 // tilePresent: function(tileX,tileY) {
 //   return this.p.tiles[tileY] && this.collidableTile(this.p.tiles[tileY][tileX]);
 // },
 //
 // // Overload this method to draw tiles at frame 0 or not draw
 // // tiles at higher number frames
 // drawableTile: function(tileNum) {
 //   return tileNum > 0;
 // },
 //
 // // Overload this method to control which tiles trigger a collision
 // // (defaults to all tiles > number 0)
 // collidableTile: function(tileNum) {
 //   return tileNum > 0;
 // },
 //
 // getCollisionObject: function(tileX, tileY) {
 //   var p = this.p,
 // 	  tile = this.getTile(tileX, tileY),
 // 	  colObj;
 //
 //   colObj = (this.tileCollisionObjects[tile] !== undefined) ?
 // 	this.tileCollisionObjects[tile] : this.collisionObject;
 //
 //   colObj.p.x = tileX * p.tileW + p.x + p.tileW/2;
 //   colObj.p.y = tileY * p.tileH + p.y + p.tileH/2;
 //
 //   return colObj;
 // },
 //
 // collide: function(obj) {
 //   var p = this.p,
 // 	  objP = obj.c || obj.p,
 // 	  tileStartX = Math.floor((objP.x - objP.cx - p.x) / p.tileW),
 // 	  tileStartY = Math.floor((objP.y - objP.cy - p.y) / p.tileH),
 // 	  tileEndX =  Math.ceil((objP.x - objP.cx + objP.w - p.x) / p.tileW),
 // 	  tileEndY =  Math.ceil((objP.y - objP.cy + objP.h - p.y) / p.tileH),
 // 	  normal = this.collisionNormal,
 // 	  col, colObj;
 //
 //   normal.collided = false;
 //
 //   for(var tileY = tileStartY; tileY<=tileEndY; tileY++) {
 // 	for(var tileX = tileStartX; tileX<=tileEndX; tileX++) {
 // 	  if(this.tilePresent(tileX,tileY)) {
 // 		colObj = this.getCollisionObject(tileX, tileY);
 //
 // 		col = Q.collision(obj,colObj);
 //
 // 		if(col && col.magnitude > 0) {
 // 		  if(colObj.p.sensor) {
 // 			colObj.tile = this.getTile(tileX,tileY);
 // 			if(obj.trigger) {
 // 			  obj.trigger('sensor.tile',colObj);
 // 			}
 // 		  } else if(!normal.collided || normal.magnitude < col.magnitude ) {
 // 			 normal.collided = true;
 // 			 normal.separate[0] = col.separate[0];
 // 			 normal.separate[1] = col.separate[1];
 // 			 normal.magnitude = col.magnitude;
 // 			 normal.distance = col.distance;
 // 			 normal.normalX = col.normalX;
 // 			 normal.normalY = col.normalY;
 // 			 normal.tileX = tileX;
 // 			 normal.tileY = tileY;
 // 			 normal.tile = this.getTile(tileX,tileY);
 // 			 if(obj.p.collisions !== undefined) {
 // 			   obj.p.collisions.push(normal);
 // 			 }
 // 		  }
 // 		}
 // 	  }
 // 	}
 //   }
 //
 //   return normal.collided ? normal : false;
 // },
 //
 // prerenderBlock: function(blockX,blockY) {
 //   var p = this.p,
 // 	  tiles = p.tiles,
 // 	  sheet = this.sheet(),
 // 	  blockOffsetX = blockX*p.blockTileW,
 // 	  blockOffsetY = blockY*p.blockTileH;
 //
 //   if(blockOffsetX < 0 || blockOffsetX >= this.p.cols ||
 // 	 blockOffsetY < 0 || blockOffsetY >= this.p.rows) {
 // 	   return;
 //   }
 //
 //   var canvas = document.createElement('canvas'),
 // 	  ctx = canvas.getContext('2d');
 //
 //   canvas.width = p.blockW;
 //   canvas.height= p.blockH;
 //   this.blocks[blockY] = this.blocks[blockY] || {};
 //   this.blocks[blockY][blockX] = canvas;
 //
 //   for(var y=0;y<p.blockTileH;y++) {
 // 	if(tiles[y+blockOffsetY]) {
 // 	  for(var x=0;x<p.blockTileW;x++) {
 // 		if(this.drawableTile(tiles[y+blockOffsetY][x+blockOffsetX])) {
 // 		  sheet.draw(ctx,
 // 					 x*p.tileW,
 // 					 y*p.tileH,
 // 					 tiles[y+blockOffsetY][x+blockOffsetX]);
 // 		}
 // 	  }
 // 	}
 //   }
 // },
 //
 // drawBlock: function(ctx, blockX, blockY) {
 //   var p = this.p,
 // 	  startX = Math.floor(blockX * p.blockW + p.x),
 // 	  startY = Math.floor(blockY * p.blockH + p.y);
 //
 //   if(!this.blocks[blockY] || !this.blocks[blockY][blockX]) {
 // 	this.prerenderBlock(blockX,blockY);
 //   }
 //
 //   if(this.blocks[blockY]  && this.blocks[blockY][blockX]) {
 // 	ctx.drawImage(this.blocks[blockY][blockX],startX,startY);
 //   }
 // },
 //
 // draw: function(ctx) {
 //   var p = this.p,
 // 	  viewport = this.stage.viewport,
 // 	  scale = viewport ? viewport.scale : 1,
 // 	  x = viewport ? viewport.x : 0,
 // 	  y = viewport ? viewport.y : 0,
 // 	  viewW = Q.width / scale,
 // 	  viewH = Q.height / scale,
 // 	  startBlockX = Math.floor((x - p.x) / p.blockW),
 // 	  startBlockY = Math.floor((y - p.y) / p.blockH),
 // 	  endBlockX = Math.floor((x + viewW - p.x) / p.blockW),
 // 	  endBlockY = Math.floor((y + viewH - p.y) / p.blockH);
 //
 //   for(var iy=startBlockY;iy<=endBlockY;iy++) {
 // 	for(var ix=startBlockX;ix<=endBlockX;ix++) {
 // 	  this.drawBlock(ctx,ix,iy);
 // 	}
 //   }
 // }
 //  });

});

export default Stage;
