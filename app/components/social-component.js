/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  socialSection: 'leaderboard',
  top_players: null,
  store: null,

  didInsertElement: function() {
    this.store = this.get('targetObject.store');

    this.store.query('user', { 'mode': 'leaderboard' }).then(users => {
      this.set('top_players', users);
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
