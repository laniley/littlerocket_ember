import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  currentSection: 'leaderboard',
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

  actions: {}
});
