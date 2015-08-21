import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['player_hud_section', 'cockpit_section', 'lab_section'],
  player_hud_section: 'cockpit',
  cockpit_section: 'workbench',
  lab_section: 'canon'
});
