import DS from 'ember-data';
import Ember from 'ember';

export default Ember.Component.extend({
  armadas: Ember.computed(function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        return this.store.query('armada', {
          'mode': 'suggestions'
        }).then(armadas => {
          armadas.forEach(armada => {
            this.store.query('armadaMembershipRequest', {
              armada_id: armada.get('id'),
              user_id: user.get('id')
            });
          });
          return armadas;
        });
      })
    });
  }),
  actions: {
    close() {
      this.get('targetObject').set('showJoinableArmadas', false);
    }
  }
});
