import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'player_hud_section',
    'social_section',
    'cockpit_section',
    'lab_section',
    'challenges_section',
    'leaderboard_type'
  ],
  player_hud_section: 'rocket',
  social_section: 'leaderboard',
  cockpit_section: 'workbench',
  lab_section: 'cannon',
  challenges_section: 'unplayed',
  leaderboard_type: 'score'
});
