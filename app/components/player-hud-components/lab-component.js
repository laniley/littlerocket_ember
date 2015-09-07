import Ember from 'ember';

export default Ember.Component.extend({
  me: null,
  currentLabSection: '',
  store: function() {
    return this.get('targetObject.store');
  }.property()
});
