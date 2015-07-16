/* global Quintus */
import Ember from 'ember';

export default Ember.Component.extend({

  me: null,

  didInsertElement: function() {
    // Set up a basic Quintus object
    // with the necessary modules and controls
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
    			// width: 420,
    			// height: 600,
    			scaleToFit: true,
          maximize: "touch"
    		}
    	)
    .controls()
    .touch()
    .enableSound();

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
  				Q.sheet("level_selection", "level_selection.png", { tileW: 420, tileH: 600 });
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
  						$("#loading").remove();
  					}
  				}
  			}
  	);
  }

});
