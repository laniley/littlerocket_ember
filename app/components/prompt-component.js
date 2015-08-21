import Ember from 'ember';

export default Ember.Component.extend({
  didInsertElement: function() {
    setTimeout(() => {
      this.set('targetObject.show_not_enough_stars_alert', false);
    }, 1500);
  }
});
