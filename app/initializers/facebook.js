/* global FB */
import ENV from '../config/environment';

export function initialize(container, application) {

  var fbAsyncInit = function() {
    FB.init({
        appId      : ENV.fb_app_id,
        xfbml      : true,
       version    : 'v2.3'
    });

    FB.getLoginStatus(response => {
      console.log('fb login status', response);
      // The response object is returned with a status field that lets the
      // app know the current login status of the person.
      // Full docs on the response object can be found in the documentation
      // for FB.getLoginStatus().
      var store = container.lookup('store:main');
      var me = store.getById('me', 1);

      if (response.status === 'connected')
      {
        // Logged into your app and Facebook.
        if(Ember.isEmpty(me)) {
          store.createRecord('me', { id: 1, isLoggedIn: true });
        }
        else {
          me.set('isLoggedIn', true);
        }

        console.log('Welcome!  Fetching your information.... ');

        FB.api('/me', {fields: 'id,name,first_name,picture.width(120).height(120)'}, function(response)
        {
          if( !response.error )
          {
          	console.log('Successful login for: ' + response.name);
          }
          else
          {
          	conole.log(response.error);
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
    });
  };

  (function(d, s, id){
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) {return;}
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/en_US/sdk.js";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

   window.fbAsyncInit = fbAsyncInit;
};

export default {
  name: 'facebook',
  initialize: initialize
};
