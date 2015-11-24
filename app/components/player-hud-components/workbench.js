import Ember from 'ember';
import ObjectMixin from './../../mixins/object';

export default Ember.Component.extend(ObjectMixin, {
  actions: {
    buyCannon: function() {
      var me = this.store.peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('cannon').then(rocketComponent => {
            this.buy(user, rocketComponent);
          });
        });
      });
    },
    buyShield: function() {
      var me = this.store.peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('shield').then(rocketComponent => {
            this.buy(user, rocketComponent);
          });
        });
      });
    },
    buyEngine: function() {
      var me = this.store.peekRecord('me', 1);
      me.get('user').then(user => {
        user.get('rocket').then(rocket => {
          rocket.get('engine').then(rocketComponent => {
            this.buy(user, rocketComponent);
          });
        });
      });
    }
  }
});
