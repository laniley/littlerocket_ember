import Ember from 'ember';

export default Ember.Service.extend({
	// default audio settings
	settings: {
		supportedTypes: [ 'mp3' ],
		type: 'WebAudio',
      	channels: [],
      	channelMax:  10,
      	active: {},
      	play: function() {}
  	},
	// List of mime types given an audio file extension, used to
    // determine what sound types the browser can play using the
    // built-in `Sound.canPlayType`
    mimeTypes: {
		mp3: 'audio/mpeg', ogg: 'audio/ogg; codecs="vorbis"',
  		m4a: 'audio/m4a',  wav: 'audio/wav'
	},

	audioContext: null,

	init() {
		var AudioContext = window.AudioContext || window.webkitAudioContext;
	  	if(typeof AudioContext !== "undefined") {
			this.set('audioContext', new AudioContext());
	  	}
	},


});
