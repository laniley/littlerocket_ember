import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  currentSection: 'cockpit',
  currentCockpitSection: 'workbench',
  currentLabSection: 'canon',

  store: function() {
    return this.get('targetObject.store');
  }.property(),

  actions: {
    openSection: function(section) {
      this.set('currentSection', section);
    }
  }
});
