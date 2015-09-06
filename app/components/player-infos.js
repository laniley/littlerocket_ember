import Ember from 'ember';

export default Ember.Component.extend({
  me: null,

  needed_exp_for_prev_level: function() {
    return this.get('me').get('user').then(user => {
      if(!Ember.isEmpty(user)) {
        return 500 * Math.pow(user.get('exp_level')-1, 2);
      }
      else {
        return 0;
      }
    });
  }.property('me.user.exp_level'),

  set_exp_meter_fill_width: function() {
    this.get('me').get('user').then(user => {
      if(!Ember.isEmpty(user)) {
        this.get('needed_exp_for_prev_level').then(needed_exp_for_prev_level => {
          console.log(needed_exp_for_prev_level);
          var percentage = ((user.get('experience') - needed_exp_for_prev_level) / user.get('needed_exp_for_next_level')) * 100;
          console.log(percentage);
          Ember.$('.exp-meter-progress').width((percentage-0.5) + '%');
        });
      }
    });
  }.observes('me.user', 'me.user.experience', 'me.user.needed_exp_for_next_level', 'needed_exp_for_prev_level')
});
