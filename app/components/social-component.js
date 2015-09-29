import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  currentSection: 'leaderboard',
  currentChallengesSection: 'unplayed',
  currentLeaderboardType: 'score',
  leaderboard: null,
  store: null,

  didInsertElement: function() {
    this.store = this.get('targetObject.store');
    this.loadLeaderboard();
  },

  loadLeaderboard: function() {
    this.set('leaderboard', null);
    var leaderboard = null;
    if(this.get('currentLeaderboardType') === 'score') {
      leaderboard = this.store.peekRecord('leaderboard', 1);
      if(Ember.isEmpty(leaderboard)) {
        this.store.query('user', { 'mode': 'leaderboard', 'type': 'score' }).then(users => {
          leaderboard = this.store.createRecord('leaderboard', {
            id: 1,
            name: 'world score leaderboard',
            players: users
          });
          this.set('leaderboard', leaderboard);
        });
      }
      else {
        this.set('leaderboard', leaderboard);
      }
    }
    else if(this.get('currentLeaderboardType') === 'challenges') {
      leaderboard = this.store.peekRecord('leaderboard', 2);
      if(Ember.isEmpty(leaderboard)) {
        this.store.query('user', { 'mode': 'leaderboard', 'type': 'challenges' }).then(users => {
          leaderboard = this.store.createRecord('leaderboard', {
            id: 2,
            name: 'world challenges leaderboard',
            players: users
          });
          this.set('leaderboard', leaderboard);
        });
      }
      else {
        this.set('leaderboard', leaderboard);
      }
    }
  }.observes('currentLeaderboardType'),

  actions: {}
});
