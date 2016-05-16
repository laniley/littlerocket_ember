import Ember from 'ember';

export default Ember.Component.extend({
  session: Ember.inject.service('session'),
  me: null,
  currentSection: 'leaderboard',
  currentChallengesSection: 'unplayed',
  leaderboard: null,
  leaderboardSortBy: 'score',
  leaderboardFilterBy: 'all',
  armadaSection: 'home',

  actions: {}
});
