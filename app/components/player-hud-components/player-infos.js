import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({

  classNames: ['player-infos'],

  me: null,

  reached: Ember.computed('me.user.experience', 'me.user.needed_exp_for_current_level', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          return user.get('experience') - user.get('needed_exp_for_current_level');
        }
        else {
          return 0;
        }
      })
    });
  }),

  total: Ember.computed('me.user.needed_exp_for_current_level', 'me.user.needed_exp_for_next_level', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          return user.get('needed_exp_for_next_level') - user.get('needed_exp_for_current_level');
        }
        else {
          return 0;
        }
      })
    });
  }),

  // needed_exp_for_prev_level: function() {
  //   return this.get('me').get('user').then(user => {
  //     if(!Ember.isEmpty(user)) {
  //       return 500 * Math.pow(user.get('exp_level')-1, 2);
  //     }
  //     else {
  //       return 0;
  //     }
  //   });
  // }.property('me.user.exp_level'),


  // set_exp_meter_fill_width: function() {
  //   this.get('me').get('user').then(user => {
  //     if(!Ember.isEmpty(user)) {
  //       this.get('needed_exp_for_prev_level').then(needed_exp_for_prev_level => {
  //         var percentage = ((user.get('experience') - needed_exp_for_prev_level) / user.get('needed_exp_for_next_level')) * 100;
  //         Ember.$('.exp-meter-progress').width((percentage-0.5) + '%');
  //       });
  //     }
  //   });
  // }.observes('me.user', 'me.user.experience', 'me.user.needed_exp_for_next_level', 'needed_exp_for_prev_level').on('init')
});
