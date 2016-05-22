/* global LSM_Slot */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'player_hud_section',
    'social_section',
    'cockpit_section',
    'lab_section',
    'challenges_section',
    'leaderboard_filterBy',
    'leaderboard_sortBy',
    'armada_section'
  ],
  player_hud_section: 'rocket',
  social_section: 'leaderboard',
  cockpit_section: 'workbench',
  lab_section: 'cannon',
  challenges_section: 'unplayed',
  leaderboard_filterBy: 'all',
  leaderboard_sortBy: 'score',
  armada_section: 'main',
  didRender() {
    console.log('TEST');
    new LSM_Slot({
        adkey: '6df',
        ad_size: '728x90',
        slot: 'slot126743',
        _render_div_id: 'footer_banner',
        _preload: true
    });
  }
});
