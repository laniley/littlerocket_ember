import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  me: null,
  filterBy: 'all',
  sortBy: 'score',

  players: Ember.computed('me.users_of_friends_playing.length', 'filterBy', 'sortBy', function() {
    if(this.get('filterBy') === 'friends') {
      return DS.PromiseObject.create({
        promise: this.get('me.users_of_friends_playing').then(users_of_friends_playing => {
          return users_of_friends_playing;
        })
      });
    }
    else {
      return DS.PromiseObject.create({
        promise: this.store.query('user', {
            'mode': 'leaderboard',
            'type': this.get('sortBy'),
          }).then(users => {
          return users;
        })
      });
    }
  })
});
