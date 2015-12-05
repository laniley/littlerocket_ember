/* global FB */
import Ember from 'ember';

export default Ember.Mixin.create({

  me: null,
  scope: 'public_profile,email,user_friends,publish_actions',

  login: function() {
    FB.login(() => { this.checkLoginState(); }, { scope: this.get('scope') });
  },

  checkLoginState: function() {
    FB.getLoginStatus(response => {
        this.statusChangeCallback(response);
    });
  },

  getAllComponentModels: function(component) {
    return this.store.query('rocket-component-model', { 'type': component.get('type') }).then(models => {
      return models;
    });
  },

  getMyComponentModelMms: function(component) {
    return component.get('rocketComponentModelMms').then(rocketComponentModelMms => {
      return rocketComponentModelMms;
    });
  },

  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  statusChangeCallback: function(response) {

    console.log('fb login status', response);

    this.set('me', this.get('store').peekRecord('me', 1));

    if (response.status === 'connected')
  	{
  			// Logged into your app and Facebook.
        if(Ember.isEmpty(this.get('me'))) {
          this.get('store').createRecord('me', { id: 1, isLoggedIn: true });
        }
        else {
          this.get('me').set('isLoggedIn', true);
        }

  			this.getUserDataFromFB(this.get('store'));
  	}
  	else if (response.status === 'not_authorized')
  	{
  			// The person is logged into Facebook, but not your app.
        if(Ember.isEmpty(this.me)) {
          this.get('store').createRecord('me', { id: 1, isLoggedIn: false });
        }
        else {
          this.get('me').set('isLoggedIn', false);
        }
  	}
  	else
  	{
  			// The person is not logged into Facebook, so we're not sure if
  			// they are logged into this app or not.
        if(Ember.isEmpty(this.get('me'))) {
          this.get('store').createRecord('me', { id: 1, isLoggedIn: false });
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
    var store = this.get('store');

  	FB.api('/me', {fields: 'id,email,first_name,last_name,picture.width(120).height(120),gender,friends,invitable_friends'}, function(response)
  	{
  		if( !response.error )
  		{
        console.log('Successful login for: ' + response.first_name + " " + response.last_name, response);

        var user = store.query('user', { fb_id: response.id }).then(users => {

            if(Ember.isEmpty(users)) {
              user = store.createRecord('user');
            }
            else {
              user = users.get('firstObject');
            }

            user.set('fb_id', response.id);
            user.set('email', response.email);
            user.set('first_name', response.first_name);
            user.set('last_name', response.last_name);
            user.set('img_url', response.picture.data.url);
            user.set('gender', response.gender);

            user.save().then(user => {

              var me = store.peekRecord('me', 1);
              me.set('user', user);

              self.loadRocket(user);
              self.loadLab(user);
              self.loadFriends(me, response);
            });
        });
  		}
  		else
  		{
  			console.log(response.error);
  		}
  	});
  },

  loadFriends: function(me, response) {
    console.log('friends', response["friends"]);
    response.friends.data.forEach(friend => {
      this.store.createRecord('friend', {
        me: me,
        long_fb_id: friend.id, // real user-id
        name: friend.name,
        img_url: 'http://graph.facebook.com/' + friend.id + '/picture',
        isAlreadyPlaying: true
      });
    });
    console.log('invitable_friends', response.invitable_friends);
    response.invitable_friends.data.forEach(friend => {
      this.store.createRecord('friend', {
        me: me,
        long_fb_id: friend.id, // seesion-id
        name: friend.name,
        img_url: friend.picture.data.url,
        isAlreadyPlaying: false
      });
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
                this.loadRocketCallback(user, rocket);
            });
          }
          else {
            rocket = rockets.get('firstObject');
            user.set('rocket', rocket);
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
    this.loadRocketComponent('cannon', 500, 120, user, rocket);
    this.loadRocketComponent('shield', 750, 240, user, rocket);
    this.loadRocketComponent('engine', 1000, 600, user, rocket);
  },

  loadRocketComponent: function(type, costs, construction_time, user, rocket) {
    rocket.get(type).then(component => {
      if(Ember.isEmpty(component)) {
         this.store.find('rocket-component', {
           type: type,
           rocket: rocket.get('id')
         }).then(components => {
           if(Ember.isEmpty(components)) {
             component = this.store.createRecord('rocket-component');
             component.set('type', type);
             component.set('costs', costs);
             component.set('construction_time', construction_time);
             component.set('rocket', rocket);
             component.save().then(component => {
               rocket.set(type, component);
               this.loadSelectedRocketComponentModelMM(component);
             });
           }
           else {
             component = components.get('firstObject');
             rocket.set(type, component);
             this.loadSelectedRocketComponentModelMM(component);
           }
         });
       }
       else {
         this.loadSelectedRocketComponentModelMM(component);
       }
    });
  },

  loadSelectedRocketComponentModelMM: function(component) {
    component.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
       if(Ember.isEmpty(selectedRocketComponentModelMm)) {
         this.setSelectedRocketComponentModelMM(component);
       }
       else {
         selectedRocketComponentModelMm.set('status', 'unlocked');
         selectedRocketComponentModelMm.save().then(() => {
            this.loadRocketComponentModelMms(component);
         });
       }
    });
  },

  setSelectedRocketComponentModelMM: function(component) {
    this.store.find('rocketComponentModel', {
      type: component.get('type'),
      model: 1
    }).then(rocketComponentModels => {
      if(Ember.isEmpty(rocketComponentModels)) {
        console.log('ERROR: No rocketComponentModel found in the DB for type ' + component.get('type') + ' and model 1');
      }
      else {
         this.store.find('rocketComponentModelMm', {
           rocketComponent: component.get('id'),
           rocketComponentModel: rocketComponentModels.get('firstObject').get('id')
         }).then(rocketComponentModelMms => {

           var rocketComponentModelMm = {};

           if(Ember.isEmpty(rocketComponentModelMms)) {
             rocketComponentModelMm = this.store.createRecord('rocket-component-model-mm', {
               rocketComponent: component,
               rocketComponentModel: rocketComponentModels.get('firstObject'),
               status: 'unlocked'
             });
             rocketComponentModelMm.save().then(rocketComponentModelMm => {
               component.set('selectedRocketComponentModelMm', rocketComponentModelMm);
               component.save().then(component => {
                 this.loadRocketComponentModelMms(component);
               });
             });
           }
           else {
             rocketComponentModelMm = rocketComponentModelMms.get('firstObject');
             component.set('selectedRocketComponentModelMm', rocketComponentModelMm);
             component.save().then(component => {
               this.loadRocketComponentModelMms(component);
             });
           }
         });
       }
    });
  },

  loadRocketComponentModelMms: function(component) {
    this.getAllComponentModels(component).then(models => {
      this.getMyComponentModelMms(component).then(myComponentModelMms => {
        models.forEach(aModel => {
          var matchingMyComponentModelMm = null;
          myComponentModelMms.forEach(aMyComponentModelMm => {
            if(aMyComponentModelMm.get('rocketComponentModel').get('id') === aModel.get('id')) {
              matchingMyComponentModelMm = aMyComponentModelMm;
            }
          });
          if(Ember.isEmpty(matchingMyComponentModelMm)) {
            var newComponentModelMm = this.store.createRecord('rocket-component-model-mm', {
              rocketComponent: component,
              rocketComponentModel: aModel
            });
            newComponentModelMm.save();
          }
        });
      });
    });
  },

  loadLab: function(user) {
    user.get('lab').then(lab => {
      if(Ember.isEmpty(lab)) {
        this.store.query('lab', { user: user.get('id') }).then(labs => {
          var lab = null;
          if(Ember.isEmpty(labs)) {
            lab = this.store.createRecord('lab');
            lab.set('user', user);
            lab.save().then(lab => {
              user.set('lab', lab);
            });
          }
          else {
            lab = labs.get('firstObject');
            user.set('lab', lab);
          }
        });
      }
    });
  }

});
