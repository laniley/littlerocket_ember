/* global Quintus */
/* global FB */
/* global LSM_Slot */
import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';
import RocketMixin from './../mixins/rocket';
import UfoMixin from './../mixins/ufo';
import CannonMixin from './../mixins/rocket-components/cannon';

export default Ember.Component.extend(

  FacebookLoginMixin,
  RocketMixin,
  UfoMixin,
  CannonMixin, {

  Q: null,
  me: null,
  store: null,
  hasPostPermission: false,
  shieldReloadingTimeout: null,
  engineReloadingTimeout: null,
  isLoading: true,
  gameCanvasIsLoaded: false,
  currentScene: null,
  showHud: false,
  newHighscore: false,
  old_score: 0,
  distance: 0,
  stars: 0,
  level: 1,

  new_score: function() {
    return (this.get('distance') + this.get('stars')) * this.get('level');
  }.property('distance', 'stars', 'level'),

  didInsertElement: function() {

    var self = this;
    this.set('store', this.get('targetObject.store'));

    var Q = window.Q = new Quintus({
      development: false,
      audioSupported: [ 'mp3' ],
      imagePath: "./assets/images/",
      audioPath: "./assets/audio/",
      dataPath: "./assets/data/"
    })
    .include("Sprites, Anim, Input, Scenes, 2D, Touch, UI, Audio")
    .setup
    (
    		'game',
    		{
    			scaleToFit: true,
          maximize: "touch"
    		}
    	)
    .controls()
    .touch()
    .enableSound();

    this.set('Q', Q);

    // Add in the controls
    Q.input.keyboardControls
    ({
      	LEFT: "left",
      	RIGHT: "right",
      	UP: "up",
        DOWN: "down",
      	SPACE: "space",
        ENTER: "enter"
    });

    Q.input.touchControls
    ({
      	controls:
      	[
      		['left','<' ],
          [],
          ['up', '*'],
          [],
          ['right','>' ]
       ]
    });

    Q.gravityX = 0;
    Q.gravityY = 0;

    Q.SPRITE_ROCKET   = 1;
    Q.SPRITE_CANNON   = 10;
    Q.SPRITE_STAR     = 2;
    Q.SPRITE_ASTEROID = 4;
    Q.SPRITE_BULLET	  = 16;

    Q.state.set('scale', 1);

    var rocket_y  = Q.height/6 * 5;

    if(Q.touchDevice)
    {
      Q.state.set('scale', 2.5);
    	rocket_y -= 100;
    }

    Q.state.set('level', 1);

    Q.state.set('distance', 0);
    Q.state.set('stars', 0);
    Q.state.set('shield_is_reloading', false);
    Q.state.set('engine_is_reloading', false);

    var distanceToGoalRef = 50;
    Q.state.set('distanceToGoal', Math.floor(distanceToGoalRef * ( 1 + ((Q.state.get('level') - 1) / 10) )));

    var globalSpeedRef = 50;
    Q.state.set('speed', 100);
    // max speed of the stars and asteroids
    Q.state.set('maxSpeed',100);
    Q.state.set('maxSpeedRef', 100);

    // var asteroidMaker = null;

    // COLORS
    Q.state.set('buttonFillColorUnselected', '#CCC');
    Q.state.set('buttonFillColorSelected', '#F5F36F');
    Q.state.set('buttonTextColorSelected', '#D62E00');

    this.initRocket();
    this.initCannon();
    this.initUfo();

    Q.TransformableSprite.extend("Bullet", {
    	init: function(p)
    	{
    		  this._super(p,
    		  {
    				name:          "Bullet",
    				sheet:         "bullet",
    				tileW:         20,
    				tileH:         20,
    				x:             new Q('Rocket').first().p.x, // x location of the center
    				y:             400, // y location of the center
    				type:          Q.SPRITE_BULLET,
    				collisionMask: Q.SPRITE_ASTEROID,
    				collided:      false,
    				scale: 			   Q.state.get('scale')
    		  });

    		  this.add("2d, bulletControls");
    	}
    });

    Q.component("bulletControls", {
    	// // called when the component is added to
    	// // an entity
    	added: function()
    	{
    		var p = this.entity.p;

    		// add in our default properties
    		Q._defaults(p, this.defaults);

    		// every time our entity steps
    		// call our step method
    		this.entity.on("step",this,"step");
    	},

    	step: function(/*dt*/)
    	{
    		// grab the entity's properties
    		// for easy reference
    		var p = this.entity.p;

    		// based on our direction, try to add velocity
    		// in that direction
    		p.vy = -350;

    		if(p.y < 0)
    		{
    			this.entity.destroy();
    		}
    	}
    });

    // Create the Star sprite
    Q.Sprite.extend("Star", {
    	 init: function(p)
    	 {
    		  this._super(p,
    		  {
    				name: 'Star',
    				sheet: 'star',
    				type: Q.SPRITE_STAR,
    				collisionMask: Q.SPRITE_ROCKET,
    				sensor: true,
    				x:      ((Q.width - (60 * Q.state.get('scale'))) * Math.random()) + (30 * Q.state.get('scale')),
    				y:      0,
    				scale: Q.state.get('scale')
    		  });

    		  this.on("sensor");
    		  this.on("inserted");

    		  this.add("2d, starControls");
    	 },

    	 // When a star is hit..
    	 sensor: function(colObj)
    	 {
    		  // Collision with rocket
    		  if(colObj.isA('Rocket'))
    		  {
    				// Play sound
    				Q.audio.play('collecting_a_star.mp3');

    				// Destroy it and count up score
    				colObj.p.stars++;
            self.set('stars', self.get('stars') + 1);

    				Q.state.set("stars", colObj.p.stars);

    				this.destroy();
    		  }
    	 },

    	 // When a star is inserted, use it's parent (the stage)
    	 // to keep track of the total number of stars on the stage
    	 inserted: function()
    	 {
    		  this.stage.starCount = this.stage.starCount || 0;
    		  this.stage.starCount++;
    	 }
    });

    Q.component("starControls", {
    	 // default properties to add onto our entity
    	 defaults: { speed: 100, direction: 'down' },

    	 // // called when the component is added to
    	 // // an entity
    	 added: function()
    	 {
    		  var p = this.entity.p;

    		  // add in our default properties
    		  Q._defaults(p, this.defaults);

    		  // every time our entity steps
    		  // call our step method
    		  this.entity.on("step",this,"step");
    	 },

    	 step: function(/*dt*/)
    	 {
    		  // grab the entity's properties
    		  // for easy reference
    		  var p = this.entity.p;

    		  // based on our direction, try to add velocity
    		  // in that direction
    		  switch(p.direction)
    		  {
    				case "down":  p.vy = Q.state.get('speed');
    								  break;
    		  }

    		  if(p.y > Q.height)
    		  {
    				this.entity.destroy();
    		  }
    	 }
    });

    Q.GameObject.extend("StarMaker", {
    	 init: function()
    	 {
    		  this.p =
    		  {
    				launchDelay: Q.state.get('scale') - (Q.state.get('speed') / Q.state.get('maxSpeed')),
    				launchRandom: 1,
    				launch: 1
    		  };
    	 },

    	 update: function(dt)
    	 {
    		  this.p.launch -= dt;

    		  if(!Q.state.get('isPaused') && this.p.launch < 0)
    		  {
    				this.stage.insert(new Q.Star());
    				this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    		  }
    	 }
    });

    Q.Sprite.extend("Asteroid", {
    	// When an asteroid is hit..
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

      			globalSpeedRef = 0;

      			Q.stageScene("gameOver", 2);
          }
    			else {
            Q.state.set('shield_is_reloading', true);

            if(Q.state.get('shield') - this.p.hitPoints > 0) {
              Q.state.set('shield', Q.state.get('shield') - this.p.hitPoints);
            }
            else if(Q.state.get('shield') - this.p.hitPoints < 0) {
              Q.state.set('shield', Q.state.get('shield') - this.p.hitPoints);

              colObj.collided = true;

        			Q.audio.stop('rocket.mp3');
        			Q.audio.stop('racing.mp3');
        			Q.audio.play('explosion.mp3');

        			globalSpeedRef = 0;

        			Q.stageScene("gameOver", 2);
            }
            else {
              Q.state.set('shield', 0);
            }

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

    Q.Asteroid.extend("NormalAsteroid", {
    	init: function(p)
    	{
    		this._super(p,
    		{
    			name:   'Asteroid',
    			sheet:  'asteroid',
    			type:   Q.SPRITE_ASTEROID,
    			collisionMask: Q.SPRITE_ROCKET | Q.SPRITE_BULLET,
    			sensor: true,
    			x:      ((Q.width - (70 * Q.state.get('scale'))) * Math.random()) + (35 * Q.state.get('scale')),
    			y:      0,
    			tileW:  70,
    			tileH:  70,
    			scale: Q.state.get('scale'),
          speedFactor: 1.2,
          hitPoints: 1,
    			points: []
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

    		this.add("2d, asteroidControls");
    	}
    });

    Q.Asteroid.extend("BigAsteroid", {
    	init: function(p)
    	{
    		this._super(p,
    		{
    			name:   'BigAsteroid',
    			sheet:  'bigAsteroid',
    			sprite: 'bigAsteroid', // name of the animation
    			frame:  0,
    			type:   Q.SPRITE_ASTEROID,
    			collisionMask: Q.SPRITE_ROCKET | Q.SPRITE_BULLET,
    			sensor: true,
    			tileW:  100,
    			tileH:  100,

    			x:      ((Q.width - (200 * Q.state.get('scale'))) * Math.random()) + (100 * Q.state.get('scale')), // x location of the center of the sprite
    			y:      0,

    			scale: Q.state.get('scale'),
    			points: [],
          speedFactor: 1,
          hitPoints: 2,
    			isExploded: false
    		});

    		// collision points berechnen
    		var radius = this.p.tileW / 2;
    		var winkel = 0;

    		for(var i = 0; i < 10; i++)
    		{
    			winkel += (Math.PI * 2) / 10;

    			var x = Math.floor(Math.sin(winkel) * radius);
    			var y = Math.floor(Math.cos(winkel) * radius);

    			this.p.points.push([x, y]);
    		}

    		this.on("sensor");
    		this.on('exploded', this, 'destroy');

    		this.add("2d, asteroidControls, animation");
    	},

    	explode: function()
    	{
    		this.play('explosion');
    	}
    });

    Q.Asteroid.extend("ExplodingAsteroid", {
    	init: function(p)
    	{
    		this._super(p,
    		{
    			name:   'ExplodingAsteroid',
    			sheet:  'explodingAsteroid',
    			sprite: 'explodingAsteroid', // name of the animation
    			frame:  0,
    			type:   Q.SPRITE_ASTEROID,
    			collisionMask: Q.SPRITE_ROCKET | Q.SPRITE_BULLET,
    			sensor: true,
    			tileW:  200,
    			tileH:  200,

    			x:      ((Q.width - (200 * Q.state.get('scale'))) * Math.random()) + (100 * Q.state.get('scale')), // x location of the center of the sprite
    			y:      0,

    			scale: Q.state.get('scale'),
          speedFactor: 1,
          hitPoints: 3,
    			points: [],
    			isExploded: false
    		});

    		// collision points berechnen
    		var radius = this.p.tileW / 4;
    		var winkel = 0;

    		for(var i = 0; i < 10; i++)
    		{
    			winkel += (Math.PI * 2) / 10;

    			var x = Math.floor(Math.sin(winkel) * radius);
    			var y = Math.floor(Math.cos(winkel) * radius);

    			this.p.points.push([x, y]);
    		}

    		this.on("sensor");
    		this.on('exploded', this, 'destroy');

    		this.add("2d, asteroidControls, animation");
    	},

    	explode: function()
    	{
        var winkel = 0;
        var radiusStart = this.p.tileW / 4;
        var radiusEnd = this.p.tileW / 2;

        for(var radius = radiusStart; radius < radiusEnd; radius++) {
          this.p.point = [];
          for(var i = 0; i < 10; i++) {
      			winkel += (Math.PI * 2) / 10;

      			var x = Math.floor(Math.sin(winkel) * radius);
      			var y = Math.floor(Math.cos(winkel) * radius);

      			this.p.points.push([x, y]);
      		}
        }

        this.play('explosion');
    	}
    });

    Q.component("asteroidControls", {
    	// default properties to add onto our entity
    	defaults: { speed: 100, direction: 'down' },

    	// // called when the component is added to
    	// // an entity
    	added: function()
    	{
    		var p = this.entity.p;

    		// add in our default properties
    		Q._defaults(p, this.defaults);

    		// every time our entity steps
    		// call our step method
    		this.entity.on("step",this,"step");
    	},

    	step: function(/*dt*/)
    	{
    		// grab the entity's properties
    		// for easy reference
    		var p = this.entity.p;

    		// based on our direction, try to add velocity
    		// in that direction
    		switch(p.direction)
    		{
    			case "down":
              p.vy = Q.state.get('speed') * p.speedFactor;
    					break;
    		}

    		if(this.entity.isA('ExplodingAsteroid')	&& p.y > (Q.height * 0.75) && p.isExploded === false)
    		{
            p.isExploded = true;
    		  	Q.audio.play('explosion.mp3');
    		  	this.entity.explode();
    		}

        if(p.y > Q.height)
    		{
    			  this.entity.destroy();
    		}
    	}
    });

    Q.GameObject.extend("AsteroidMaker", {
      init: function() {
    		this.p = {
    			launchDelay: (Q.state.get('scale') - (Q.state.get('speed') / Q.state.get('maxSpeed'))) * 0.3,
          launchRandomFactor: Math.random() * 0.6,
    			launch: 1
    		};
    	},

     	update: function(dt)
     	{
    	  	this.p.launch -= dt;

    	  	if(!Q.state.get('isPaused') && this.p.launch < 0) {
      			this.stage.insert(new Q.NormalAsteroid());
      			this.p.launch = this.p.launchDelay + this.p.launchRandomFactor * Math.random();
    		  }
     	}
    });

    Q.GameObject.extend("BigAsteroidMaker", {
    	init: function()
    	{
    		this.p =
    		{
    			launchDelay: 1 * Q.state.get('scale') - (Q.state.get('speed') / Q.state.get('maxSpeed')),
    			launchRandomFactor: 1,
    			launch: 1
    		};
    	},

    	update: function(dt)
    	{
    		this.p.launch -= dt;

    		if(!Q.state.get('isPaused') && this.p.isActive && this.p.launch < 0)
    		{
    			this.stage.insert(new Q.BigAsteroid());
    			this.p.launch = this.p.launchDelay + this.p.launchRandomFactor * Math.random();
    		}
    	}
    });

    Q.GameObject.extend("ExplodingAsteroidMaker", {
    	init: function()
    	{
    		this.p =
    		{
    			launchDelay: 2 * Q.state.get('scale') - (Q.state.get('speed') / Q.state.get('maxSpeed')),
    			launchRandom: 1,
    			launch: 2
    		};
    	},

    	update: function(dt)
    	{
    		this.p.launch -= dt;

    		if(!Q.state.get('isPaused') && this.p.launch < 0)
    		{
    			this.stage.insert(new Q.ExplodingAsteroid( {size : 50} ));
    			this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    		}
    	}
    });

  	Q.scene('hud',function(stage) {
  		// Icons
  		stage.insert(new Q.DistanceIcon());
  		stage.insert(new Q.LevelIcon());
      stage.insert(new Q.StarIcon());
  		stage.insert(new Q.SpeedIcon());
  		stage.insert(new Q.GoalIcon());

  		// Values
  		var container = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: Q.state.get('scale') * 60,
  					y: Q.state.get('scale') * 45
  			  }
  			)
  		);

  		container.insert(new Q.DistanceText(container));
  		container.insert(new Q.LevelText(container));
  		container.insert(new Q.StarsText(container));
  		container.insert(new Q.SpeedText(container));
  		container.insert(new Q.DistanceToGoalText(container));

  		container.fit(0);

      var containerShield = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: Q.state.get('scale') * 300,
  					y: Q.state.get('scale') * 80
  			  }
  			)
  		);

      var containerShieldReloading = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: Q.state.get('scale') * 300,
  					y: Q.state.get('scale') * 110
  			  }
  			)
  		);

      var containerEngine = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: Q.state.get('scale') * 300,
  					y: Q.state.get('scale') * 140
  			  }
  			)
  		);

      var containerEngineReloading = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: Q.state.get('scale') * 300,
  					y: Q.state.get('scale') * 170
  			  }
  			)
  		);

      self.get('me').get('user').then(user => {

        if(!Ember.isEmpty(user)) {

          user.get('rocket').then(rocket => {
            rocket.get('cannon').then(cannon => {
                self.set('cannon', cannon);
                if(cannon.get('status') === "unlocked") {
                  cannon.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                    selectedRocketComponentModelMm.get('selectedRocketComponentModelCapacityLevelMm').then(rocketComponentModelCapacityLevelMm => {
                      rocketComponentModelCapacityLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelLevel => {
                        cannon.set('currentValue', rocketComponentModelLevel.get('value'));
                      });
                    });
                  });
                }
                else {
                  cannon.set('currentValue', 0);
                }
            });

            rocket.get('shield').then(shield => {

                if(shield.get('status') === 'unlocked') {
                  shield.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                    selectedRocketComponentModelMm.get('selectedRocketComponentModelCapacityLevelMm').then(rocketComponentModelCapacityLevelMm => {
                      rocketComponentModelCapacityLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelLevel => {
                        Q.state.set('shield', rocketComponentModelLevel.get('value'));
                      });
                    });
                  });
                }
                else {
                  Q.state.set('shield', 0);
                }

                containerShield.insert(new Q.ShieldText(containerShield));
            });

            rocket.get('engine').then(engine => {

                if(engine.get('status') === 'unlocked') {
                  engine.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                    selectedRocketComponentModelMm.get('selectedRocketComponentModelCapacityLevelMm').then(rocketComponentModelCapacityLevelMm => {
                      rocketComponentModelCapacityLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelLevel => {
                        Q.state.set('slowdowns', rocketComponentModelLevel.get('value'));
                      });
                    });
                  });
                }
                else {
                  Q.state.set('slowdowns', 0);
                }

                containerEngine.insert(new Q.EngineText(containerEngine));
            });

          });

        }

      });

      containerShieldReloading.insert(new Q.ShieldIsReloadingText(containerShieldReloading));
      containerEngineReloading.insert(new Q.EngineIsReloadingText(containerEngineReloading));

      containerShield.fit(0);
      containerEngine.fit(0);
      containerShieldReloading.fit(0);
      containerEngineReloading.fit(0);

    });

  	Q.scene("mainMenu",function(stage) {

      self.set('currentScene', 'mainMenu');
      self.set('showHud', true);

      self.set('distance', 0);
      self.set('stars', 0);

  		Q.pauseGame();

  		Q.audio.stop('rocket.mp3');
  		Q.audio.stop('racing.mp3');

      var rocket = new Q.Rocket();
  		stage.insert(rocket);

      if(!Ember.isEmpty(self.get('rocket').get('cannon'))) {
        var cannon = new Q.Cannon();
            cannon.setRocket(rocket);
            rocket.setCannon(cannon);
    		stage.insert(cannon);
      }

  		// start
  		var container = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2,
  			  y: Q.height/2 - 40 * Q.state.get('scale')
  		}));

  		var buttonStartLevel = container.insert
  		(
  			new Q.UI.Button
  			({
  				x: 0,
  				y: 0,
  				scale: Q.state.get('scale'),
          fontColor: Q.state.get('buttonTextColorSelected'),
          stroke: Q.state.get('buttonTextColorSelected'),
  				fill: Q.state.get('buttonFillColorSelected'),
          shadow: 5,
          shadowColor: "rgba(0,0,0,0.5)",
  				label: "Start",
  				border: 2
  			})
  		);

  		buttonStartLevel.on("click",function()
  		{
        Q.clearStages();
  			Q.stageScene('level');
  		});

  		container.fit(20 * Q.state.get('scale'));

  		// select level
  		var containerSelectLevel = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2,
  			  y: (Q.height/2 + 40 * Q.state.get('scale'))
  		}));

  		var buttonSelectLevel = containerSelectLevel.insert
  		(
  			new Q.UI.Button
  			({
  				x: 0,
  				y: 0,
  				fill: "#CCCCCC",
  				label: "Select level",
  				border: 2,
          shadowColor: "rgba(0,0,0,0.5)",
  				scale: Q.state.get('scale')
  		 })
  		);

  		buttonSelectLevel.on("click",function()
  		{
  			  Q.clearStages();
  			  Q.stageScene('levelSelection');
  		});

  		containerSelectLevel.fit(20);

      Q.state.set('speed', 0);

      Q.stageScene('hud', 3);

      var currentSelectedButton = 'buttonStartLevel';

      // inputs
  		Q.input.on("enter", this, function()
  		{
          if(currentSelectedButton === 'buttonStartLevel') {
            Q.clearStages();
            Q.stageScene('level');
          }
		  		else {
            Q.clearStages();
    			  Q.stageScene('levelSelection');
          }
  		});

      Q.input.on("up", this, function()
  		{
          buttonSelectLevel.p.fill = Q.state.get('buttonFillColorUnselected');
          buttonStartLevel.p.fill = Q.state.get('buttonFillColorSelected');

          buttonSelectLevel.p.fontColor = Q.state.get('buttonTextColorUnselected');
          buttonStartLevel.p.fontColor = Q.state.get('buttonTextColorSelected');

          buttonSelectLevel.p.stroke = Q.state.get('buttonTextColorUnselected');
          buttonStartLevel.p.stroke = Q.state.get('buttonTextColorSelected');

          buttonSelectLevel.p.shadow = 0;
          buttonStartLevel.p.shadow = 5;

          currentSelectedButton = 'buttonStartLevel';
  		});

      Q.input.on("down", this, function()
  		{
		  		buttonStartLevel.p.fill = Q.state.get('buttonFillColorUnselected');
          buttonSelectLevel.p.fill = Q.state.get('buttonFillColorSelected');

          buttonStartLevel.p.fontColor = Q.state.get('buttonTextColorUnselected');
          buttonSelectLevel.p.fontColor = Q.state.get('buttonTextColorSelected');

          buttonStartLevel.p.stroke = Q.state.get('buttonTextColorUnselected');
          buttonSelectLevel.p.stroke = Q.state.get('buttonTextColorSelected');

          buttonSelectLevel.p.shadow = 5;
          buttonStartLevel.p.shadow = 0;

          currentSelectedButton = 'buttonSelectLevel';
  		});

  	});

    Q.scene("levelSelection", function(stage) {

      self.set('currentScene', 'levelSelection');
      self.set('showHud', false);

    	Q.pauseGame();

    	Q.audio.stop('rocket.mp3');
    	Q.audio.stop('racing.mp3');

    	stage.insert(new Q.Level_Selection());

    	// assets
    	var assetLevel2 = 'star_locked.png';

    	if(self.get('me').get('user').get('reached_level') > 1) {
    		assetLevel2 = 'star.png';
      }

    	var assetLevel3 = 'star_locked.png';

    	if(self.get('me').get('user').get('reached_level') > 2) {
    		assetLevel3 = 'star.png';
      }

      var assetLevel4 = 'star_locked.png';

    	if(self.get('me').get('user').get('reached_level') > 3) {
    		assetLevel4 = 'star.png';
      }

      var assetLevel5 = 'star_locked.png';

    	if(self.get('me').get('user').get('reached_level') > 4) {
    		assetLevel5 = 'star.png';
      }

    	var assetLevel6 = 'star_coming_soon.png';
    	var assetLevel7 = 'star_coming_soon.png';
    	var assetLevel8 = 'star_coming_soon.png';
    	var assetLevel9 = 'star_coming_soon.png';

      // Level 1
      var level1Button = stage.insert(new Q.UI.Button
      (
    		{
    	      asset: 	'star.png',
    	      x: 		80,
    	      y: 		520,
    	      scale: 	0.7,
    	      label: 	'1'
        	}
      ));

      level1Button.on("click", function()
      {
          Q.state.set('level', 1);
          self.set('level', 1);
      		Q.clearStages();
      		Q.stageScene("mainMenu");
      });

      // Level 2
      var level2Button = stage.insert(new Q.UI.Button
    	(
    		{
    	      asset: 	assetLevel2,
    	      x: 		190,
    	      y: 		500,
    	      scale: 	0.7,
    	      label: 	'2'
        	}
      ));

      level2Button.on("click", function()
    	{
      		if(self.get('me').get('user').get('reached_level') > 1)
      		{
            Q.state.set('level', 2);
            self.set('level', 2);
      			Q.clearStages();
      			Q.stageScene("mainMenu");
      		}
    	});

    	// Level 3
    	var level3Button = stage.insert(new Q.UI.Button
    	(
    		{
    	      asset: 	assetLevel3,
    	      x: 		310,
    	      y: 		470,
    	      scale: 	0.7,
    	      label: 	'3'
        	}
      ));

      level3Button.on("click", function()
      {
    		if(self.get('me').get('user').get('reached_level') > 2)
    		{
          Q.state.set('level', 3);
          self.set('level', 3);
    			Q.clearStages();
    			Q.stageScene("mainMenu");
    		}
      });

    	// Level 4
    	var level4Button = stage.insert(new Q.UI.Button
    	(
  		  {
  	      asset: 	assetLevel4,
  	      x: 		323,
  	      y: 		370,
  	      scale: 	0.7,
  	      label: 	'4'
      	}
      ));

      level4Button.on("click", function()
      {
        if(self.get('me').get('user').get('reached_level') > 3)
      	{
          Q.state.set('level', 4);
          self.set('level', 4);
      		Q.clearStages();
      		Q.stageScene("mainMenu");
      	}
      });

    	// Level 5
    	var level5Button = stage.insert(new Q.UI.Button
    	(
    		{
  	      asset: 	assetLevel5,
  	      x: 		210,
  	      y: 		335,
  	      scale: 	0.7,
  	      label: 	'5'
        }
      ));

      level5Button.on("click", function()
    	{
        if(self.get('me').get('user').get('reached_level') > 4)
      	{
          Q.state.set('level', 5);
          self.set('level', 5);
      		Q.clearStages();
      		Q.stageScene("mainMenu");
      	}
    	});

    	// Level 6
    	var level6Button = stage.insert(new Q.UI.Button
    	(
    		{
    	      asset: 	assetLevel6,
    	      x: 		115,
    	      y: 		310,
    	      scale: 	0.7,
    	      label: 	'6'
        	}
       ));

       level6Button.on("click", function()
    	{

    	});

    	// Level 7
    	var level7Button = stage.insert(new Q.UI.Button
    	(
    		{
    	      asset: 	assetLevel7,
    	      x: 		65,
    	      y: 		230,
    	      scale: 	0.7,
    	      label: 	'7'
        	}
       ));

       level7Button.on("click", function()
    	{

    	});

    	// Level 8
    	var level8Button = stage.insert(new Q.UI.Button
    	(
    		{
    	      asset: 	assetLevel8,
    	      x: 		120,
    	      y: 		160,
    	      scale: 	0.7,
    	      label: 	'8'
        	}
       ));

       level8Button.on("click", function()
    	{

    	});

    	// Level 9
    	var level9Button = stage.insert(new Q.UI.Button
    	(
    		{
    	      asset: 	assetLevel9,
    	      x: 		215,
    	      y: 		130,
    	      scale: 	0.7,
    	      label: 	'9'
        	}
       ));

       level9Button.on("click", function()
    	{

    	});
    });

  	Q.scene("level", stage => {

      self.set('currentScene', 'level');
      self.set('showHud', true);

  		Q.unpauseGame();

      Ember.$("#footer_banner").empty();

      Q.audio.play('racing.mp3', { loop: true });
  		Q.audio.play('rocket.mp3', { loop: true });

  		Q.state.set('distance', 0);
      self.set('distance', 0);
  		Q.state.set('stars', 0);
      self.set('stars', 0);

  		distanceToGoalRef = 50;
  		globalSpeedRef    = 250;
      Q.state.set('maxSpeedRef', 500);

  		Q.state.set('distanceToGoal', Math.floor(distanceToGoalRef * ( 1 + ((Q.state.get('level') - 1) / 10) )));
  		Q.state.set('speed', 250);
      Q.state.set('maxSpeed', 500);

  		if(Q.touchDevice)
  		{
  			globalSpeedRef = globalSpeedRef * Q.state.get('scale');
        Q.state.set('speed', Q.state.get('speed') * Q.state.get('scale'));

  			Q.state.set('maxSpeed', Q.state.get('maxSpeed') * Q.state.get('scale'));
        Q.state.set('maxSpeedRef', Q.state.get('maxSpeedRef') * Q.state.get('scale'));
  		}

  		stage.insert(new Q.StarMaker());

      var asteroidMaker = new Q.AsteroidMaker();
      Q.state.set('asteroidMaker', asteroidMaker);
  		stage.insert(asteroidMaker);

      var rocket = new Q.Rocket();
      stage.insert(rocket);

      if(!Ember.isEmpty(self.get('rocket').get('cannon'))) {
        var cannon = new Q.Cannon();
            cannon.setRocket(rocket);
            rocket.setCannon(cannon);
    		stage.insert(cannon);
      }

      self.setupLevel(Q.state.get('level'));

  		Q.stageScene('hud', 3, new Q('Rocket').first().p);

  		// inputs
  		Q.input.on("space", this, function()
  		{
		  		if(Q.loop)
		  		{
		  			Q.pauseGame();
		  		}
		  		else if(!Q.loop)
		  		{
		  			Q.unpauseGame();
		  		}
  		});

      Q.input.on("enter", this, function() {
      });

  	});

  	Q.scene("gameOver", function(stage) {

      self.set('showHud', true);

      Q.pauseGame();

      Q.audio.stop('rocket.mp3');
  		Q.audio.stop('racing.mp3');

      Q.state.set('speed', 0);
      self.get('cannon').set('isReloading', false);
      Q.state.set('shield_is_reloading', false);
      Q.state.set('engine_is_reloading', false);

      if(self.get('cannonReloadingTimeout')) {
        clearTimeout(self.get('cannonReloadingTimeout'));
      }

      if(self.get('shieldReloadingTimeout')) {
        clearTimeout(self.get('shieldReloadingTimeout'));
      }

      if(self.get('engineReloadingTimeout')) {
        clearTimeout(self.get('engineReloadingTimeout'));
      }

      new LSM_Slot({
          adkey: '6df',
          ad_size: '728x90',
          slot: 'slot126743',
          _render_div_id: 'footer_banner',
          _preload: true
      });

      self.get('me').get('user').then(user => {

        self.set('old_score', user.get('score'));

        if(self.get('new_score') > user.get('score')) {
          user.set('score', self.get('new_score'));
          self.sendScoreToFB(self.get('new_score'));
          self.set('newHighscore', true);
    		}
        else {
          self.set('newHighscore', false);
        }

        if(self.get('me').get('activeChallenge')) {
          if(self.get('me').get('activeChallenge').get('iAm') === 'from_player') {
            self.get('me').get('activeChallenge').set('from_player_score', self.get('new_score'));
            self.get('me').get('activeChallenge').set('from_player_has_played', true);
          }
          else {
            self.get('me').get('activeChallenge').set('to_player_score', self.get('new_score'));
            self.get('me').get('activeChallenge').set('to_player_has_played', true);
          }
          self.get('me').get('activeChallenge').save();
          self.get('me').set('activeChallenge', null);
        }

        self.set('currentScene', 'gameOver');

        var new_stars_amount = user.get('stars') + (parseInt(Q.state.get('stars')) * parseInt(Q.state.get('level')));
        var new_experience = user.get('experience') + self.get('new_score');
        user.set('stars', new_stars_amount);
        user.set('experience', new_experience);

        user.save().then(() => {
          self.get('targetObject.store').query('user', { 'mode': 'leaderboard', 'type': 'score' }).then(users => {
            var leaderboard = self.get('targetObject.store').peekRecord('leaderboard', 1);
            if(Ember.isEmpty(leaderboard)) {
              leaderboard = self.get('targetObject.store').createRecord('leaderboard', {
                id: 1,
                name: 'world score leaderboard',
                players: users
              });
            }
            else {
              leaderboard.set('players', users);
            }
          });
          self.get('targetObject.store').query('user', { 'mode': 'leaderboard', 'type': 'challenges' }).then(users => {
            var leaderboard = self.get('targetObject.store').peekRecord('leaderboard', 2);
            if(Ember.isEmpty(leaderboard)) {
              leaderboard = self.get('targetObject.store').createRecord('leaderboard', {
                id: 2,
                name: 'world challenges leaderboard',
                players: users
              });
            }
            else {
              leaderboard.set('players', users);
            }
          });
        });

      });

      // Try again
      var container = stage.insert( new Q.UI.Container ({
          x: Q.width/2,
          y: (Q.height/2 + 130 * Q.state.get('scale'))
      }));

      var buttonTryAgain = container.insert ( new Q.UI.Button ({
        x: 0,
        y: 0,
        fontColor: Q.state.get('buttonTextColorSelected'),
        stroke: Q.state.get('buttonTextColorSelected'),
				fill: Q.state.get('buttonFillColorSelected'),
        shadow: 5,
        shadowColor: "rgba(0,0,0,0.5)",
        label: "Try level again",
        border: 2,
        scale: Q.state.get('scale')
      }));

      buttonTryAgain.on("click",function() {
          Q.clearStages();
          Q.stageScene('level');
          Q.stageScene('hud', 3, new Q('Rocket').first().p);
      });

      container.fit(20);

      // Select level
      var containerSelectLevel = stage.insert( new Q.UI.Container ({
          x: Q.width/2,
          y: (Q.height/2 + 200 * Q.state.get('scale'))
      }));

      var buttonSelectLevel = containerSelectLevel.insert ( new Q.UI.Button ({
          x: 0,
          y: 0,
          fill: "#CCCCCC",
          label: "Select level",
          shadowColor: "rgba(0,0,0,0.5)",
          border: 2,
          scale: Q.state.get('scale')
      }));

      buttonSelectLevel.on("click",function() {
          Q.clearStages();
          Q.stageScene('levelSelection');
      });

      containerSelectLevel.fit(20);

      var currentSelectedButton = 'buttonTryAgain';

      // inputs
  		Q.input.on("enter", this, function() {
        if(currentSelectedButton === 'buttonTryAgain') {
          Q.clearStages();
          Q.stageScene('level');
          Q.stageScene('hud', 3, new Q('Rocket').first().p);
        }
        else {
          Q.clearStages();
          Q.stageScene('levelSelection');
        }
  		});

      Q.input.on("up", this, function() {
          buttonSelectLevel.p.fill = Q.state.get('buttonFillColorUnselected');
          buttonTryAgain.p.fill = Q.state.get('buttonFillColorSelected');

          buttonSelectLevel.p.fontColor = Q.state.get('buttonTextColorUnselected');
          buttonTryAgain.p.fontColor = Q.state.get('buttonTextColorSelected');

          buttonSelectLevel.p.stroke = Q.state.get('buttonTextColorUnselected');
          buttonTryAgain.p.stroke = Q.state.get('buttonTextColorSelected');

          buttonSelectLevel.p.shadow = 0;
          buttonTryAgain.p.shadow = 5;

          currentSelectedButton = 'buttonTryAgain';
  		});

      Q.input.on("down", this, function() {
		  		buttonTryAgain.p.fill = Q.state.get('buttonFillColorUnselected');
          buttonSelectLevel.p.fill = Q.state.get('buttonFillColorSelected');

          buttonTryAgain.p.fontColor = Q.state.get('buttonTextColorUnselected');
          buttonSelectLevel.p.fontColor = Q.state.get('buttonTextColorSelected');

          buttonTryAgain.p.stroke = Q.state.get('buttonTextColorUnselected');
          buttonSelectLevel.p.stroke = Q.state.get('buttonTextColorSelected');

          buttonSelectLevel.p.shadow = 5;
          buttonTryAgain.p.shadow = 0;

          currentSelectedButton = 'buttonSelectLevel';
  		});
    });
  },

  loadGameStates: function() {

    // var self = this;

    if(!Ember.isEmpty(this.get('me'))) {

      this.get('me').get('user').then(user => {

        if(!Ember.isEmpty(user)) {

          // now that the user is loaded, all relevant data for the game to load is present, e.g. the reached level
          if(!this.get('gameCanvasIsLoaded')) {
            this.loadGameCanvas();
          }

          user.get('rocket').then(rocket => {

            if(!Ember.isEmpty(rocket)) {

              this.set('rocket', rocket);

              var Q = this.get('Q');

              rocket.get('cannon').then(cannon => {

                if(!Ember.isEmpty(cannon)) {
                  if(cannon.get('status') !== 'unlocked') {
                    cannon.set('currentValue', 0);
                    Q.state.set('bps', 0);
                  }
                  else {
                    cannon.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                      if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
                        selectedRocketComponentModelMm.get('selectedRocketComponentModelCapacityLevelMm').then(rocketComponentModelCapacityLevelMm => {
                          if(!Ember.isEmpty(rocketComponentModelCapacityLevelMm)) {
                            rocketComponentModelCapacityLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelCapacityLevel => {
                              if(!Ember.isEmpty(rocketComponentModelCapacityLevel)) {
                                  cannon.set('currentValue', rocketComponentModelCapacityLevel.get('value'));
                              }
                            });
                          }
                        });
                        selectedRocketComponentModelMm.get('selectedRocketComponentModelRechargeRateLevelMm').then(rocketComponentModelRechargeRateLevelMm => {
                          if(!Ember.isEmpty(rocketComponentModelRechargeRateLevelMm)) {
                            rocketComponentModelRechargeRateLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelRechargeRateLevel => {
                              if(!Ember.isEmpty(rocketComponentModelRechargeRateLevel)) {
                                Q.state.set('bps', rocketComponentModelRechargeRateLevel.get('value'));
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              });

              rocket.get('shield').then(shield => {

                if(!Ember.isEmpty(shield)) {
                  if(shield.get('status') !== 'unlocked') {
                    Q.state.set('shield', 0);
                    Q.state.set('srr', 0);
                  }
                  else {
                    shield.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                      if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
                        selectedRocketComponentModelMm.get('selectedRocketComponentModelCapacityLevelMm').then(rocketComponentModelCapacityLevelMm => {
                          if(!Ember.isEmpty(rocketComponentModelCapacityLevelMm)) {
                            rocketComponentModelCapacityLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelCapacityLevel => {
                              if(!Ember.isEmpty(rocketComponentModelCapacityLevel)) {
                                Q.state.set('shield', rocketComponentModelCapacityLevel.get('value'));
                              }
                            });
                          }
                        });
                        selectedRocketComponentModelMm.get('selectedRocketComponentModelRechargeRateLevelMm').then(rocketComponentModelRechargeRateLevelMm => {
                          if(!Ember.isEmpty(rocketComponentModelRechargeRateLevelMm)) {
                            rocketComponentModelRechargeRateLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelRechargeRateLevel => {
                              if(!Ember.isEmpty(rocketComponentModelRechargeRateLevel)) {
                                Q.state.set('srr', rocketComponentModelRechargeRateLevel.get('value'));
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              });

              rocket.get('engine').then(engine => {

                if(!Ember.isEmpty(engine)) {
                  if(engine.get('status') !== 'unlocked') {
                    Q.state.set('slowdowns', 0);
                    Q.state.set('sdrr', 0);
                  }
                  else {
                    engine.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                      if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
                        selectedRocketComponentModelMm.get('selectedRocketComponentModelCapacityLevelMm').then(rocketComponentModelCapacityLevelMm => {
                          if(!Ember.isEmpty(rocketComponentModelCapacityLevelMm)) {
                            rocketComponentModelCapacityLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelCapacityLevel => {
                              if(!Ember.isEmpty(rocketComponentModelCapacityLevel)) {
                                Q.state.set('slowdowns', rocketComponentModelCapacityLevel.get('value'));
                              }
                            });
                          }
                        });
                        selectedRocketComponentModelMm.get('selectedRocketComponentModelRechargeRateLevelMm').then(rocketComponentModelRechargeRateLevelMm => {
                          if(!Ember.isEmpty(rocketComponentModelRechargeRateLevelMm)) {
                            rocketComponentModelRechargeRateLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelRechargeRateLevel => {
                              if(!Ember.isEmpty(rocketComponentModelRechargeRateLevel)) {
                                Q.state.set('sdrr', rocketComponentModelRechargeRateLevel.get('value'));
                              }
                            });
                          }
                        });
                      }
                    });
                  }
                }
              });
            }
          });
        }
      });
    }
  }.observes(
    'me.user.rocket.cannon.status',
    'me.user.rocket.cannon.selectedRocketComponentModelMm',
    'me.user.rocket.shield.status',
    'me.user.rocket.shield.selectedRocketComponentModelMm',
    'me.user.rocket.engine.status',
    'me.user.rocket.engine.selectedRocketComponentModelMm'
  ).on('init'),

  loadGameCanvas: function() {
    var Q = this.get('Q');
    var self = this;

    this.set('gameCanvasIsLoaded', true);

    Q.load
    (
      [
        "level_selection_coming_soon.png",
        "rocket.png",
        "cannon.png",
        "bullet.png",
        "star.png",
        "star_locked.png",
        "star_coming_soon.png",
        "asteroid.png",
        "bigAsteroid.png",
        "explodingAsteroid.png",
        "ufo.png",
        "menuicons/distance.png",
        "menuicons/goal.png",
        "menuicons/speed.png",
        "menuicons/level.png",
        "menuicons/points.png",
        "rocket.mp3",
        "collecting_a_star.mp3",
        "racing.mp3",
        "explosion.mp3"
      ],

      function()
      {
        Q.sheet("rocket", "rocket.png", { tileW: 50, tileH: 140 });
        Q.sheet("cannon", "cannon.png", { tileW: 50, tileH: 140 });
        Q.sheet("bullet","bullet.png", { tileW: 20, tileH: 20 });
        Q.sheet("star","star.png", { tileW: 60, tileH: 60 });
        Q.sheet("star_locked","star.png", { tileW: 61, tileH: 64 });
        Q.sheet("asteroid","asteroid.png", { tileW: 70, tileH: 70 });
        Q.sheet("bigAsteroid","bigAsteroid.png", { tileW: 100, tileH: 100 });
        Q.sheet("explodingAsteroid","explodingAsteroid.png", { tileW: 200, tileH: 200 });
        Q.sheet("ufo","ufo.png", { tileW: 72, tileH: 40 });
        Q.sheet("distance","menuicons/distance.png", { tileW: 24, tileH: 24 });
        Q.sheet("level","menuicons/level.png", { tileW: 24, tileH: 24 });
        Q.sheet("points","menuicons/points.png", { tileW: 24, tileH: 24 });
        Q.sheet("goal","menuicons/goal.png", { tileW: 24, tileH: 24 });
        Q.sheet("speed","menuicons/speed.png", { tileW: 24, tileH: 24 });

        Q.animations('rocket', {
          // flying: { frames: [0], loop: false },
          explosion: { frames: [1,2,3,4,5], rate: 1/15, loop: false, trigger: "exploded" }
        });

        Q.animations('cannon', {
          reloading: { frames: [0], rate: 1/1, loop: false },
          reloaded: { frames: [1], rate: 1/1, loop: false }
        });

        Q.animations('explodingAsteroid',
        {
          // flying: { frames: [0], loop: false },
          explosion: { frames: [0,1,2], rate: 1/15, loop: false, trigger: "exploded" }
        });

        Q.stageScene("levelSelection");

        Q.debug = true;
        Q.debugFill = true;
      },
      {
        progressCallback: function(loaded,total) {
          var element = document.getElementById("loading_progress");
              element.style.width = Math.floor(loaded/total*100) + "%";

          if(loaded/total === 1) {
            self.set('isLoading', false);
          }
        }
      }
    );
  },

  setupLevel: function(level) {

    var Q = this.get('Q');

    var asteroidMaker = Q.state.get('asteroidMaker');
    var bigAsteroidMaker = Q.state.get('bigAsteroidMaker');
    var explodingAsteroidMaker = Q.state.get('explodingAsteroidMaker');
    var ufoMaker = Q.state.get('ufoMaker');

    asteroidMaker.p.launchRandomFactor = 0.53;

    if(level >= 2)
    {
      if(!ufoMaker) {
        ufoMaker = new Q.UfoMaker();
        Q.state.set('ufoMaker', ufoMaker);
      }

      Q.stage().insert(ufoMaker);

      asteroidMaker.p.launchRandomFactor = 0.8;
      ufoMaker.p.isActive = 1;
    }
    if(level >= 3)
    {
      if(!bigAsteroidMaker) {
        bigAsteroidMaker = new Q.BigAsteroidMaker();
        Q.state.set('bigAsteroidMaker', bigAsteroidMaker);
      }

      Q.stage().insert(bigAsteroidMaker);

      asteroidMaker.p.launchRandomFactor = 0.9;
      bigAsteroidMaker.p.launchRandomFactor = 1.1;
      ufoMaker.p.isActive = 0;
      bigAsteroidMaker.p.isActive = 1;
    }
    if(level >= 4)
    {
      asteroidMaker.p.launchRandomFactor = 1.3;
      bigAsteroidMaker.p.launchRandomFactor = 1.6;
      ufoMaker.p.isActive = 1;
      bigAsteroidMaker.p.isActive = 1;
    }
    if(level >= 5)
    {
      if(!explodingAsteroidMaker) {
        explodingAsteroidMaker = new Q.ExplodingAsteroidMaker();
        Q.state.set('explodingAsteroidMaker', explodingAsteroidMaker);
      }

      Q.stage().insert(explodingAsteroidMaker);

      asteroidMaker.p.launchRandomFactor = 1.3;
      bigAsteroidMaker.p.launchRandomFactor = 1.6;
      ufoMaker.p.isActive = 1;
      bigAsteroidMaker.p.isActive = 0;
    }
  },

  sendScoreToFB: function(score) {

    FB.api('/me/permissions', response => {

      if( !response.error ) {

        this.set('hasPostPermission', false);

        for( var i=0; i < response.data.length; i++ ) {
      	    if(response.data[i].permission === 'publish_actions' && response.data[i].status === 'granted' ) {
              this.set('hasPostPermission', true);
            }
      	}

      	if(this.get('hasPostPermission')) {
          FB.api('/me/scores/', 'post', { score: score }, function(response)
        	{
        		if( response.error )
      	  	{
      			  console.error('sendScoreToFB failed', response);
      	  	}
      	  	else
      	  	{
      	  		console.log('Score posted to Facebook', response);
      	  	}
        	});
        }
        else {
          // show post to FB button
        }
	    }
	    else
	    {
	      	console.error('ERROR - /me/permissions', response);
	    }
  	});
  },

  aChallengeIsActive: function() {
    if(!Ember.isEmpty(this.get('me').get('activeChallenge'))) {
      return true;
    }
    else {
      return false;
    }
  }.property('me.activeChallenge'),

  actions: {
    login: function() {
      this.login();
    },
    postScoreToFB: function() {

      var old_score = this.get('old_score');
      var new_score = this.get('new_score');

      FB.ui({
        method: 'share_open_graph',
        action_type: 'games.highscores',
        action_properties: JSON.stringify({
          game:'https://apps.facebook.com/little_rocket/',
          old_high_score: old_score,
          new_high_score: new_score
        })
      }, function(response){
        console.log(response);
      });
    }
  }

});
