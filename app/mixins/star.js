/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({
  gameState: null,
  initStar() {
    var self = this;
    // Create the Star sprite
    Q.Sprite.extend("Star", {
       init: function(p) {
          this._super(p, {
            name: 'Star',
            sheet: 'star',
            type: Q.SPRITE_STAR,
            collisionMask: Q.SPRITE_ROCKET,
            collided: false,
            sensor: true,
            x:      ((Q.width - (60 * Q.state.get('scale'))) * Math.random()) + (30 * Q.state.get('scale')),
            y:      0,
            scale: Q.state.get('scale')
          });

          self.set('gameState', self.store.peekRecord('game-state', 1));

          this.on("sensor");
          this.on("inserted");

          this.add("2d, starControls");
       },

       // When a star is hit..
       sensor: function(colObj) {
          // Collision with rocket
          if(colObj.isA('Rocket') && !this.p.collided) {
            this.p.collided = true;
            // Play sound
            Q.audio.play('collecting_a_star.mp3');

            // Destroy it and count up score
            self.get('gameState').set('stars', self.get('gameState').get('stars') + 1);

            this.destroy();
          }
       },

       // When a star is inserted, use it's parent (the stage)
       // to keep track of the total number of stars on the stage
       inserted: function() {
          this.stage.starCount = this.stage.starCount || 0;
          this.stage.starCount++;
       }
    });

    Q.component("starControls", {
       // default properties to add onto our entity
       defaults: { direction: 'down' },

       // called when the component is added to
       // an entity
       added: function() {
          var p = this.entity.p;

          // add in our default properties
          Q._defaults(p, this.defaults);

          // every time our entity steps
          // call our step method
          this.entity.on("step",this,"step");
       },

       step: function(/*dt*/) {
          // grab the entity's properties
          // for easy reference
          var p = this.entity.p;

          // based on our direction, try to add velocity
          // in that direction
          switch(p.direction) {
            case "down":  p.vy = self.get('gameState').get('speed');
                      break;
          }

          if(p.y > Q.height) {
            this.entity.destroy();
          }
       }
    });

    Q.GameObject.extend("StarMaker", {
       init: function() {
          this.p = {
            launchDelay: Q.state.get('scale') - (self.get('gameState').get('speed') / self.get('gameState').get('max_speed')),
            launchRandom: 1,
            launch: 1
          };
       },

       update: function(dt) {
          this.p.launch -= dt;

          if(!Q.state.get('isPaused') && this.p.launch < 0) {
            this.stage.insert(new Q.Star());
            this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
          }
       }
    });
  }
});
