/* global Quintus */

export function initialize(/* container, application */) {
  // Set up a basic Quintus object
  // with the necessary modules and controls
  var Q = window.Q = new Quintus({ development: false, audioSupported: [ 'mp3' ] })
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
}

export default {
  name: 'quintus',
  initialize: initialize
};
