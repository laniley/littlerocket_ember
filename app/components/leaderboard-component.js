import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  top_players: null,
  store: null,

  didInsertElement: function() {
    this.store = this.get('targetObject.store');

    this.store.query('user', { 'mode': 'leaderboard' }).then(users => {
      this.set('top_players', users);
    });
  }
});
