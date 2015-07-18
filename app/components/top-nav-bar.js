/* global FB */
import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Component.extend(FacebookLoginMixin, {

  me: null,
  scope: 'public_profile,publish_actions,user_friends',

  didInsertElement: function() {
    Ember.$(document).foundation();
  },

  statusChangeCallback: function(response)
  {
  	console.log('fb login status', response);
  	 // The response object is returned with a status field that lets the
  	 // app know the current login status of the person.
  	 // Full docs on the response object can be found in the documentation
  	 // for FB.getLoginStatus().
  	if (response.status === 'connected')
  	{
  			// Logged into your app and Facebook.
        if(Ember.isEmpty(this.me)) {
          this.store.createRecord('me', { id: 1, isLoggedIn: true });
        }
        else {
          this.me.set('isLoggedIn', true);
        }

  			this.getUserDataFromFB(this.store);
  	}
  	else if (response.status === 'not_authorized')
  	{
  			// The person is logged into Facebook, but not your app.
        if(Ember.isEmpty(this.me)) {
          this.store.createRecord('me', { id: 1, isLoggedIn: false });
        }
        else {
          this.me.set('isLoggedIn', false);
        }
  	}
  	else
  	{
  			// The person is not logged into Facebook, so we're not sure if
  			// they are logged into this app or not.
        if(Ember.isEmpty(this.me)) {
          this.store.createRecord('me', { id: 1, isLoggedIn: false });
        }
        else {
          this.me.set('isLoggedIn', false);
        }
  	}
  },

  // Here we run a very simple test of the Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  getUserDataFromFB: function()
  {
  	console.log('Welcome!  Fetching your information.... ');

    var self = this;
    var store = this.get('targetObject.store');

  	FB.api('/me', {fields: 'id,first_name,last_name,picture.width(120).height(120)'}, function(response)
  	{
  		if( !response.error )
  		{
        console.log('Successful login for: ' + response.first_name + " " + response.last_name);

        var user = store.find('user', { fb_id: response.id }).then(users => {

            if(Ember.isEmpty(users)) {
              user = store.createRecord('user');
            }
            else {
              user = users.get('firstObject');
            }

            user.set('fb_id', response.id);
            user.set('first_name', response.first_name);
            user.set('last_name', response.last_name);
            user.set('img_url', response.picture.data.url);

            var rocket = user.get('rocket').then(rocket => {

              if(Ember.isEmpty(rocket)) {
                rocket = store.createRecord('rocket');
                rocket.set('user', user);
                rocket.save().then(rocket => {
                  user.set('rocket', rocket);
                  user.save().then(user => {
                    self.get('me').set('user', user);
                  });
                });
              }
              else {
                user.save().then(user => {
                  self.get('me').set('user', user);
                });
              }

            });
        });

  			// getScores(function()
  			// {
  			// 	renderScores();
  			// });

  			// getLeaderboardRankFromDB();
  			// getLevel();
  			// getStars();
  			// getWorkbenchStatus();
  			// getLabStatus();
  			// getCanonStatus();
  		}
  		else
  		{
  			console.log(response.error);
  		}
  	});
  },

  actions: {
    login: function() {
      var self = this;
      FB.login(function() {
        self.checkLoginState();
      }, { scope: self.get('scope') });
    }
  }
});
