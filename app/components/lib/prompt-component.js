import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    setTimeout(() => {
      this.set('targetObject.show_missing_requirements_message', false);
    }, 1500);
  }
});
