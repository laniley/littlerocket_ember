import Ember from 'ember';

export default Ember.Controller.extend({

    appController: Ember.inject.controller('application'),

    queryParams: [
      'player_hud_section',
        'cockpit_section',
        'lab_section',
      'social_section',
        'challenges_section',
        'leaderboard_filterBy',
        'leaderboard_sortBy',
        'armada_section',
        'armada_main_section'
    ],
    player_hud_section: 'quests',
      cockpit_section: 'workbench',
      lab_section: 'cannon',
    social_section: 'leaderboard',
      challenges_section: 'unplayed',
      leaderboard_filterBy: 'all',
      leaderboard_sortBy: 'score',
      armada_section: 'main',
      armada_main_section: 'home'
});
