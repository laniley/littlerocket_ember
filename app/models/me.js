import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  friends: DS.hasMany('friend'),
  accessToken: DS.attr('string', { defaultValue: ''}),
  loginStatus: DS.attr('string', { defaultValue: 'unknown'}),
  activeChallenge: DS.belongsTo('challenge', { async: false }),
  fbAppRequest: DS.hasMany('fb-app-request', {async: false }),

  friends_playing: Ember.computed('friends.length', function() {
    return DS.PromiseObject.create({
      promise: this.get('friends').then(friends => {
        return Ember.RSVP.filter(friends.toArray(), friend => {
          return friend.get('is_already_playing');
        });
      })
    });
  }),

  users_of_friends_playing: Ember.computed('friends_playing.@each.user', function() {
    return DS.PromiseObject.create({
      promise: this.get('friends_playing').then(friends_playing => {
       return Ember.RSVP.map(friends_playing.toArray(), friend => {
         return friend.get('user').then(user => {
           return user;
         });
       }).then(friends => {
         return this.get('user').then(user => {
           friends.pushObject(user);
           return friends;
         });
       });
     })
    });
  }),

  // friends_sorted_by_score: Ember.computed('users_of_friends_playing.@each.rank_by_score', function() {
  //   return DS.PromiseObject.create({
  //     promise: this.get('users_of_friends_playing').then(players => {
  //        return this.get('user').then(user => {
  //          players.pushObject(user);
  //          return players.sortBy('rank_by_score');
  //        });
  //      })
  //   });
  // }),
  //
  // friends_sorted_by_achievements: Ember.computed('users_of_friends_playing.@each.achievement_points', function() {
  //   return DS.PromiseObject.create({
  //     promise: this.get('users_of_friends_playing').then(players => {
  //        return this.get('user').then(user => {
  //          players.pushObject(user);
  //          return players.sortBy('achievement_points', 'desc');
  //        });
  //     })
  //   });
  // }),
});
