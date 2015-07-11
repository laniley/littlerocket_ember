import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    var me = this.store.getById('me', 1);

    if(Ember.isEmpty(me)) {
      return this.store.createRecord('me', { id: 1, isLoggedIn: false });
    }
    else {
      return me;
    }
  }
});
