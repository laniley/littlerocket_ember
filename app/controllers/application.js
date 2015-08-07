import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['cockpit_section', 'lab_section'],
  cockpit_section: 'workbench',
  lab_section: 'canon'
});
