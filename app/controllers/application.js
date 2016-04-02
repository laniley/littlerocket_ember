import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'player_hud_section',
    'social_section',
    'cockpit_section',
    'lab_section',
    'challenges_section',
    'leaderboard_filterBy',
    'leaderboard_sortBy'
  ],
  player_hud_section: 'rocket',
  social_section: 'leaderboard',
  cockpit_section: 'workbench',
  lab_section: 'cannon',
  challenges_section: 'unplayed',
  leaderboard_filterBy: 'all',
  leaderboard_sortBy: 'score'
});
