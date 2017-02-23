/*global Quintus:false */

Quintus["2D"] = function(Q)
{



  Q.gravityY = 9.8*100;
  Q.gravityX = 0;

  Q.component('aiBounce', {
    added: function() {
      this.entity.on("bump.right",this,"goLeft");
      this.entity.on("bump.left",this,"goRight");
    },

    goLeft: function(col) {
      this.entity.p.vx = -col.impact;
      if(this.entity.p.defaultDirection === 'right') {
          this.entity.p.flip = 'x';
      }
      else {
          this.entity.p.flip = false;
      }
    },

    goRight: function(col) {
      this.entity.p.vx = col.impact;
      if(this.entity.p.defaultDirection === 'left') {
          this.entity.p.flip = 'x';
      }
      else {
          this.entity.p.flip = false;
      }
    }
  });

};
