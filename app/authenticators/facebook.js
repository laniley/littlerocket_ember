/* global FB */
import Ember from 'ember';
import Base from 'ember-simple-auth/authenticators/base';

export default Base.extend({

  scope: 'public_profile,email,user_friends,publish_actions',

  restore() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.checkLoginState(resolve, reject);
    });
  },
  authenticate() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      this.login(resolve, reject);
    });
  },
  invalidate(/*data*/) {
    console.log('logging out from facebook...');
    FB.api('/me/permissions', 'delete', {}, response => {
      if(!response.success) {
        console.err('ERROR: logout failed!');
      }
      else {
      }
    });
    return Ember.RSVP.resolve();
  },

  login(success, failure) {
    FB.login(() => {
        this.checkLoginState(success, failure);
      }, {
        scope: this.get('scope')
       }
    );
  },

  checkLoginState(success, failure) {
    FB.getLoginStatus(response => {
      console.log('fb login status', response);
      if (response.status === 'connected') {
        Ember.run(function() {
            success({
                token: response.authResponse.accessToken
            });
        });
    	}
      else {
        Ember.run(function() {
            failure(response);
        });
      }
    });
  },
});
