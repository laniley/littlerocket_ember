import Ember from 'ember';

export default Ember.Component.extend({
  name: '',
  sheet: '',
  tileW: 0,
  tileH: 0,
  x: 0,
  y: 0,
  scale: 0,
  angle: 0,

  init: function() {
    // this.matrix = new Q.Matrix2D();
    // this.children = [];
    //
    // Q._extend(this.p,props);
    //
    this.size();
    // this.p.id = this.p.id || Q._uniqueId();
    //
    // this.c = { points: [] };

    this.refreshMatrix();
  },

  draw: function(ctx, x, y, frame) {
    // if(!ctx) {
    //   ctx = Q.ctx;
    // }
    //
    // ctx.drawImage(Q.asset(this.asset),
    //               this.fx(frame),this.fy(frame),
    //               this.tilew, this.tileh,
    //               Math.floor(x),Math.floor(y),
    //               this.tilew, this.tileh);

  },

  refreshMatrix: function() {
    // this.matrix.identity();
    //
    // if(this.container) {
    //   this.matrix.multiply(this.container.matrix);
    // }
    //
    // this.matrix.translate(this.get('x'), this.get('y'));
    //
    // if(this.get('scale') !== 1) {
    //   this.matrix.scale(this.get('scale'), this.get('scale'));
    // }
    //
    // this.matrix.rotateDeg(this.get('angle'));
  },

  // Resets the width, height and center based on the
  // asset or sprite sheet
  size: function(force) {
    // if(force || (!this.p.w || !this.p.h)) {
    //   if(this.asset()) {
    //     this.p.w = this.asset().width;
    //     this.p.h = this.asset().height;
    //   } else if(this.sheet()) {
    //     this.p.w = this.sheet().tilew;
    //     this.p.h = this.sheet().tileh;
    //   }
    // }
    //
    // this.p.cx = (force || this.p.cx === void 0) ? (this.p.w / 2) : this.p.cx;
    // this.p.cy = (force || this.p.cy === void 0) ? (this.p.h / 2) : this.p.cy;
  }
});
