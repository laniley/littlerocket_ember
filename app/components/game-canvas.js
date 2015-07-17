import Ember from 'ember';

export default Ember.Component.extend({

  me: null,
  store: null,
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

    var level         = 1;
    var distance      = 0;
    var stars         = 0;
    var bullets 		  = 0;

    var asteroidMaker = null;
    var ufoMaker      = null;

    var distanceToGoalRef = 50;
    var globalSpeedRef    = 50;
    var maxSpeedRef       = 100;

    var distanceToGoal  = 50;
    var globalSpeed     = 50;
    var maxSpeed        = 100;

    var scale     = 1;
    var rocket_y  = Q.height/6 * 5;

    if(Q.touchDevice)
    {
    	scale = 2.5;
    	rocket_y -= 100;
    }

    Q.Sprite.extend("DistanceIcon",
  	{
  		 init: function(p)
  		 {
  			  this._super(p,
  			  {
  					name:   	'DistanceIcon',
  					sheet:  	'distance',
  					type:   	Q.MENU_ICON,
  					tileW:  	scale * 24,
  					tileH:  	scale * 24,
  					x:      	scale * 20,
  					y:      	scale * 45,
  					scale: 	scale
  			  });

  			  this.p.x += this.p.tileW / 2;
  			  this.p.y += this.p.tileH / 2;
  		 }
  	});

  	Q.Sprite.extend("LevelIcon",
  	{
  		 init: function(p)
  		 {
  			  this._super(p,
  			  {
  					name:   	'LevelIcon',
  					sheet:  	'level',
  					type:   	Q.MENU_ICON,
  					tileW:  	scale * 24,
  					tileH:  	scale * 24,
  					x:      	scale * 20,
  					y:      	scale * 70,
  					scale: 	scale
  			  });

  			  this.p.x += this.p.tileW / 2;
  			  this.p.y += this.p.tileH / 2;
  		 }
  	});

  	Q.Sprite.extend("StarIcon",
  	{
  		 init: function(p)
  		 {
  			  this._super(p,
  			  {
  					name:   	'StarIcon',
  					sheet:  	'points',
  					type:   	Q.MENU_ICON,
  					tileW:  	scale * 24,
  					tileH:  	scale * 24,
  					x:      	scale * 20,
  					y:      	scale * 95,
  					scale: 	scale
  			  });

  			  this.p.x += this.p.tileW / 2;
  			  this.p.y += this.p.tileH / 2;
  		 }
  	});

    Q.Sprite.extend("SpeedIcon",
  	{
  		 init: function(p)
  		 {
  			  this._super(p,
  			  {
  					name:   	'SpeedIcon',
  					sheet:  	'speed',
  					type:   	Q.MENU_ICON,
  					tileW:  	scale * 24,
  					tileH:  	scale * 24,
  					x:      	scale * 20,
  					y:      	scale * 120,
  					scale: 	scale
  			  });

  			  this.p.x += this.p.tileW / 2;
  			  this.p.y += this.p.tileH / 2;
  		 }
  	});

  	Q.Sprite.extend("GoalIcon",
  	{
  		 init: function(p)
  		 {
  			  this._super(p,
  			  {
  					name:   	'GoalIcon',
  					sheet:  	'goal',
  					type:   	Q.MENU_ICON,
  					tileW:  	scale * 24,
  					tileH:  	scale * 24,
  					x:      	scale * 20,
  					y:      	scale * 145,
  					scale: 	scale
  			  });

  			  this.p.x += this.p.tileW / 2;
  			  this.p.y += this.p.tileH / 2;
  		 }
  	});

  	Q.UI.Text.extend("ScoreText",
  	{
  		init: function(container)
  		{
  			this._super
  			({
  				 x: 0,
  				 y: 0,
  				 label: (parseInt(distance) + parseInt(stars)) + "\n",
  				 color: "black",
  				 size: scale * 20,
  				 outlineWidth: container.width
  			});

  			Q.state.on("change.distance",this,"updateText");
  			Q.state.on("change.stars",this,"updateText");
  		},

  		updateText: function(newVal)
  		{
  			  this.p.label = (parseInt(distance) + parseInt(stars)) + "\n";
  		}
  	});

  	Q.UI.Text.extend("DistanceText",
  	{
  		 init: function(container)
  		 {
  			this._super
  			({
  				 x: scale * 0,
  				 y: scale * 0,
  				 label: parseInt(distance) + "\n",
  				 color: "black",
  				 size: scale * 20,
  				 outlineWidth: container.width
  			});

  			Q.state.on("change.distance",this,"updateText");
      },

  		 updateText: function(newVal)
  		 {
  			  this.p.label = parseInt(distance) + "\n";
  		 }
  	});

    Q.UI.Text.extend("LevelText",
  	{
  		 init: function(container)
  		 {
  			this._super
  			({
  				 x: scale * 0,
  				 y: scale * 24,
  				 label: level+"\n",
  				 color: "black",
  				 size: scale * 20,
  				 outlineWidth: container.width
  			});

  			Q.state.on("change.level",this,"updateText");
      },

  		 updateText: function(newVal)
  		 {
  			  this.p.label = newVal + "\n";
  		 }
  	});

  	Q.UI.Text.extend("StarsText",
  	{
  		 init: function(container)
  		 {
  			this._super
  			({
  				 x: scale * 0,
  				 y: scale * 48,
  				 label: "0\n",
  				 color: "black",
  				 size: scale * 20,
  				 outlineWidth: container.width
  			});

  			Q.state.on("change.stars",this,"updateStars");
      },

  		 updateStars: function(newVal)
  		 {
  			  this.p.label = newVal + "\n";
  		 }
  	});

    Q.UI.Text.extend("SpeedText",
  	{
  		 init: function(container)
  		 {
  			this._super
  			({
  				 x: scale * 0,
  				 y: scale * 72,
  				 label: parseInt((globalSpeed / maxSpeed) * 100) + " %\n",
  				 color: "black",
  				 size: scale * 20,
  				 outlineWidth: container.width
  			});

  			Q.state.on("change.globalSpeed",this,"updateSpeed");
      },

  		 updateSpeed: function(newVal)
  		 {
  			  this.p.label = parseInt((newVal / maxSpeed) * 100) + " %\n";
  		 }
  	});

  	Q.UI.Text.extend("DistanceToGoalText",
  	{
  		 init: function(container)
  		 {
  			this._super
  			({
  				 x: scale * 0,
  				 y: scale * 96,
  				 label: parseInt(distanceToGoal) + "\n",
  				 color: "black",
  				 size: scale * 20,
  				 outlineWidth: container.width
  			});

  			Q.state.on("change.distanceToGoal",this,"updateText");
      },

  		 updateText: function(newVal)
  		 {
  			  this.p.label = parseInt(distanceToGoal) + "\n";
  		 }
  	});

  	Q.UI.Text.extend("BulletsText",
  	{
  		init: function(container)
  		{
  			this._super
  			({
  				 x: scale * 0,
  				 y: scale * 0,
  				 label: "Ammo: " + parseInt(bullets) + "\n",
  				 color: "black",
  				 size: scale * 20,
  				 outlineWidth: container.width
  			});

  			Q.state.on("change.bullets",this,"updateText");
  		},

  		updateText: function(newVal)
  		{
  			this.p.label = "Ammo: " + parseInt(bullets) + "\n";
  		}
  	});

  	Q.scene('hud',function(stage)
  	{
  		// Icons
  		stage.insert(new Q.DistanceIcon());
  		stage.insert(new Q.LevelIcon());
  		stage.insert(new Q.StarIcon());
  		stage.insert(new Q.SpeedIcon());
  		stage.insert(new Q.GoalIcon());

  		var scoreContainer = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: scale * 20,
  					y: scale * 20
  			  }
  			)
  		);

  		scoreContainer.insert(new Q.ScoreText(scoreContainer));

  		scoreContainer.fit(scale * 10);

  		// Values
  		var container = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: scale * 60,
  					y: scale * 50
  			  }
  			)
  		);

  		container.insert(new Q.DistanceText(container));
  		container.insert(new Q.LevelText(container));
  		container.insert(new Q.StarsText(container));
  		container.insert(new Q.SpeedText(container));
  		container.insert(new Q.DistanceToGoalText(container));

  		container.fit(scale * 10);



  		var containerAmmo = stage.insert
  		(
  			new Q.UI.Container
  			(
  			  {
  					x: scale * 300,
  					y: scale * 20
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
  			  y: Q.height/2 - 40 * scale
  		}));

  		var button = container.insert
  		(
  			new Q.UI.Button
  			({
  				x: 0,
  				y: 0,
  				scale: scale,
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

  		container.fit(20 * scale);

  		// select level
  		var containerSelectLevel = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2,
  			  y: (Q.height/2 + 40 * scale)
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
  				scale: scale
  		 })
  		);

  		buttonSelectLevel.on("click",function()
  		{
  			  Q.clearStages();
  			  Q.stageScene('levelSelection');
  		});

  		containerSelectLevel.fit(20);

  		globalSpeed = 0;

  		Q.stageScene('hud', 3, Q('Rocket').first().p);
  	});

    Q.Sprite.extend("Level_Selection",
    {
    	init: function(p)
    	{
        this._super(p,
    		{
    			name:  "Level_Selection",
    			asset: "level_selection.png",
    			x: 		 210,
    			y: 		 300,
    			scale: scale
    	   });
    	}
    });

    Q.scene("levelSelection", function(stage)
    {
    	self.set('isPaused', true);
    	Q.pauseGame();

    	Q.audio.stop('rocket.mp3');
    	Q.audio.stop('racing.mp3');

    	stage.insert(new Q.Level_Selection({ scale: scale }));

    	// assets
    	var assetLevel2 = 'star_locked.png';

    	// if(me.get('user').get('max_level') > 1)
    		assetLevel2 = 'star.png';

    	var assetLevel3 = 'star_locked.png';

    	// if(me.get('user').get('max_level') > 2)
    		assetLevel3 = 'star.png';

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
    		level = 1;
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
    			level = 2;
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
    			level = 3;
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

  	Q.scene("level",function(stage)
  	{
  		self.set('isPaused', false);
  		Q.unpauseGame();
  		Q.audio.play('rocket.mp3', { loop: true });
  		Q.audio.play('racing.mp3', { loop: true });

  		distance          = 0;
  		stars             = 0;
  		bullets 				= 0;

  		if(cockpit.hasCanon()) {
        bullets = cockpit.canon.capacity;
      }

  		distanceToGoalRef = 50;
  		globalSpeedRef    = 250;
  		maxSpeedRef       = 500;

  		distanceToGoal    = 50;
  		globalSpeed       = 250;
  		maxSpeed          = 500;

  		if(Q.touchDevice)
  		{
  			globalSpeedRef = globalSpeedRef * scale;
  			globalSpeed = globalSpeed * scale;

  			maxSpeed = maxSpeed * scale;
  			maxSpeedRef = maxSpeedRef * scale;
  		}

  		stage.insert(new Q.StarMaker());

  		asteroidMaker = new Q.AsteroidMaker();
  		stage.insert(asteroidMaker);

  		stage.insert(new Q.Rocket({x: Q.width/2, y: rocket_y }));

  		if(level > 1)
  		{
  			asteroidMaker.p.launchDelay = 0.6 * scale - (globalSpeed / maxSpeed);
  			Q.stage().insert(new Q.UfoMaker());
  		}

  		if(level > 2)
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

  		if(distance + stars > user_score)
  		{
  			scoreInfo = "You beat your own highscore!\n\n";

  			saveScore(distance + stars);
  		}

  		sendStars(parseInt(stars) + parseInt(stars_count), function()
  		{
  			getStars();
  		});

  		var containerText = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2, y: Q.height/3 + 70, fill: "rgba(0,0,0,0.5)"
  		}));

  		if(scale > 1)
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
  				label: scoreInfo + (parseInt(distance) + parseInt(stars)) + "\n\n" + 'distance: ' + (parseInt(distance) + '\n stars: ' + parseInt(stars)),
  				color: color,
  				x: 0,
  				y: 0,
  				size: size,
  				align: 'center',
  				scale: scale
  		}), containerText);

  		if(scale === 1) {
        containerText.fit(20);
      }

  		// Try again
  		var container = stage.insert(new Q.UI.Container
  		({
  			  x: Q.width/2, y: (Q.height/2 + 130 * scale)
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
  				scale: scale
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
  			  x: Q.width/2, y: (Q.height/2 + 200 * scale)
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
  				scale: scale
  		 })
  		);

  		buttonSelectLevel.on("click",function()
  		{
  			  Q.clearStages();
  			  Q.stageScene('levelSelection');
  		});

  		containerSelectLevel.fit(20);
  	});

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
  }

});
