/**
  	A 2D matrix class, optimized for 2D points, where the last row of the matrix will always be 0,0,1

  	Do not call `new Q.Matrix2D` - use the provided Q.matrix2D factory function for GC happiness

		var matrix = Q.matrix2d();

  	Used internally by Quintus for all transforms / collision detection. Most of the methods modify the matrix they are called upon and are chainable.
*/
import Ember from 'ember';

const GameMatrix2D = Ember.Object.extend({
	/**
	 	Initialize a matrix from a source or with the identify matrix

	 	@constructor
	 	@for GameMatrix2D
	*/
	init(source) {
		this._super();
	   	if(source) {
		 	this.m = [];
		 	this.clone(source);
	   	}
		else {
		 	this.m = [1,0,0,0,1,0];
	   	}
	},
	/**
	 	Turn this matrix into the identity

	 	@for GameMatrix2D
	 	@method identity
	 	@chainable
	*/
	identity() {
	   var m = this.m;
	   m[0] = 1; m[1] = 0; m[2] = 0;
	   m[3] = 0; m[4] = 1; m[5] = 0;
	   return this;
	},
	/**

	 	Clone another matrix into this one

	 	@for GameMatrix2D
	 	@method clone
	 	@param {GameMatrix2D} matrix - matrix to clone
	 	@chainable
	*/
	clone: function(matrix) {
	   	var d = this.m, s = matrix.m;
	   	d[0]=s[0]; d[1]=s[1]; d[2] = s[2];
	   	d[3]=s[3]; d[4]=s[4]; d[5] = s[5];
	   	return this;
	},
	/**
	 	multiply two matrices (leaving the result in this)

		 	a * b =
			 	[ [ a11*b11 + a12*b21 ], [ a11*b12 + a12*b22 ], [ a11*b31 + a12*b32 + a13 ] ,
			 	[ a21*b11 + a22*b21 ], [ a21*b12 + a22*b22 ], [ a21*b31 + a22*b32 + a23 ] ]
   	*/
	multiply: function(matrix) {
	   var a = this.m, b = matrix.m;

	   var m11 = a[0]*b[0] + a[1]*b[3];
	   var m12 = a[0]*b[1] + a[1]*b[4];
	   var m13 = a[0]*b[2] + a[1]*b[5] + a[2];

	   var m21 = a[3]*b[0] + a[4]*b[3];
	   var m22 = a[3]*b[1] + a[4]*b[4];
	   var m23 = a[3]*b[2] + a[4]*b[5] + a[5];

	   a[0]=m11; a[1]=m12; a[2] = m13;
	   a[3]=m21; a[4]=m22; a[5] = m23;
	   return this;
	},
	/**
	 	Multiply this matrix by a rotation matrix rotated radians radians

		@for GameMatrix2D
		@method rotate
		@param {Float} radians - angle to rotate by
		@chainable
	*/
	rotate: function(radians) {
	   	if(radians === 0) {
		   return this;
	   	}
	   	var cos = Math.cos(radians),
			sin = Math.sin(radians),
			m = this.m;

	   	var m11 = m[0]*cos  + m[1]*sin;
	   	var m12 = m[0]*-sin + m[1]*cos;

	   	var m21 = m[3]*cos  + m[4]*sin;
	   	var m22 = m[3]*-sin + m[4]*cos;

	   	m[0] = m11; m[1] = m12; // m[2] == m[2]
	   	m[3] = m21; m[4] = m22; // m[5] == m[5]
	   	return this;
	},
	/**
	 	Helper method to rotate by a set number of degrees (calls rotate internally)

	 	@for GameMatrix2D
	 	@method rotateDeg
	 	@param {Float} degrees
	 	@chainable
	*/
	rotateDeg: function(degrees) {
	   	if(degrees === 0) {
		   return this;
	   	}
	   	return this.rotate(Math.PI * degrees / 180);
	},
	/**
	 	Multiply this matrix by a scaling matrix scaling sx and sy
	 	@for GameMatrix2D
	 	@method scale
	 	@param {Float} sx - scale in x dimension (scaling is uniform unless `sy` is provided)
	 	@param {Float} [sy] - scale in the y dimension
	 	@chainable
	*/
	scale: function(sx,sy) {
	   	var m = this.m;
	   	if(sy === void 0) { sy = sx; }

	   	m[0] *= sx;
	   	m[1] *= sy;
	   	m[3] *= sx;
	   	m[4] *= sy;
	   	return this;
	},
	/**
	 	Multiply this matrix by a translation matrix translate by tx and ty

	 	@for GameMatrix2D
	 	@method translate
	 	@param {Float} tx
	 	@param {Float} ty
	 	@chainable
	*/
	translate: function(tx,ty) {
	   	var m = this.m;

	   	m[2] += m[0]*tx + m[1]*ty;
	   	m[5] += m[3]*tx + m[4]*ty;
	   	return this;
	},
	/**
	 	Transform x and y coordinates by this matrix
	 	Memory Hoggy version, returns a new Array

	 	@for GameMatrix2D
	 	@method transform
	 	@param {Float} x
	 	@param {Float} y
	*/
	transform: function(x,y) {
	   	return [ x * this.m[0] + y * this.m[1] + this.m[2],
				 x * this.m[3] + y * this.m[4] + this.m[5] ];
	},
	/**
	 	Transform an object with an x and y property by this Matrix
	 	@for GameMatrix2D
	 	@method transformPt
	 	@param {Object} obj
	 	@return {Object} obj
	*/
	transformPt: function(obj) {
	   	var x = obj.x, y = obj.y;

	   	obj.x = x * this.m[0] + y * this.m[1] + this.m[2];
	   	obj.y = x * this.m[3] + y * this.m[4] + this.m[5];

	   	return obj;
	},
	/**
	 	Transform an array with an x and y elements by this Matrix and put the result in
	 	the outArr

	 	@for GameMatrix2D
	 	@method transformArr
	 	@param {Array} inArr - input array
	 	@param {Array} outArr - output array
	 	@return {Object} obj
	*/
	transformArr: function(inArr,outArr) {
	   	var x = inArr[0], y = inArr[1];

	   	outArr[0] = x * this.m[0] + y * this.m[1] + this.m[2];
	   	outArr[1] = x * this.m[3] + y * this.m[4] + this.m[5];

	   	return outArr;
	},
	/**
	 	Return just the x coordinate transformed by this Matrix

	 	@for GameMatrix2D
	 	@method transformX
	 	@param {Float} x
	 	@param {Float} y
	 	@return {Float} x transformed
	*/
	transformX: function(x,y) {
	   return x * this.m[0] + y * this.m[1] + this.m[2];
	},
	/**
	 	Return just the y coordinate transformed by this Matrix

	 	@for GameMatrix2D
	 	@method transformY
	 	@param {Float} x
	 	@param {Float} y
	 	@return {Float} y transformed
	*/
	transformY: function(x,y) {
	   return x * this.m[3] + y * this.m[4] + this.m[5];
	},
	/**
	 	Release this Matrix to be reused

	 	@for Q.Matrix2D
	 	@method release
	*/
	release: function(game) {
	   game.get('matrices2d').push(this);
	   return null;
	},
	/**
	 	Set the complete transform on a Canvas 2D context

	 	@for GameMatrix2D
	 	@method setContextTransform
	 	@param {Context2D} ctx - 2D canvs context
	*/
	setContextTransform: function(ctx) {
	   	var m = this.m;
	   	// source:
	   	//  m[0] m[1] m[2]
	   	//  m[3] m[4] m[5]
	   	//  0     0   1
	   	//
	   	// destination:
	   	//  m11  m21  dx
	   	//  m12  m22  dy
	   	//  0    0    1
	   	//  setTransform(m11, m12, m21, m22, dx, dy)
	   	ctx.transform(m[0],m[3],m[1],m[4],m[2],m[5]);
	}

});

export default GameMatrix2D;
