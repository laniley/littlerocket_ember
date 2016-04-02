import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  currentSection: 'leaderboard',
  currentChallengesSection: 'unplayed',
  leaderboard: null,
  leaderboardSortBy: 'score',
  leaderboardFilterBy: 'all',

  actions: {}
});
