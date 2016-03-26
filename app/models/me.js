import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  friends: DS.hasMany('friend'),
  isLoggedIn: DS.attr('boolean', { defaultValue: false }),
  activeChallenge: DS.belongsTo('challenge', { async: false }),

  friends_playing: Ember.computed('friends', function() {
    return DS.PromiseObject.create({
      promise: this.get('friends').then(friends => {
        return Ember.RSVP.filter(friends.toArray(), friend => {
          return friend.get('is_already_playing');
        });
      })
    });
  })
});
