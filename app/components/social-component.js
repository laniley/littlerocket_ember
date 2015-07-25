/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  socialSection: 'leaderboard',
  leaderboard: null,
  store: null,

  didInsertElement: function() {
    this.store = this.get('targetObject.store');

    this.store.query('user', { 'mode': 'leaderboard' }).then(users => {
      var leaderboard = this.store.createRecord('leaderboard', {
        id: 1,
        name: 'world leaderboard',
        players: users
      });

      this.set('leaderboard', leaderboard);
    });
  },

  actions: {
    openSection: function(section) {
      this.set('socialSection', section);
    },
    inviteFriends: function() {
      FB.ui ({
       method: 'apprequests',
       message: 'Little Rocket is great fun! Just fly as far as you can!',
       filters: ['app_non_users']
      });
    }
  }
});
