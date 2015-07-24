/* global Quintus */
import Ember from 'ember';

export default Ember.Component.extend({

  Q: null,
  me: null,
  rocket: null,

  isLoading: true,
  isPaused: true,

  didInsertElement: function() {

    var self = this;

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

    // Add in the controls
    Q.input.keyboardControls
    ({
      	LEFT: "left",
      	RIGHT: "right",
      	UP: "fire",
      	SPACE: "space"
    });

    Q.input.touchControls
    ({
      	controls:
      	[
      		['left','<' ],
          [],
          ['fire', '*'],
          [],
          ['right','>' ]
       ]
    });

    Q.gravityX = 0;
    Q.gravityY = 0;

    Q.SPRITE_ROCKET   = 1;
    Q.SPRITE_STAR     = 2;
    Q.SPRITE_ASTEROID = 4;
    Q.MENU_ICON       = 8;
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
    Q.state.set('bullets', 0);

    var asteroidMaker = null;
    var ufoMaker      = null;

    var distanceToGoalRef = 50;
    var globalSpeedRef    = 50;
    var maxSpeedRef       = 100;

    Q.state.set('distanceToGoal', 50);
    Q.state.set('speed', 50);
    var maxSpeed        = 100;

    Q.TransformableSprite.extend("Rocket", {
    	init: function(p) {
    		  this._super(p, {
    				name:          "Rocket",
    				sheet:         "rocket",
    				sprite:        "rocket", // name of the animation
    				frame:         0,
    				direction:     'up',
    				stars:         0,
    				vSpeed:        50,
    				x:             25, // x location of the center
    				y:             70, // y location of the center
    				tileW:         50,
    				tileH:         140,
    				type:          Q.SPRITE_ROCKET,
    				collisionMask: Q.SPRITE_STAR,
            lastSpeedUp:   0,
            points:        [],
            collided:      false,
            scale: 			   Q.state.get('scale'),
            hasACanon: 	   false,
            canonBlocked:  false,
            canonCapacity: 3,
            bullets: 		   3
    		  });

    		  this.p.hasACanon = self.get('rocket').get('hasACanon');

    		  // Drehpunkt zentral
    		  this.p.points = [
    										  // links, halb oben
    										  [-25, -20],
    										  // Raketenspitze
    										  [0, -this.p.tileH / 2],
    										  // rechts, halb oben
    										  [25, -20],
    										  // rechts, halb unten
    										  [25, 5],
    										  // Antriebsdüse rechts
    										  [10, 20],
    										  // rechts, unten
    										  [25, -35 + this.p.tileH / 2],
    										  // mitte unten
    										  [0, -30  + this.p.tileH / 2],
    										  // links, unten
    										  [-25, -35  + this.p.tileH / 2],
                          // Antriebsdüse links
    										  [-10, 20 ],
                          // links, halb oben
    										  [-25, 5]
    								];

    		  this.add("2d, platformerControls, animation");

    		  this.on('exploded', this, 'destroy');
    		  this.on('fireCanon', this, 'fireCanon');
    	},

    	step: function(dt)
    	{
    		if(self.get('isPaused') === false)
    		{
    			this.p.lastSpeedUp += dt;

    			if(this.p.lastSpeedUp > 1)
    			{
            Q.state.set('speed', Q.state.get('speed') + 1);

    				this.p.speed = Q.state.get('speed');

    				Q.state.set("distanceToGoal", Q.state.get("distanceToGoal") - 1);
    				Q.state.set("distance", Q.state.get("distance") + 1);

    				this.p.lastSpeedUp = 0;
    			}


    			if(Q.state.get("distanceToGoal") <= 0)
    			{
    				this.levelUp();
    			}

    			// rocket can't leave the screen
    			if(
    					 this.p.x > Q.width - 30 && this.p.vx > 0 ||
               this.p.x < 30 && this.p.vx < 0
    			 )
    			{
    				this.p.vx = 0;
    			}

    		  // rotate the rocket
    		  // based on our velocity
    		  if(this.p.vx > 0 && this.p.angle < 45) // nach rechts drehen
    		  {
    				this.rotate(this.p.angle + 5);
    		  }
    		  else if(this.p.vx < 0 && this.p.angle > -45) // nach links drehen
    		  {
    				this.rotate(this.p.angle - 5);
    		  }
    		  else if(this.p.vx === 0)
    		  {
    				if(this.p.angle > 0)
    				{
    					 if(this.p.angle - 5 < 0) {
    						this.rotate(0);
              }
    					else {
    						this.rotate(this.p.angle - 5);
              }
    				}
    				else
    				{
    					if(this.p.angle + 5 > 0) {
    						this.rotate(0);
              }
    					else {
    						this.rotate(this.p.angle + 5);
              }
    				}
    		  }

    		  	// fire Canon
    		  	if(Q.inputs['fire'] && this.p.hasACanon)
    		  	{
    		    	this.trigger("fireCanon");
    		  	}
    		}
    	},

    	fireCanon: function()
    	{
    		if(this.p.canonBlocked === false && this.p.bullets > 0)
    		{
    			this.p.canonBlocked = true;

    			var bullet = new Q.Bullet();
    	    	this.stage.insert(bullet);

    	    	bullets--;
    	    	this.p.bullets = bullets;
    	    	Q.state.set("bullets", bullets);

    	    	var me = this;

    	    	setTimeout(function(){ me.p.canonBlocked = false; }, 500);
    	   }
    	},

    	destroy: function()
    	{
    		// this.destroy();
    		Q.pauseGame();
    	},

    	levelUp: function()
    	{
    		Q.state.set('level', Q.state.get('level') + 1);

    		distanceToGoalRef *= 1.2;
    		globalSpeedRef    *= 1.2;
    		maxSpeedRef       *= 1.2;

    		Q.state.set('distanceToGoal', distanceToGoalRef);
    		Q.state.set('speed', globalSpeedRef);
    		maxSpeed        = maxSpeedRef;

    		if(Q.state.get('level') === 2)
    		{
    			Q.stage().insert(new Q.UfoMaker());
    			asteroidMaker.p.launchDelay = 0.6 * Q.state.get('scale') - (Q.state.get('speed') / maxSpeed);

    			if(Q.state.get('level') > max_level)
    			{
    				max_level = Q.state.get('level');
    				sendLevel(max_level);
    			}
    		}

    		if(Q.state.get('level') === 3)
    		{
    			Q.stage().insert(new Q.ExplodingAsteroidMaker());

    			if(Q.state.get('level') > max_level)
    			{
    				max_level = Q.state.get('level');
    				sendLevel(max_level);
    			}
    		}
    	}
    });

    // Create the Star sprite
    Q.Sprite.extend("Star",
    {
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

    Q.component("starControls",
    {
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

    	 step: function(dt)
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

    Q.GameObject.extend("StarMaker",
    {
    	 init: function()
    	 {
    		  this.p =
    		  {
    				launchDelay: Q.state.get('scale') - (Q.state.get('speed') / maxSpeed),
    				launchRandom: 1,
    				launch: 1
    		  };
    	 },

    	 update: function(dt)
    	 {
    		  this.p.launch -= dt;

    		  if(this.p.launch < 0)
    		  {
    				this.stage.insert(new Q.Star());
    				this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    		  }
    	 }
    });

    Q.Sprite.extend("Asteroid",
    {
    	// When an asteroid is hit..
    	sensor: function(colObj)
    	{
    		// Destroy it
    		if(colObj.isA('Rocket') && !colObj.collided)
    		{
    			colObj.collided = true;

    			Q.audio.stop('rocket.mp3');
    			Q.audio.stop('racing.mp3');
    			Q.audio.play('explosion.mp3');

    			globalSpeedRef = 0;
    			colObj.play('explosion');

    			Q.stageScene("gameOver", 2);
    		}
    		else if(colObj.isA('Bullet') && !colObj.collided)
    		{
    			colObj.collided = true;

    			Q.audio.play('explosion.mp3');

    			colObj.destroy();
    			this.destroy();
    		}
    	}
    });

    Q.Asteroid.extend("NormalAsteroid",
    {
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

    Q.Asteroid.extend("ExplodingAsteroid",
    {
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
    			points: [],
    			isExploded: false
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
    		this.on('exploded', this, 'destroy');

    		this.add("2d, asteroidControls, animation");
    	},

    	explode: function()
    	{
    		this.play('explosion');
    	}
    });

    Q.component("asteroidControls",
    {
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

    	step: function(dt)
    	{
    		// grab the entity's properties
    		// for easy reference
    		var p = this.entity.p;

    		// based on our direction, try to add velocity
    		// in that direction
    		switch(p.direction)
    		{
    			case "down":  	p.vy = Q.state.get('speed') * 1.2;
    								break;
    		}

    		if(this.entity.isA('ExplodingAsteroid')	&&
          p.y > (Q.height * 0.75) &&
          p.isExploded === false)
    		{
    			p.isExploded = true;
    		  	Q.audio.play('explosion.mp3');
    		  	this.entity.explode();
    		}

    		else if(p.y > Q.height)
    		{
    			this.entity.destroy();
    		}
    	}
    });

    Q.GameObject.extend("AsteroidMaker",
    {
    	init: function()
    	{
    		this.p =
    		{
    			launchDelay: 0.4 * Q.state.get('scale') - (Q.state.get('speed') / maxSpeed),
    			launchRandom: 1,
    			launch: 1
    		};
    	},

     	update: function(dt)
     	{
    	  	this.p.launch -= dt;

    	  	if(this.p.launch < 0)
    	  	{
    			this.stage.insert(new Q.NormalAsteroid());
    			this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    		}
     	}
    });

    Q.GameObject.extend("ExplodingAsteroidMaker",
    {
    	init: function()
    	{
    		this.p =
    		{
    			launchDelay: 2 * Q.state.get('scale') - (Q.state.get('speed') / maxSpeed),
    			launchRandom: 1,
    			launch: 2
    		};
    	},

    	update: function(dt)
    	{
    		this.p.launch -= dt;

    		if(this.p.launch < 0)
    		{
    			this.stage.insert(new Q.ExplodingAsteroid( {size : 50} ));
    			this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    		}
    	}
    });

  	Q.scene('hud',function(stage)
  	{
  		// Icons
  		stage.insert(new Q.DistanceIcon({
        type:  Q.MENU_ICON
      }));

  		stage.insert(new Q.LevelIcon({
        type:  Q.MENU_ICON
      }));

      stage.insert(new Q.StarIcon({
        type:  Q.MENU_ICON
      }));

  		stage.insert(new Q.SpeedIcon({
        type:  Q.MENU_ICON
      }));

  		stage.insert(new Q.GoalIcon({
        type:  Q.MENU_ICON
      }));

  		var scoreContainer = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: Q.state.get('scale') * 10,
  					y: Q.state.get('scale') * 10
  			  }
  			)
  		);

  		scoreContainer.insert(new Q.ScoreText(scoreContainer));

  		scoreContainer.fit(0);

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
  		container.insert(new Q.SpeedText(container, {
        maxSpeed: maxSpeed
      }));
  		container.insert(new Q.DistanceToGoalText(container));

  		container.fit(0);

  		var containerAmmo = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: Q.state.get('scale') * 300,
  					y: Q.state.get('scale') * 20
  			  }
  			)
  		);

  		containerAmmo.insert(new Q.BulletsText(containerAmmo));
  	});

  	Q.scene("mainMenu",function(stage)
  	{
  		self.set('isPaused', true);
  		Q.pauseGame();

  		Q.audio.stop('rocket.mp3');
  		Q.audio.stop('racing.mp3');

  		stage.insert(new Q.Rocket({x: Q.width/2, y: rocket_y }));

  		// start
  		var container = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2,
  			  y: Q.height/2 - 40 * Q.state.get('scale')
  		}));

  		var button = container.insert
  		(
  			new Q.UI.Button
  			({
  				x: 0,
  				y: 0,
  				scale: Q.state.get('scale'),
  				fill: "#CCCCCC",
  				label: "Start",
  				border: 2,
  		    borderColor: "rgba(0,0,0,0.5)"
  			})
  		);

  		button.on("click",function()
  		{
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

  		Q.stageScene('hud', 3, Q('Rocket').first().p);
  	});

    Q.scene("levelSelection", function(stage)
    {
    	self.set('isPaused', true);
    	Q.pauseGame();

    	Q.audio.stop('rocket.mp3');
    	Q.audio.stop('racing.mp3');

    	stage.insert(new Q.Level_Selection());

    	// assets
    	var assetLevel2 = 'star_locked.png';

    	if(self.get('me').get('user').get('max_level') > 1) {
    		assetLevel2 = 'star.png';
      }

    	var assetLevel3 = 'star_locked.png';

    	if(self.get('me').get('user').get('max_level') > 2) {
    		assetLevel3 = 'star.png';
      }

    	var assetLevel4 = 'star_locked.png';
    	var assetLevel5 = 'star_locked.png';
    	var assetLevel6 = 'star_locked.png';
    	var assetLevel7 = 'star_locked.png';
    	var assetLevel8 = 'star_locked.png';
    	var assetLevel9 = 'star_locked.png';

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
      		if(max_level > 1)
      		{
            Q.state.set('level', 2);
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
      		if(max_level > 2)
      		{
            Q.state.set('level', 3);
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

      this.set('isPaused', false);
  		Q.unpauseGame();

  		Q.audio.play('rocket.mp3', { loop: true });
  		Q.audio.play('racing.mp3', { loop: true });

  		Q.state.set('distance', 0);
  		Q.state.set('stars', 0);
  		Q.state.set('bullets', 0);

  		if(this.get('rocket').get('hasACanon')) {
        Q.state.set('bullets', cockpit.canon.capacity);
      }

  		distanceToGoalRef = 50;
  		globalSpeedRef    = 250;
  		maxSpeedRef       = 500;

  		Q.state.set('distanceToGoal', 50);
  		Q.state.set('speed', 250);
  		maxSpeed          = 500;

  		if(Q.touchDevice)
  		{
  			globalSpeedRef = globalSpeedRef * Q.state.get('scale');
        Q.state.set('speed', Q.state.get('speed') * Q.state.get('scale'));

  			maxSpeed = maxSpeed * Q.state.get('scale');
  			maxSpeedRef = maxSpeedRef * Q.state.get('scale');
  		}

  		stage.insert(new Q.StarMaker());

  		asteroidMaker = new Q.AsteroidMaker();
  		stage.insert(asteroidMaker);

  		stage.insert(new Q.Rocket({x: Q.width/2, y: rocket_y }));

  		if(Q.state.get('level') > 1)
  		{
  			asteroidMaker.p.launchDelay = 0.6 * Q.state.get('scale') - (Q.state.get('speed') / maxSpeed);
  			Q.stage().insert(new Q.UfoMaker());
  		}

  		if(Q.state.get('level') > 2)
  		{
  			Q.stage().insert(new Q.ExplodingAsteroidMaker());
  		}

  		Q.stageScene('hud', 3, Q('Rocket').first().p);

  		// pause game
  		Q.input.on("space", this, function()
  		{
  			console.log(Q.loop);
  		  		if(Q.loop)
  		  		{
  		  			Q.pauseGame();
  		  			self.set('isPaused', true);
  		  		}
  		  		else if(!Q.loop)
  		  		{
  		  			Q.unpauseGame();
  		  			self.set('isPaused', false);
  		  		}

  		});

  	});

  	Q.scene("gameOver", function(stage)
  	{
  		self.set('isPaused', true);
  		Q.pauseGame();

  		Q.audio.stop('rocket.mp3');
  		Q.audio.stop('racing.mp3');

  		var scoreInfo = "Your score:\n\n";

  		if(Q.state.get('distance') + Q.state.get('stars') > self.get('me').get('user').get('score'))
  		{
  			scoreInfo = "You beat your own highscore!\n\n";

  			saveScore(Q.state.get('distance') + Q.state.get('stars'));
  		}

      self.get('me').get('user').then(user => {
        var new_stars_amount = user.get('stars') + parseInt(Q.state.get('stars'));
        user.set('stars', new_stars_amount);
        user.save();
      });

  		var containerText = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2, y: Q.height/3 + 70, fill: "rgba(0,0,0,0.5)"
  		}));

      var color = 'black';

  		if(Q.state.get('scale') > 1)
  		{
  			color = 'black';
  			size = 30;
  		}
  		else
  		{
  			color = 'white';
  			size = 20;
  		}

  		stage.insert(new Q.UI.Text
  		({
  				label: scoreInfo + (parseInt(Q.state.get('distance')) + parseInt(Q.state.get('stars'))) + "\n\n" + 'distance: ' + (parseInt(Q.state.get('distance')) + '\n stars: ' + parseInt(Q.state.get('stars'))),
  				color: color,
  				x: 0,
  				y: 0,
  				size: size,
  				align: 'center',
  				scale: Q.state.get('scale')
  		}), containerText);

  		if(Q.state.get('scale') === 1) {
        containerText.fit(20);
      }

  		// Try again
  		var container = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2, y: (Q.height/2 + 130 * Q.state.get('scale'))
  		}));

  		var button = container.insert
  		(
  			new Q.UI.Button
  			({
  				x: 0,
  				y: 0,
  				fill: "#CCCCCC",
  				label: "Try level again",
  				border: 2,
  				scale: Q.state.get('scale')
  		 })
  		);

  		button.on("click",function()
  		{
  			  Q.clearStages();
  			  Q.stageScene('level');
  			  Q.stageScene('hud', 3, Q('Rocket').first().p);
  		});

  		container.fit(20);

  		// Select level
  		var containerSelectLevel = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2, y: (Q.height/2 + 200 * Q.state.get('scale'))
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
  				scale: Q.state.get('scale')
  		 })
  		);

  		buttonSelectLevel.on("click",function()
  		{
  			  Q.clearStages();
  			  Q.stageScene('levelSelection');
  		});

  		containerSelectLevel.fit(20);
  	});

    this.set('Q', Q);

  },

  loadGame: function() {

    var self = this;

    if(!Ember.isEmpty(this.get('me'))) {

      this.get('me').get('user').then(user => {

        if(!Ember.isEmpty(user)) {

          user.get('rocket').then(rocket => {

              self.set('rocket', rocket);

              var Q = this.get('Q');

              Q.load
              (
          			[
          			  "level_selection.png",
          			  "rocket.png",
          			  "bullet.png",
          			  "star.png",
          			  "star_locked.png",
          			  "asteroid.png",
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
          				Q.sheet("bullet","bullet.png", { tileW: 20, tileH: 20 });
          				Q.sheet("star","star.png", { tileW: 60, tileH: 60 });
          				Q.sheet("star_locked","star.png", { tileW: 61, tileH: 64 });
          				Q.sheet("asteroid","asteroid.png", { tileW: 70, tileH: 70 });
          				Q.sheet("explodingAsteroid","explodingAsteroid.png", { tileW: 200, tileH: 200 });
          				Q.sheet("ufo","ufo.png", { tileW: 72, tileH: 40 });
          				Q.sheet("rocket", "rocket.png", { tileW: 50, tileH: 140 });
          				Q.sheet("distance","menuicons/distance.png", { tileW: 24, tileH: 24 });
          				Q.sheet("level","menuicons/level.png", { tileW: 24, tileH: 24 });
          				Q.sheet("points","menuicons/points.png", { tileW: 24, tileH: 24 });
          				Q.sheet("goal","menuicons/goal.png", { tileW: 24, tileH: 24 });
          				Q.sheet("speed","menuicons/speed.png", { tileW: 24, tileH: 24 });

          				Q.animations('rocket',
          				{
          					flying: { frames: [0], loop: false },
          					explosion: { frames: [1,2,3,4,5], rate: 1/15, loop: false, trigger: "exploded" }
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
          				progressCallback: function(loaded,total)
          				{
          					var element = document.getElementById("loading_progress");
          					    element.style.width = Math.floor(loaded/total*100) + "%";

          					if(loaded/total === 1)
          					{
          						self.set('isLoading', false);
          					}
          				}
          			}
            	);

          });

        }

      });

    }

  }.observes('me.user').on('init')

});
