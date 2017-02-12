/* global FB */
import Ember from 'ember';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend(AuthenticatedRouteMixin, {

    scope: 'id,email,first_name,last_name,picture.width(120).height(120),gender,friends,invitable_friends',

    session: Ember.inject.service('session'),

    model: function() {
        var me = this.store.peekRecord('me', 1);

        if(Ember.isEmpty(me)) {
          return this.store.createRecord('me', { id: 1 });
        }
        else {
          return me;
        }
    },

    afterModel() {
        this.getUserDataFromFB();
    },

    getUserDataFromFB(callback) {
        console.log('Welcome!  Fetching your information.... ');
        var store = this.get('store');
        FB.api('/me', { fields: this.get('scope') }, response => {
  		    if( !response.error ) {
                console.log('Successful login for: ' + response.first_name + " " + response.last_name, response);
                var me = store.peekRecord('me', 1);
                // response.id = 10202654621741836; // for testing
                var user = store.query('user', { fb_id: response.id, mode: 'me' }).then(users => {
                    if(Ember.isEmpty(users)) {
                        user = store.createRecord('user');
                        user.set('fb_id', response.id);
                        user.set('email', response.email);
                        user.set('first_name', response.first_name);
                        user.set('last_name', response.last_name);
                        user.set('img_url', response.picture.data.url);
                        user.set('gender', response.gender);
                        user.save().then(user => {
                            me.set('user', user);
                            this.get('session').set('data.user_id', user.get('id'));
                            // this.loadQuests(user);
                            this.loadRocket(user);
                            // this.loadLab(user);
                            this.loadFriends(me, response);
                            this.transitionTo('intern.welcome');
                        });
                    }
                    else {
                        user = users.get('firstObject');
                        me.set('user', user);
                        this.get('session').set('data.user_id', user.get('id'));
                        user.set('fb_id', response.id);
                        user.set('email', response.email);
                        user.set('first_name', response.first_name);
                        user.set('last_name', response.last_name);
                        user.set('img_url', response.picture.data.url);
                        user.set('gender', response.gender);
                        // this.loadQuests(user);
                        this.loadRocket(user);
                        // this.loadLab(user);
                        this.loadFriends(me, response);
                    }


                });
		    }
  		    else {
  			    console.log(response.error);
  		    }
            if(callback) {
                callback();
            }
  	    });
    },

    loadQuests(user) {
        this.store.query('userQuest', { 'user_id': user.id });
    },

    loadFriends(me, response) {

        console.log('friends', response["friends"]);
        response.friends.data.forEach(friend => {
            var aFriend = this.store.createRecord('friend', {
                me: me,
                fb_id: friend.id, // real user-id
                name: friend.name,
                img_url: 'http://graph.facebook.com/' + friend.id + '/picture',
                is_already_playing: true
            });
            // load user
            this.store.query('user', { 'fb_id': friend.id }).then(users => {
                aFriend.set('user', users.get('firstObject'));
            });
        });

        console.log('invitable_friends', response.invitable_friends);
        response.invitable_friends.data.forEach(friend => {
            this.store.createRecord('friend', {
                me: me,
                fb_id: friend.id, // session-id
                name: friend.name,
                img_url: friend.picture.data.url,
                is_already_playing: false
            });
        });
    },

    loadRocket(user) {
        var rocket = this.store.query('rocket', { user: user.get('id') }).then(rockets => {
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
    },

    loadRocketCallback(user, rocket) {
        this.loadRocketComponent('cannon', 1, rocket);
        this.loadRocketComponent('shield', 2, rocket);
        this.loadRocketComponent('engine', 3, rocket);
    },

    loadRocketComponent(type, type_id, rocket) {
        rocket.get(type).then(component => {
            if(Ember.isEmpty(component)) {
                this.store.query('rocket-component', {
                    type: type_id,
                    rocket: rocket.get('id')
                }).then(components => {
                    if(Ember.isEmpty(components)) {
                        this.store.findRecord('rocket-component-type', type_id).then(type => {
                            component = this.store.createRecord('rocket-component');
                            component.set('rocket', rocket);
                            component.set('rocketComponentType', type);
                            component.save().then(component => {
                                rocket.set(type, component);
                                // this.loadRocketComponentModelMms(component);
                            });
                        });
                    }
                    else {
                        component = components.get('firstObject');
                        rocket.set(type, component);
                        // this.loadRocketComponentModelMms(component);
                    }
                });
          }
          else {
            // this.loadRocketComponentModelMms(component);
          }
        });
    },

    // loadRocketComponentModelMms(component) {
    //     this.getAllComponentModels(component).then(models => {
    //       this.getMyComponentModelMms(component).then(myComponentModelMms => {
    //         models.forEach(aModel => {
    //           var componentModelMm = null;
    //           myComponentModelMms.forEach(aMyComponentModelMm => {
    //             if(aMyComponentModelMm.get('rocketComponentModel').get('id') === aModel.get('id')) {
    //               componentModelMm = aMyComponentModelMm;
    //             }
    //           });
    //           if(Ember.isEmpty(componentModelMm)) {
    //             var status = 'locked';
    //             if(aModel.get('model') === 1) {
    //               status = 'unlocked';
    //             }
    //             componentModelMm = this.store.createRecord('rocket-component-model-mm', {
    //               rocketComponent: component,
    //               rocketComponentModel: aModel,
    //               status: status
    //             });
    //             componentModelMm.save().then(() => {
    //               this.loadSelectedRocketComponentModelMM(component);
    //             });
    //           }
    //           else {
    //             this.loadSelectedRocketComponentModelMM(component);
    //           }
    //         });
    //       });
    //     });
    // },

    // loadSelectedRocketComponentModelMM(component) {
    //     component.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
    //        if(Ember.isEmpty(selectedRocketComponentModelMm)) {
    //          this.setSelectedRocketComponentModelMM(component);
    //        }
    //     });
    // },

    // getAllComponentModels(component) {
    //     return this.store.query('rocket-component-model', { 'type': component.get('type') }).then(models => {
    //       return models;
    //     });
    // },

    // getMyComponentModelMms(component) {
    //     return component.get('rocketComponentModelMms').then(rocketComponentModelMms => {
    //       return rocketComponentModelMms;
    //     });
    // },

    // setSelectedRocketComponentModelMM(component) {
    //     this.store.query('rocketComponentModel', {
    //       type: component.get('type'),
    //       model: 1
    //     }).then(rocketComponentModels => {
    //       if(Ember.isEmpty(rocketComponentModels)) {
    //         console.log('ERROR: No rocketComponentModel found in the DB for type ' + component.get('type') + ' and model 1');
    //       }
    //       else {
    //          this.store.query('rocketComponentModelMm', {
    //            rocketComponent: component.get('id'),
    //            rocketComponentModel: rocketComponentModels.get('firstObject').get('id')
    //          }).then(rocketComponentModelMms => {
    //
    //            var rocketComponentModelMm = {};
    //
    //            if(Ember.isEmpty(rocketComponentModelMms)) {
    //              rocketComponentModelMm = this.store.createRecord('rocket-component-model-mm', {
    //                rocketComponent: component,
    //                rocketComponentModel: rocketComponentModels.get('firstObject'),
    //                status: 'unlocked'
    //              });
    //              rocketComponentModelMm.save().then(rocketComponentModelMm => {
    //                component.set('selectedRocketComponentModelMm', rocketComponentModelMm);
    //                component.save().then(component => {
    //                  this.loadRocketComponentModelMms(component);
    //                });
    //              });
    //            }
    //            else {
    //              rocketComponentModelMm = rocketComponentModelMms.get('firstObject');
    //              component.set('selectedRocketComponentModelMm', rocketComponentModelMm);
    //              component.save().then(component => {
    //                this.loadRocketComponentModelMms(component);
    //              });
    //            }
    //          });
    //        }
    //     });
    // },

    loadLab(user) {
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
