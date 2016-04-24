/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  initAsteroid() {
    Q.Sprite.extend("Asteroid", {
      // When an asteroid is hit..
      sensor: function(colObj) {
        // Destroy it
        if(colObj.isA('Rocket') && !colObj.collided && !this.collided) {
          this.collided = true;
          colObj.trigger('collided');
        }
        else if(colObj.isA('Bullet') && !colObj.collided) {
          colObj.collided = true;
          colObj.destroy();
        }

        Q.audio.play('explosion.mp3');
        this.destroy();
      }
    });
  }
});
