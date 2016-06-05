import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  friends: DS.hasMany('friend'),
  accessToken: DS.attr('string', { defaultValue: ''}),
  loginStatus: DS.attr('string', { defaultValue: 'unknown'}),
  activeChallenge: DS.belongsTo('challenge', { async: false }),

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
           if(!Ember.isEmpty(user)) {
             return user;
           }
           else {
             console.log('user not set', friend.get('fb_id'));
           }
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
});
