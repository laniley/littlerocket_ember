/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  shieldReloadingTimeout: null,
  initUfo: function() {
    var self = this;
    Q.Sprite.extend("Ufo", {
      init: function(p) {
        this._super(p, {
          name:   'Ufo',
          sheet:  'ufo',
          type:   Q.SPRITE_UFO,
          collisionMask: Q.SPRITE_ROCKET | Q.SPRITE_BULLET,
          sensor: true,
          x:      ((Q.width - (72 * Q.state.get('scale'))) * Math.random()) + (20 * Q.state.get('scale')),
          y:      0,
          tileW:  72,
          tileH:  40,
          scale:  Q.state.get('scale'),
          points: [],
          xDirection: 0.5 - Math.random()
        });

        // collision points berechnen
        var radius = this.p.tileW / 2 - 3;
        var winkel = 0;

        for(var i = 0; i < 10; i++)
        {
          winkel += (Math.PI * 2) / 10;

          var x = Math.floor(Math.sin(winkel) * radius);
          var y = Math.floor(Math.cos(winkel) * radius);

          this.p.points.push([x, y]);
        }

        this.on("sensor");

        this.add("2d, ufoControls");
      },

      // When an ufo is hit..
      sensor: function(colObj)
      {
        // Destroy it
        if(colObj.isA('Rocket') && !colObj.collided && !this.collided)
        {
          this.collided = true;

          if(Q.state.get('shield') === 0 || Q.state.get('shield_is_reloading')) {

            colObj.collided = true;

            Q.audio.stop('rocket.mp3');
            Q.audio.stop('racing.mp3');
            Q.audio.play('explosion.mp3');

            // globalSpeedRef = 0;

            Q.stageScene("gameOver", 2);
          }
          else {
            Q.state.set('shield_is_reloading', true);

            Q.state.set('shield', Q.state.get('shield') - 1);

            var timeout = setTimeout(function() {
              Q.state.set('shield_is_reloading', false);
            }, 1000 / Q.state.get('srr'));

            self.set('shieldReloadingTimeout', timeout);
          }
        }
        else if(colObj.isA('Bullet') && !colObj.collided)
        {
          colObj.collided = true;
          colObj.destroy();
        }

        Q.audio.play('explosion.mp3');
        this.destroy();
      }
    });
  }
});
