import Ember from 'ember';

const GameAudio = Ember.Object.extend({
	// List of mime types given an audio file extension, used to
    // determine what sound types the browser can play using the
    // built-in `Sound.canPlayType`
    mimeTypes: {
		mp3: 'audio/mpeg', ogg: 'audio/ogg; codecs="vorbis"',
  		m4a: 'audio/m4a',  wav: 'audio/wav'
	},
	supportedTypes: [ 'mp3' ],
	preferredExtension: 'mp3',
	type: 'WebAudio',
	audioContext: null,
	channels: [],
	channelMax:  10,
	active: {},
	playingSounds: {},

	init() {
		this._super();
		var AudioContext = window.AudioContext || window.webkitAudioContext;
	  	if(typeof AudioContext !== "undefined") {
			this.set('audioContext', new AudioContext());
	  	}
	},

	play() {},

	stop(sound) {
		for(var key in this.get('playingSounds')) {
          	var snd = this.get('playingSounds')[key];
          	if(!sound || sound === snd.assetName) {
            	if(snd.stop) {
					snd.stop(0);
				}
				else {
					snd.noteOff(0);
				}
          	}
        }
	}
});

export default GameAudio;
