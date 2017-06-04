/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({

	session: Ember.inject.service('session'),
	audio: Ember.inject.service('game-audio-service'),

	classNames: ['top-nav-bar'],

  	actions: {
	    login() {
			this.get('session').authenticate('authenticator:facebook').catch((reason) => {
				this.set('errorMessage', reason.error || reason);
			});
	    },
	    logout() {
			this.get('session').invalidate();
	    },
	    invite() {
			FB.ui({
				method: 'apprequests',
				message: 'Come and play Little Rocket with me!',
				filters: ['app_non_users']
			}, function(response){
				console.log(response);
				//request
				//to[index]
			});
		},
  		toggleAudio() {
			this.toggleProperty('audio.enabled');
		}
	}
});
