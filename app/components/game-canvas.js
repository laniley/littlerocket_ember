/* global Quintus */
/* global FB */
/* global LSM_Slot */
import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';
import RocketMixin from './../mixins/rocket';
import RocketDecorationMixin from './../mixins/rocket/decoration';
import CannonMixin from './../mixins/rocket/rocket-components/cannon';
import BulletMixin from './../mixins/rocket/rocket-components/cannon/bullet';
import ShieldMixin from './../mixins/rocket/rocket-components/shield';
import EngineMixin from './../mixins/rocket/rocket-components/engine';
import StarMixin from './../mixins/star';
import UfoMixin from './../mixins/ufo';

export default Ember.Component.extend(

  FacebookLoginMixin,
  RocketMixin,
  RocketDecorationMixin,
  CannonMixin,
  BulletMixin,
  ShieldMixin,
  EngineMixin,
  StarMixin,
  UfoMixin, {

  Q: null,
  me: null,
  gameState: null,
  hasPostPermission: false,
  isLoading: true,
  gameCanvasIsLoaded: false,
  currentScene: null,
  showHud: false,
  newHighscore: false,
  old_score: 0,
  components_ready: 0,

  init: function() {
    this._super();
    this.set('gameState', this.store.createRecord('game-state', { id: 1 }));

    var Q = window.Q = new Quintus({
      development: false,
      audioSupported: [ 'mp3' ],
      imagePath: "./assets/images/",
      audioPath: "./assets/audio/",
      dataPath: "./assets/data/"
    })
    .include("Sprites, Anim, Input, Scenes, 2D, Touch, UI, Audio");

    this.set('Q', Q);
  },

  didInsertElement: function() {
    var Q = this.get('Q');
    var self = this;
    Q.setup('game', {
      scaleToFit: true,
      maximize: "touch"
    })
    .controls()
    .touch()
    .enableSound();
    // Add in the controls
    Q.input.keyboardControls({
      	LEFT: "left",
      	RIGHT: "right",
      	UP: "up",
        DOWN: "down",
      	SPACE: "space",
        ENTER: "enter"
    });

    Q.input.touchControls({
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
    Q.SPRITE_STAR     = 2;
    Q.SPRITE_ASTEROID = 4;
    Q.SPRITE_BULLET	  = 16;

    Q.state.set('scale', 1);

    var rocket_y  = Q.height/6 * 5;

    if(Q.touchDevice) {
      Q.state.set('scale', 2.5);
    	rocket_y -= 100;
    }

    // COLORS
    Q.state.set('buttonFillColorUnselected', '#CCC');
    Q.state.set('buttonFillColorSelected', '#F5F36F');
    Q.state.set('buttonTextColorSelected', '#D62E00');

    this.initRocket();
    this.initDecoration();
    this.initCannon();
    this.initBullet();
    this.initShield();
    this.initEngine();
    this.initStar();
    this.initUfo();

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

    Q.Asteroid.extend("NormalAsteroid", {
    	init: function(p) {
    		this._super(p, {
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

    		for(var i = 0; i < 10; i++) {
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
    	init: function(p) {
    		this._super(p, {
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
          speedFactor: 0.8,
          hitPoints: 2,
    			isExploded: false
    		});

    		// collision points berechnen
    		var radius = this.p.tileW / 2;
    		var winkel = 0;

    		for(var i = 0; i < 10; i++) {
    			winkel += (Math.PI * 2) / 10;

    			var x = Math.floor(Math.sin(winkel) * radius);
    			var y = Math.floor(Math.cos(winkel) * radius);

    			this.p.points.push([x, y]);
    		}

    		this.on("sensor");
    		this.on('exploded', this, 'destroy');

    		this.add("2d, asteroidControls, animation");
    	},

    	explode: function() {
    		this.play('explosion');
    	}
    });

    Q.Asteroid.extend("ExplodingAsteroid", {
    	init: function(p) {
    		this._super(p, {
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

    		for(var i = 0; i < 10; i++) {
    			winkel += (Math.PI * 2) / 10;

    			var x = Math.floor(Math.sin(winkel) * radius);
    			var y = Math.floor(Math.cos(winkel) * radius);

    			this.p.points.push([x, y]);
    		}

    		this.on("sensor");
    		this.on('exploded', this, 'destroy');

    		this.add("2d, asteroidControls, animation");
    	},

    	explode: function() {
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
    			case "down":
              p.vy = self.get('gameState').get('speed') * p.speedFactor;
    					break;
    		}

    		if(this.entity.isA('ExplodingAsteroid')	&& p.y > (Q.height * 0.75) && p.isExploded === false) {
            p.isExploded = true;
    		  	Q.audio.play('explosion.mp3');
    		  	this.entity.explode();
    		}

        if(p.y > Q.height) {
    			  this.entity.destroy();
    		}
    	}
    });

    Q.GameObject.extend("AsteroidMaker", {
      init: function() {
    		this.p = {
    			launchDelay: (Q.state.get('scale') - (self.get('gameState').get('speed') / self.get('gameState').get('max_speed'))) * 0.3,
          launchRandomFactor: 0.6,
    			launch: 1,
          isActive: 1
    		};
    	},

     	update: function(dt) {
    	  	this.p.launch -= dt;

    	  	if(!Q.state.get('isPaused') && this.p.isActive && this.p.launch < 0) {
      			this.stage.insert(new Q.NormalAsteroid());
      			this.p.launch = this.p.launchDelay + this.p.launchRandomFactor * Math.random();
    		  }
     	}
    });

    Q.GameObject.extend("BigAsteroidMaker", {
    	init: function() {
    		this.p = {
    			launchDelay: 1.2 * Q.state.get('scale') - (self.get('gameState').get('speed') / self.get('gameState').get('max_speed')),
    			launchRandomFactor: 1,
    			launch: 1
    		};
    	},

    	update: function(dt) {
    		this.p.launch -= dt;

    		if(!Q.state.get('isPaused') && this.p.isActive && this.p.launch < 0) {
    			this.stage.insert(new Q.BigAsteroid());
    			this.p.launch = this.p.launchDelay + this.p.launchRandomFactor * Math.random();
    		}
    	}
    });

    Q.GameObject.extend("ExplodingAsteroidMaker", {
    	init: function() {
    		this.p = {
    			launchDelay: 2 * Q.state.get('scale') - (self.get('gameState').get('speed') / self.get('gameState').get('max_speed')),
    			launchRandom: 1,
    			launch: 2
    		};
    	},

    	update: function(dt) {
    		this.p.launch -= dt;

    		if(!Q.state.get('isPaused') && this.p.launch < 0) {
    			this.stage.insert(new Q.ExplodingAsteroid( {size : 50} ));
    			this.p.launch = this.p.launchDelay + this.p.launchRandom * Math.random();
    		}
    	}
    });

  	Q.scene("mainMenu",function(stage) {

      self.set('currentScene', 'mainMenu');
      self.set('showHud', true);

      self.get('gameState').set('flown_distance', 0);
      self.get('gameState').set('stars', 0);
      self.get('gameState').set('distance_to_goal', Math.floor(50 * ( 1 + ((self.get('gameState').get('level') - 1) / 10) )));

  		Q.pauseGame();
  		Q.audio.stop('rocket.mp3');
  		Q.audio.stop('racing.mp3');

      self.resetRocketComponents();

      var rocket = new Q.Rocket({ stage: stage });
  		stage.insert(rocket);

      if(!Ember.isEmpty(self.get('rocket').get('cannon'))) {
        var cannon = new Q.Cannon();
            cannon.setRocket(rocket);
            rocket.setCannon(cannon);
    		    stage.insert(cannon);
      }
      if(!Ember.isEmpty(self.get('rocket').get('shield'))) {
        var shield = new Q.Shield();
            shield.setRocket(rocket);
            rocket.setShield(shield);
            stage.insert(shield);
      }
      if(!Ember.isEmpty(self.get('rocket').get('engine'))) {
        var engine = new Q.Engine();
            engine.setRocket(rocket);
            rocket.setShield(engine);
            stage.insert(engine);
      }
      var decoration = new Q.Decoration();
          decoration.setRocket(rocket);
          rocket.setDecoration(decoration);
          rocket.p.stage.insert(decoration);

  		// start
  		var container = stage.insert(new Q.UI.Container({
  			  x: Q.width/2,
  			  y: Q.height/2 - 40 * Q.state.get('scale')
  		}));

  		var buttonStartLevel = container.insert(
  			new Q.UI.Button({
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

  		buttonStartLevel.on("click",function(){
        Q.clearStages();
  			Q.stageScene('level');
  		});

  		container.fit(20 * Q.state.get('scale'));

  		// select level
  		var containerSelectLevel = stage.insert(new Q.UI.Container({
  			  x: Q.width/2,
  			  y: (Q.height/2 + 40 * Q.state.get('scale'))
  		}));

  		var buttonSelectLevel = containerSelectLevel.insert(
  			new Q.UI.Button({
  				x: 0,
  				y: 0,
  				fill: "#CCCCCC",
  				label: "Select level",
  				border: 2,
          shadowColor: "rgba(0,0,0,0.5)",
  				scale: Q.state.get('scale')
  		 })
  		);

  		buttonSelectLevel.on("click",function(){
  			  Q.clearStages();
  			  Q.stageScene('levelSelection');
  		});

  		containerSelectLevel.fit(20);

      self.get('gameState').set('speed', 0);

      var currentSelectedButton = 'buttonStartLevel';

      // inputs
  		Q.input.on("enter", this, function(){
          if(currentSelectedButton === 'buttonStartLevel') {
            Q.clearStages();
            Q.stageScene('level');
          }
		  		else {
            Q.clearStages();
    			  Q.stageScene('levelSelection');
          }
  		});

      Q.input.on("up", this, function(){
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

      Q.input.on("down", this, function(){
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
      var level1Button = stage.insert(new Q.UI.Button({
    	      asset: 	'star.png',
    	      x: 		80,
    	      y: 		520,
    	      scale: 	0.7,
    	      label: 	'1'
        	}
      ));

      level1Button.on("click", function() {
          self.get('gameState').set('level', 1);
      		Q.clearStages();
      		Q.stageScene("mainMenu");
      });

      // Level 2
      var level2Button = stage.insert(new Q.UI.Button({
    	      asset: 	assetLevel2,
    	      x: 		190,
    	      y: 		500,
    	      scale: 	0.7,
    	      label: 	'2'
        	}
      ));

      level2Button.on("click", function() {
      		if(self.get('me').get('user').get('reached_level') > 1) {
            self.get('gameState').set('level', 2);
      			Q.clearStages();
      			Q.stageScene("mainMenu");
      		}
    	});

    	// Level 3
    	var level3Button = stage.insert(new Q.UI.Button({
    	      asset: 	assetLevel3,
    	      x: 		310,
    	      y: 		470,
    	      scale: 	0.7,
    	      label: 	'3'
        	}
      ));

      level3Button.on("click", function() {
    		if(self.get('me').get('user').get('reached_level') > 2) {
          self.get('gameState').set('level', 3);
    			Q.clearStages();
    			Q.stageScene("mainMenu");
    		}
      });

    	// Level 4
    	var level4Button = stage.insert(new Q.UI.Button({
  	      asset: 	assetLevel4,
  	      x: 		323,
  	      y: 		370,
  	      scale: 	0.7,
  	      label: 	'4'
      	}
      ));

      level4Button.on("click", function() {
        if(self.get('me').get('user').get('reached_level') > 3) {
          self.get('gameState').set('level', 4);
      		Q.clearStages();
      		Q.stageScene("mainMenu");
      	}
      });

    	// Level 5
    	var level5Button = stage.insert(new Q.UI.Button({
  	      asset: 	assetLevel5,
  	      x: 		210,
  	      y: 		335,
  	      scale: 	0.7,
  	      label: 	'5'
        }
      ));

      level5Button.on("click", function() {
        if(self.get('me').get('user').get('reached_level') > 4) {
          self.get('gameState').set('level', 5);
      		Q.clearStages();
      		Q.stageScene("mainMenu");
      	}
    	});

    	// Level 6
    	var level6Button = stage.insert(new Q.UI.Button({
    	      asset: 	assetLevel6,
    	      x: 		115,
    	      y: 		310,
    	      scale: 	0.7,
    	      label: 	'6'
        	}
       ));

      level6Button.on("click", function() {});

    	// Level 7
    	var level7Button = stage.insert(new Q.UI.Button({
    	      asset: 	assetLevel7,
    	      x: 		65,
    	      y: 		230,
    	      scale: 	0.7,
    	      label: 	'7'
        	}
       ));

      level7Button.on("click", function() {});

    	// Level 8
    	var level8Button = stage.insert(new Q.UI.Button({
    	      asset: 	assetLevel8,
    	      x: 		120,
    	      y: 		160,
    	      scale: 	0.7,
    	      label: 	'8'
        	}
       ));

      level8Button.on("click", function() {});

    	// Level 9
    	var level9Button = stage.insert(new Q.UI.Button({
    	      asset: 	assetLevel9,
    	      x: 		215,
    	      y: 		130,
    	      scale: 	0.7,
    	      label: 	'9'
        	}
       ));

      level9Button.on("click", function() {});
    });

  	Q.scene("level", stage => {

      self.set('currentScene', 'level');
      self.set('showHud', true);

      Ember.$("#footer_banner").empty();

      self.resetRocketComponents();

  		Q.unpauseGame();

      Q.audio.play('racing.mp3', { loop: true });
  		Q.audio.play('rocket.mp3', { loop: true });

      self.get('gameState').set('flown_distance', 0);
  		self.get('gameState').set('stars', 0);
      self.get('gameState').set('distance_to_goal', Math.floor(50 * ( 1 + ((self.get('gameState').get('level') - 1) / 10) )));

      self.get('gameState').set('speed', 250);
      self.get('gameState').set('max_speed', 500);

  		stage.insert(new Q.StarMaker());

      var asteroidMaker = new Q.AsteroidMaker();
      Q.state.set('asteroidMaker', asteroidMaker);
  		stage.insert(asteroidMaker);

      var rocket = new Q.Rocket({ stage: stage });
      stage.insert(rocket);

      if(!Ember.isEmpty(self.get('rocket').get('cannon'))) {
        var cannon = new Q.Cannon();
            cannon.setRocket(rocket);
            rocket.setCannon(cannon);
    		    stage.insert(cannon);
      }
      if(!Ember.isEmpty(self.get('rocket').get('shield'))) {
        var shield = new Q.Shield();
            shield.setRocket(rocket);
            rocket.setShield(shield);
            stage.insert(shield);
      }
      if(!Ember.isEmpty(self.get('rocket').get('engine'))) {
        var engine = new Q.Engine();
            engine.setRocket(rocket);
            rocket.setShield(engine);
            stage.insert(engine);
      }
      var decoration = new Q.Decoration();
          decoration.setRocket(rocket);
          rocket.setDecoration(decoration);
          rocket.p.stage.insert(decoration);

      self.setupLevel(this.get('gameState').get('level'));

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

      self.get('gameState').set('speed', 0);
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

        var new_stars_amount = user.get('stars') + (self.get('gameState').get('stars') * self.get('gameState').get('level'));
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

  observeRocketComponentStates: function() {
    if(this.get('Q') !== null) {
      if(!Ember.isEmpty(this.get('me'))) {
        this.get('me').get('user').then(user => {
          if(!Ember.isEmpty(user)) {
            this.set('components_ready', 0);
            user.get('rocket').then(rocket => {
              if(!Ember.isEmpty(rocket)) {
                this.set('rocket', rocket);
                var Q = this.get('Q');
                rocket.get('cannon').then(cannon => {
                  if(!Ember.isEmpty(cannon)) {
                    if(cannon.get('status') !== 'unlocked') {
                      cannon.set('currentValue', 0);
                      Q.state.set('bps', 0);
                      this.bumpUpReadyRocketComponents();
                    }
                    else {
                      cannon.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                        if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
                          cannon.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
                          this.bumpUpReadyRocketComponents();
                        }
                      });
                    }
                  }
                });

                rocket.get('shield').then(shield => {
                  if(!Ember.isEmpty(shield)) {
                    if(shield.get('status') !== 'unlocked') {
                      shield.set('currentValue', 0);
                      Q.state.set('srr', 0);
                      this.bumpUpReadyRocketComponents();
                    }
                    else {
                      shield.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                        if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
                          shield.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
                          this.bumpUpReadyRocketComponents();
                        }
                      });
                    }
                  }
                });

                rocket.get('engine').then(engine => {
                  if(!Ember.isEmpty(engine)) {
                    if(engine.get('status') !== 'unlocked') {
                      engine.set('currentValue', 0);
                      Q.state.set('sdrr', 0);
                      this.bumpUpReadyRocketComponents();
                    }
                    else {
                      engine.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
                        if(!Ember.isEmpty(selectedRocketComponentModelMm)) {
                          engine.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
                          this.bumpUpReadyRocketComponents();
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
    }
  }.observes(
    'me.user.rocket.cannon.status',
    'me.user.rocket.cannon.selectedRocketComponentModelMm',
    'me.user.rocket.shield.status',
    'me.user.rocket.shield.selectedRocketComponentModelMm',
    'me.user.rocket.engine.status',
    'me.user.rocket.engine.selectedRocketComponentModelMm'
  ).on('init'),

  bumpUpReadyRocketComponents() {
    this.set('components_ready', this.get('components_ready') + 1);
    if(this.get('components_ready') === 3) {
      // now all relevant data for the game to load is present, e.g. the reached level
      if(!this.get('gameCanvasIsLoaded')) {
        this.loadGameCanvas();
      }
    }
  },

  loadGameCanvas() {
    console.log('Loading Game Canvas...');
    this.set('gameCanvasIsLoaded', true);

    var Q = this.get('Q');
    var self = this;

    Q.load ([
        "level_selection_coming_soon.png",
        "rocket_2.png",
        "cannon.png",
        "shield.png",
        "engine.png",
        "bullet.png",
        "decoration_stars.png",
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
      function() {
        Q.sheet("rocket", "rocket_2.png", { tileW: 50, tileH: 140 });
        Q.sheet("cannon", "cannon.png", { tileW: 50, tileH: 140 });
        Q.sheet("shield", "shield.png", { tileW: 50, tileH: 140 });
        Q.sheet("engine", "engine.png", { tileW: 50, tileH: 140 });
        Q.sheet("decoration", "decoration_stars.png", { tileW: 50, tileH: 140 });
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
          explosion: { frames: [1,2,3,4,5], rate: 1/15, loop: false, trigger: "exploded" }
        });

        Q.animations('cannon', {
          reloading: { frames: [0], rate: 1/1, loop: false },
          reloaded: { frames: [1], rate: 1/1, loop: false }
        });

        Q.animations('shield', {
          reloading: { frames: [0], rate: 1/1, loop: false },
          reloaded: { frames: [1], rate: 1/1, loop: false }
        });

        Q.animations('engine', {
          reloading: { frames: [0], rate: 1/1, loop: false },
          reloaded: { frames: [1], rate: 1/1, loop: false }
        });

        Q.animations('explodingAsteroid', {
          // flying: { frames: [0], loop: false },
          explosion: { frames: [0,1,2], rate: 1/15, loop: false, trigger: "exploded" }
        });

        Q.stageScene("levelSelection");

        // Q.debug = true;
        // Q.debugFill = true;
      }, {
        progressCallback: function(loaded,total) {
          var element = document.getElementById("loading_progress");
              element.style.width = Math.floor(loaded/total*100) + "%";

          if(loaded/total === 1) {
            self.set('isLoading', false);
          }
        }
      }
    );

    new LSM_Slot({
        adkey: '6df',
        ad_size: '728x90',
        slot: 'slot126743',
        _render_div_id: 'footer_banner',
        _preload: true
    });
  },

  setupLevel: function(level) {

    var Q = this.get('Q');

    var asteroidMaker = Q.state.get('asteroidMaker');
    var bigAsteroidMaker = Q.state.get('bigAsteroidMaker');
    var explodingAsteroidMaker = Q.state.get('explodingAsteroidMaker');
    var ufoMaker = Q.state.get('ufoMaker');

    asteroidMaker.p.launchRandomFactor = 0.53;

    if(level >= 2) {

      if(!ufoMaker) {
        ufoMaker = new Q.UfoMaker();
        Q.state.set('ufoMaker', ufoMaker);
      }

      Q.stage().insert(ufoMaker);

      asteroidMaker.p.launchRandomFactor = 0.8;
      ufoMaker.p.isActive = 1;
      ufoMaker.p.launchRandomFactor = 1.5;
    }
    if(level >= 3)
    {
      if(!bigAsteroidMaker) {
        bigAsteroidMaker = new Q.BigAsteroidMaker();
        Q.state.set('bigAsteroidMaker', bigAsteroidMaker);
      }

      Q.stage().insert(bigAsteroidMaker);

      ufoMaker.p.isActive = 0;
      bigAsteroidMaker.p.isActive = 1;

      asteroidMaker.p.launchRandomFactor = 1.2;
      bigAsteroidMaker.p.launchRandomFactor = 1.2;
    }
    if(level >= 4)
    {
      ufoMaker.p.isActive = 1;
      bigAsteroidMaker.p.isActive = 1;

      asteroidMaker.p.launchRandomFactor = 1.3;
      bigAsteroidMaker.p.launchRandomFactor = 1.6;
      ufoMaker.p.launchRandomFactor = 2;
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

  new_score: function() {
    return (this.get('gameState').get('flown_distance') + this.get('gameState').get('stars')) * this.get('gameState').get('level');
  }.property('gameState.flown_distance', 'gameState.stars', 'gameState.level'),

  initRocketComponents: function() {
    this.get('me').get('user').then(user => {
      if(!Ember.isEmpty(user)) {
        user.get('rocket').then(rocket => {
          if(!Ember.isEmpty(rocket)) {
            rocket.get('cannon').then(cannon => {
              if(!Ember.isEmpty(cannon)) {
                this.set('cannon', cannon);
                this.resetCannon();
              }
            });

            rocket.get('shield').then(shield => {
              if(!Ember.isEmpty(shield)) {
                this.set('shield', shield);
                this.resetShield();
              }
            });

            rocket.get('engine').then(engine => {
              if(!Ember.isEmpty(engine)) {
                this.set('engine', engine);
                this.resetEngine();
              }
            });
          }
        });
      }
    });
  }.observes(
    'me.user',
    'me.user.rocket',
    'me.user.rocket.canon',
    'me.user.rocket.shield',
    'me.user.rocket.engine'
  ),

  resetRocketComponents: function() {
    this.resetCannon();
    this.resetShield();
    this.resetEngine();
  },

  resetCannon: function() {
    var cannon = this.get('cannon');
    if(cannon.get('status') === "unlocked") {
      cannon.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
        cannon.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
        cannon.set('isReloading', false);
      });
    }
    else {
      cannon.set('currentValue', 0);
      cannon.set('isReloading', false);
    }
  },

  resetShield: function() {
    var shield = this.get('shield');
    if(shield.get('status') === 'unlocked') {
      shield.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
        shield.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
        shield.set('isReloading', false);
      });
    }
    else {
      shield.set('currentValue', 0);
      shield.set('isReloading', false);
    }
  },

  resetEngine: function() {
    var engine = this.get('engine');
    if(engine.get('status') === 'unlocked') {
      engine.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
        engine.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
        engine.set('isReloading', false);
      });
    }
    else {
      engine.set('currentValue', 0);
      engine.set('isReloading', false);
    }
  },

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
