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

    this.loadCanon(user, rocket);
    this.loadShield(user, rocket);
  },

  loadCanon: function(user, rocket) {
    if(rocket.get('canon')) {
      rocket.get('canon').then(canon => {
       if(Ember.isEmpty(canon)) {
         this.store.query('canon', { rocket: rocket.get('id') }).then(canons => {
           if(Ember.isEmpty(canons)) {
             canon = this.store.createRecord('canon');
             canon.set('rocket', rocket);
             canon.save().then(canon => {
                 rocket.set('canon', canon);
                 rocket.save();
                 this.loadCanonModel(canon);
             });
           }
           else {
             canon = canons.get('firstObject');
             rocket.set('canon', canon);
             rocket.save();
             this.loadCanonModel(canon);
           }
         });
       }
       else {
         this.loadCanonModel(canon);
       }
      });
    }
    else {
      var canon = this.store.createRecord('canon');
      canon.set('rocket', rocket);
      canon.save().then(canon => {
          rocket.set('canon', canon);
          rocket.save();
          this.loadCanonModel(canon);
      });
    }
  },

  loadCanonModel: function(canon) {
    if(canon.get('selectedCanonModelMm')) {
      canon.get('selectedCanonModelMm').then(canonModelMm => {
       if(Ember.isEmpty(canonModelMm)) {
         this.store.query('canonModelMm', { canon: canon.get('id') }).then(canonModelMms => {
           if(Ember.isEmpty(canonModelMms)) {
             this.store.query('canonModel', { model: 1 }).then(canonModels => {
               canonModelMm = this.store.createRecord('canon-model-mm', {
                 canon: canon,
                 canonModel: canonModels.get('firstObject'),
                 status: 'unlocked'
               });
               canonModelMm.save().then(canonModelMm => {
                 canon.set('selectedCanonModelMm', canonModelMm);
                 canon.save();
                 this.loadCanonModelAmmoLevel(canonModelMm);
                 this.loadCanonModelBPSLevel(canonModelMm);
               });
             });
           }
           else {
             this.loadCanonModelAmmoLevel(canonModelMm);
             this.loadCanonModelBPSLevel(canonModelMm);
           }
         });
       }
       else {
         this.loadCanonModelAmmoLevel(canonModelMm);
         this.loadCanonModelBPSLevel(canonModelMm);
       }
      });
    }
    else {
      this.store.query('canonModel', { model: 1 }).then(canonModels => {
        var canonModelMm = this.store.createRecord('canon-model-mm', {
          canon: canon,
          canonModel: canonModels.get('firstObject'),
          status: 'unlocked'
        });
        canonModelMm.save().then(canonModelMm => {
          canon.set('selectedCanonModelMm', canonModelMm);
          canon.save();
          this.loadCanonModelAmmoLevel(canonModelMm);
          this.loadCanonModelBPSLevel(canonModelMm);
        });
      });
    }
  },

  loadCanonModelAmmoLevel: function(canonModelMm) {
    if(canonModelMm.get('canonModelAmmoLevelMm')) {
      canonModelMm.get('canonModelAmmoLevelMm').then(canonModelAmmoLevelMm => {
        if(Ember.isEmpty(canonModelAmmoLevelMm)) {
          canonModelMm.get('canonModel').then(canonModel => {
            this.store.query('canonModelAmmoLevel', {
              level: 1,
              canonModel: canonModel.get('id')
            }).then(canonModelAmmoLevels => {
              this.store.query('canonModelAmmoLevelMm', {
                canonModelMm: canonModelMm.get('id'),
                canonModelAmmoLevel: canonModelAmmoLevels.get('firstObject').get('id')
              }).then(canonModelAmmoLevelMms => {
                if(Ember.isEmpty(canonModelAmmoLevelMms)) {
                  canonModelAmmoLevelMm = this.store.createRecord('canon-model-ammo-level-mm', {
                     canonModelMm: canonModelMm,
                     canonModelAmmoLevel: canonModelAmmoLevels.get('firstObject'),
                     construction_start: 0,
                     status: 'unlocked'
                  });
                  canonModelAmmoLevelMm.save().then(canonModelAmmoLevelMm => {
                     canonModelMm.set('canonModelAmmoLevelMm', canonModelAmmoLevelMm);
                     canonModelMm.save();
                  });
                }
              });
            });
          });
        }
      });
    }
    else {
      console.log('test');
    }
  },

  loadCanonModelBPSLevel: function(canonModelMm) {
    if(canonModelMm.get('canonModelBpsLevelMm')) {
      canonModelMm.get('canonModelBpsLevelMm').then(canonModelBpsLevelMm => {
        if(Ember.isEmpty(canonModelBpsLevelMm)) {
          this.store.query('canonModelBpsLevelMm', { canonModelMm: canonModelMm.get('id') }).then(canonModelBpsLevelMms => {
            if(Ember.isEmpty(canonModelBpsLevelMms)) {
              console.log('test1');
    //             this.store.query('canonModelLevel', { level: 1 }).then(canonModelLevels => {
    //               console.log('test1');
        //          canonModelMm = this.store.createRecord('canon-model-mm', {
        //            canon: canon,
        //            canonModel: canonModels.get('firstObject'),
        //            status: 'unlocked'
        //          });
        //          canonModelMm.save().then(canonModelMm => {
        //            canon.set('selectedCanonModelMm', canonModelMm);
        //            canon.save();
        //            this.loadCanonModelLevel();
        //          });
      //           });
            }
          });
        }
      });
    }
    else {
      console.log('test2');
      // this.store.query('canonModel', { model: 1 }).then(canonModels => {
      //   var canonModelMm = this.store.createRecord('canon-model-mm', {
      //     canon: canon,
      //     canonModel: canonModels.get('firstObject'),
      //     status: 'unlocked'
      //   });
      //   canonModelMm.save().then(canonModelMm => {
      //     canon.set('selectedCanonModelMm', canonModelMm);
      //     canon.save();
      //     this.loadCanonModelLevel();
      //   });
      // });
    }
  },

  loadShield: function(user, rocket) {
    if(rocket.get('shield')) {
      rocket.get('shield').then(shield => {
       if(Ember.isEmpty(shield)) {
         this.store.query('shield', { rocket: rocket.get('id') }).then(shields => {
           if(Ember.isEmpty(shields)) {
             shield = this.store.createRecord('shield');
             shield.set('rocket', rocket);
             shield.save().then(shield => {
                 rocket.set('shield', shield);
                 rocket.save();
             });
           }
           else {
             shield = shields.get('firstObject');
             rocket.set('shield', shield);
             rocket.save();
           }
         });
       }
      });
    }
    else {
      var shield = this.store.createRecord('shield');
      shield.set('rocket', rocket);
      shield.save().then(shield => {
          rocket.set('shield', shield);
          rocket.save();
      });
    }
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
