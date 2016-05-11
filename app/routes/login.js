import Ember from 'ember';

export default Ember.Route.extend({
  // beforeModel: function() {
  //   var me = this.store.peekRecord('me', 1);
  //
  //   if(Ember.isEmpty(me)) {
  //     me = this.store.createRecord('me', { id: 1, isLoggedIn: false });
  //   }
  //
  //   if(me.get('isLoggedIn') === true) {
  //     this.transitionTo('index');
  //   }
  // },
});
