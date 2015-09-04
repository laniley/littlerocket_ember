import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  currentSection: 'rocket',
  currentCockpitSection: 'workbench',
  currentLabSection: 'canon',

  store: function() {
    return this.get('targetObject.store');
  }.property()
});
