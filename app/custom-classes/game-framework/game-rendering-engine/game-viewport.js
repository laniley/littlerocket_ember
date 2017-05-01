import Ember from 'ember';

const Viewport = Ember.Object.extend({

	game: null,

	x: 0,
	y: 0,
	offsetX: 0,
	offsetY: 0,
	centerX: 0,
	centerY: 0,
	scale: 1,

	init() {
		this.set('centerX', this.get('game.gameState.width') / 2);
		this.set('centerY', this.get('game.gameState.height') / 2);
	},

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

});

export default Viewport;
