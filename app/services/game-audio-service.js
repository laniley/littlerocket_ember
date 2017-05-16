import Ember from 'ember';

export default Ember.Service.extend({

	gameState: Ember.inject.service('game-state-service'),

	enabled: Ember.computed('gameState.soundEnabled', function() {
		return this.get('gameState.soundEnabled');
	}),
	playing: false,

	type: '',
	audioContext: null,

	/*
	 * List of mime types given an audio file extension, used to
     * determine what sound types the browser can play using the
     * built-in `Sound.canPlayType`
	 */
    mimeTypes: {
		mp3: 'audio/mpeg', ogg: 'audio/ogg; codecs="vorbis"',
  		m4a: 'audio/m4a',  wav: 'audio/wav'
	},
	supportedMimeTypes: [ 'mp3' ],
	preferredExtension: 'mp3',

	channels: [],
	channelMax:  10,

	playingSounds: Ember.A([]),

	init() {

		this._super();

		var AudioContext = window.AudioContext;

	  	if(typeof AudioContext !== "undefined") {
			this.set('audioContext', new AudioContext());
			this.set('type', 'WebAudio');
	  	}
		else {

			AudioContext = window.webkitAudioContext;

			if(typeof AudioContext !== "undefined") {
				this.set('audioContext', new AudioContext());
				this.set('type', 'HTML5');
		  	}
			else {
				console.error('Audio Context could not be initialized!');
			}
		}

		console.log(this.get('audioContext'));
	},

	// Play a single sound, optionally debounced
	// to prevent repeated plays in a short time
	play(sound, options) {

		var now = new Date().getTime();

		// See if this audio file is currently being debounced, if
		// it is, don't do anything and just return
		// if(Q.audio.active[sound] && Q.audio.active[sound] > now) {
		// 	return;
		// }

		// If any options were passed in, check for a debounce,
		// which is the number of milliseconds to debounce this sound
		// if(options && options['debounce']) {
		//   Q.audio.active[sound] = now + options['debounce'];
		// } else {
		//   delete Q.audio.active[sound];
		// }

		// WebAudio
		if(this.get('type') === 'WebAudio') {

			this.set('soundID', this.get('soundID') + 1);

		    var source = this.get('audioContext').createBufferSource();
		    	source.buffer = this.get('gameState.game.assets')[sound];
		    	source.connect(this.get('audioContext').destination);
				source.assetName = sound;

		    if(options && options['loop']) {
		      	source.loop = true;
		    } else {
		      	setTimeout(() => {
		        	this.get('playingSounds').removeObject(source);
		      	}, source.buffer.duration * 1000);
		    }

		    if(source.start) {
				source.start(0);
			}
			else {
				source.noteOn(0);
			}

		    this.get('playingSounds').pushObject(source);
		}
		else {
			// for (var i=0;i<Q.audio.channelMax;i++) {
			// 	Q.audio.channels[i] = {};
			// 	Q.audio.channels[i]['channel'] = new Audio();
			// 	Q.audio.channels[i]['finished'] = -1;
			// }

		    // Find a free audio channel and play the sound
		    // for (var i=0;i<Q.audio.channels.length;i++) {
		      // Check the channel is either finished or not looping
		    //   if (!Q.audio.channels[i]['loop'] && Q.audio.channels[i]['finished'] < now) {

		        // Q.audio.channels[i]['channel'].src = Q.asset(s).src;

		        // If we're looping - just set loop to true to prevent this channcel
		        // from being used.
		        // if(options && options['loop']) {
		        //   Q.audio.channels[i]['loop'] = true;
		        //   Q.audio.channels[i]['channel'].loop = true;
		        // } else {
		        //   Q.audio.channels[i]['finished'] = now + Q.asset(s).duration*1000;
		        // }
		        // Q.audio.channels[i]['channel'].load();
		        // Q.audio.channels[i]['channel'].play();
		        // break;
		    //   }
		    // }
		}
	},

	// Stop a single sound asset or stop all sounds currently playing
	stop(sound) {
		// WebAudio
		if(this.get('type') === 'WebAudio') {

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
		// HTML5
		else {


			// Q.audio.stop = function(s) {
			//   var src = s ? Q.asset(s).src : null;
			//   var tm = new Date().getTime();
			//   for (var i=0;i<Q.audio.channels.length;i++) {
			//     if ((!src || Q.audio.channels[i]['channel'].src === src) &&
			//         (Q.audio.channels[i]['loop'] || Q.audio.channels[i]['finished'] >= tm)) {
			//       Q.audio.channels[i]['channel'].pause();
			//       Q.audio.channels[i]['loop'] = false;
			//     }
			//   }
		}

	},

});
