import Ember from 'ember';
import DS from 'ember-data';
import ObjectMixin from './../mixins/buyable-object';

export default Ember.Component.extend(ObjectMixin, {

  clock: Ember.inject.service('clock'),
  session: Ember.inject.service('session'),

  me: null,
  currentSection: 'rocket',
  currentCockpitSection: 'workbench',
  currentLabSection: 'cannon',

  time_till_next_recharge: Ember.computed('me.user.energy.last_recharge', 'clock.time', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        return user.get('energy').then(energy => {
          var milliseconds_since_last_recharge = this.get('clock.time') - energy.get('last_recharge').getTime();
          var seconds_since_last_recharge = milliseconds_since_last_recharge / 1000;
          return Math.floor(300 - seconds_since_last_recharge);
        });
      })
    });
  }),

  minutes_till_next_recharge: Ember.computed('time_till_next_recharge', function() {
    return DS.PromiseObject.create({
      promise: this.get('time_till_next_recharge').then(time => {
        return Math.floor(time / 60);
      })
    });
  }),

  seconds_till_next_recharge: Ember.computed('time_till_next_recharge', function() {
    return DS.PromiseObject.create({
      promise: this.get('time_till_next_recharge').then(time => {
        var seconds = time - (60 * Math.floor(time / 60));
        if(seconds > 9) {
          return seconds;
        }
        else {
          return '0' + seconds;
        }
      })
    });
  }),

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
