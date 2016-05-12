import Ember from 'ember';
import ObjectMixin from './../mixins/buyable-object';

export default Ember.Component.extend(ObjectMixin, {
  session: Ember.inject.service('session'),
  me: null,
  currentSection: 'rocket',
  currentCockpitSection: 'workbench',
  currentLabSection: 'cannon',

  actions: {
    buyLab: function() {
      var me = this.store.peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('lab').then(component => {
          this.set('needed_level', 3);
          this.buy(user, component);
        });
      });
    }
  }
});
