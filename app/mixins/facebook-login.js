/* global FB */
import Ember from 'ember';

export default Ember.Mixin.create({

  me: null,

  checkLoginState: function() {
    FB.getLoginStatus(response => {
        this.statusChangeCallback(response);
    });
  },

  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  statusChangeCallback: function(response) {

    console.log('fb login status', response);

    var store = this.store;
    this.set('me', store.peekRecord('me', 1));

    if (response.status === 'connected')
  	{
  			// Logged into your app and Facebook.
        if(Ember.isEmpty(this.get('me'))) {
          this.store.createRecord('me', { id: 1, isLoggedIn: true });
        }
        else {
          this.get('me').set('isLoggedIn', true);
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
          this.get('me').set('isLoggedIn', false);
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
          this.get('me').set('isLoggedIn', false);
        }
  	}

  },

  // Here we receive the user data from the FB Graph API after login is
  // successful.  See statusChangeCallback() for when this call is made.
  getUserDataFromFB: function() {

    console.log('Welcome!  Fetching your information.... ');

    var self = this;
    var store = this.store;

  	FB.api('/me', {fields: 'id,first_name,last_name,picture.width(120).height(120)'}, function(response)
  	{
  		if( !response.error )
  		{
        console.log('Successful login for: ' + response.first_name + " " + response.last_name);

        var user = store.query('user', { fb_id: response.id }).then(users => {

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

            user.save().then(user => {
              self.loadRocket(user);
              self.loadLab(user);
            });
        });
  		}
  		else
  		{
  			console.log(response.error);
  		}
  	});
  },

  loadRocket: function(user) {
    user.get('rocket').then(rocket => {
      if(Ember.isEmpty(rocket)) {
        rocket = this.store.query('rocket', { user: user.get('id') }).then(rockets => {
          if(Ember.isEmpty(rockets)) {
            rocket = this.store.createRecord('rocket');
            rocket.set('user', user);
            rocket.save().then(rocket => {
              user.set('rocket', rocket);
              user.save().then(user => {
                this.loadRocketCallback(user, rocket);
              });
            });
          }
          else {
             rocket = rockets.get('firstObject');
             this.loadRocketCallback(user, rocket);
          }
        });
      }
      else {
        this.loadRocketCallback(user, rocket);
      }
    });
  },

  loadRocketCallback: function(user, rocket) {

    var me = this.store.peekRecord('me', 1);
    me.set('user', user);

    rocket.get('canon').then(canon => {
     if(Ember.isEmpty(canon)) {
       this.store.query('canon', { rocket: rocket.get('id') }).then(canons => {
         if(Ember.isEmpty(canons)) {
           canon = this.store.createRecord('canon');
           canon.set('rocket', rocket);
           canon.save().then(canon => {
               rocket.set('canon', canon);
               rocket.save();
           });
         }
         else {
           canon = canons.get('firstObject');
         }
       });
     }
    });
  },

  loadLab: function(user) {
    if(user.get('lab')) {
      user.get('lab').then(lab => {
        if(Ember.isEmpty(lab)) {
          this.store.query('lab', { user: user.get('id') }).then(labs => {
            if(Ember.isEmpty(labs)) {
              var lab = this.store.createRecord('lab');
              lab.set('user', user);
              lab.save().then(lab => {
                user.set('lab', lab);
                user.save();
              });
            }
          });
        }
      });
    }
    else {
      this.store.query('lab', { user: user.get('id') }).then(labs => {
        if(Ember.isEmpty(labs)) {
          var lab = this.store.createRecord('lab');
          lab.set('user', user);
          lab.save().then(lab => {
            user.set('lab', lab);
            user.save();
          });
        }
      });
    }
  }

});
