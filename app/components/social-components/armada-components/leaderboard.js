import DS from 'ember-data';
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['armada-leaderboard'],
  armadas: Ember.computed(function() {
    return DS.PromiseObject.create({
      promise: this.store.query('armada', {
        'mode': 'leaderboard'
      }).then(armadas => {
        return armadas;
      })
    });
  }),
});
