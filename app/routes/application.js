/* global FB */
import Ember from 'ember';
import ENV from '../config/environment';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Route.extend(FacebookLoginMixin, {

  beforeModel: function() {

    var self = this;

    var fbAsyncInit = function() {

      FB.init({
          appId      : ENV.fb_app_id,
          xfbml      : true,
         version    : 'v2.3'
      });

      self.checkLoginState();
    };

    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.src = "//connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
      }(document, 'script', 'facebook-jssdk'));

     window.fbAsyncInit = fbAsyncInit;
  },

  model: function() {
    var me = this.store.getById('me', 1);

    if(Ember.isEmpty(me)) {
      return this.store.createRecord('me', { id: 1, isLoggedIn: false });
    }
    else {
      return me;
    }
  },

  statusChangeCallback: function(response) {
    console.log('fb login status', response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    var store = this.store;
    var me = store.getById('me', 1);

    if (response.status === 'connected')
    {
      // Logged into your app and Facebook.
      if(Ember.isEmpty(me)) {
        me = store.createRecord('me', { id: 1, isLoggedIn: true });
      }
      else {
        me.set('isLoggedIn', true);
      }

      // console.log('Welcome!  Fetching your information.... ');

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
                      me.set('user', user);
                    });
                  });
                }
                else {
                  user.save().then(user => {
                    me.set('user', user);
                  });
                }

              });

          });
        }
        else
        {
        	console.log(response.error);
        }
      });
    }
    else if (response.status === 'not_authorized')
    {
    	// The person is logged into Facebook, but not your app.
      if(Ember.isEmpty(me)) {
        store.createRecord('me', { id: 1, isLoggedIn: false });
      }
      else {
        me.set('isLoggedIn', false);
      }
    }
    else
    {
    	// The person is not logged into Facebook, so we're not sure if
    	// they are logged into this app or not.
      if(Ember.isEmpty(me)) {
        store.createRecord('me', { id: 1, isLoggedIn: false });
      }
      else {
        me.set('isLoggedIn', false);
      }
    }
  }

});
