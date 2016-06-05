/* global LSM_Slot */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: [
    'overlay_section',
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
  overlay_section: 'none',
  player_hud_section: 'rocket',
    cockpit_section: 'workbench',
    lab_section: 'cannon',
  social_section: 'leaderboard',
    challenges_section: 'unplayed',
    leaderboard_filterBy: 'all',
    leaderboard_sortBy: 'score',
    armada_section: 'main',
    armada_main_section: 'home',

  didRender() {
    console.log('TEST');
    new LSM_Slot({
        adkey: '6df',
        ad_size: '728x90',
        slot: 'slot126743',
        _render_div_id: 'footer_banner',
        _preload: true
    });
  },

  actions: {
    close() {
      this.transitionToRoute('index', { queryParams: { overlay_section: 'none' }});
    }
  }
});
