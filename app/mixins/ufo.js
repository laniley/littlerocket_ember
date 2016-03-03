/* global Q */
import Ember from 'ember';

export default Ember.Mixin.create({

  initUfo() {
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

        for(var i = 0; i < 10; i++) {

          winkel += (Math.PI * 2) / 10;

          var x = Math.floor(Math.sin(winkel) * radius);
          var y = Math.floor(Math.cos(winkel) * radius);

          this.p.points.push([x, y]);
        }

        this.on("sensor");

        this.add("2d, ufoControls");
      },

      // When an ufo is hit..
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

    Q.component("ufoControls", {
      // default properties to add onto our entity
      defaults: { /*speed: 100*/ },

      // called when the component is added to an entity
      added: function() {
        var p = this.entity.p;

        // add in our default properties
        Q._defaults(p, this.defaults);

        // every time our entity steps call our step method
        this.entity.on("step",this,"step");
      },

      step: function(/*dt*/) {
        // grab the entity's properties for easy reference
        var p = this.entity.p;

        var gameState = self.store.peekRecord('gameState', 1);
        p.vy = gameState.get('speed') * 1.3;
        // based on our xDirection, try to add velocity in that direction
        if(p.xDirection > 0) {
          p.vx = gameState.get('speed') / 2;
        }
        else {
          p.vx = -gameState.get('speed') / 2;
        }

        if(p.y > Q.height) {
          this.entity.destroy();
        }

        if((p.x > Q.width - 35 * Q.state.get('scale') &&
            p.xDirection > 0) || (p.x < 35 * Q.state.get('scale') && p.xDirection <= 0)) {
          p.xDirection = p.xDirection * -1;
        }
      }
    });

    Q.GameObject.extend("UfoMaker", {
    	init: function() {
        var gameState = self.store.peekRecord('gameState', 1);
    		this.p = {
    			launchDelay: 1.2 * Q.state.get('scale') - (gameState.get('speed') / gameState.get('max_speed')),
    			launchRandomFactor: 1,
    			launch: 1,
          isActive: 1
    		};
    	},
     	update: function(dt) {
  	  	this.p.launch -= dt;

  	  	if(!Q.state.get('isPaused') && this.p.isActive && this.p.launch < 0) {
    			this.stage.insert(new Q.Ufo());
    			this.p.launch = this.p.launchDelay + this.p.launchRandomFactor * Math.random();
    		}
     	}
    });
  }
});
