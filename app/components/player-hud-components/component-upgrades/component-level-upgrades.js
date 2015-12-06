import Ember from 'ember';

export default Ember.Component.extend( {

  classNames: ['list-item-column', 'component-level-upgrades'],
  myComponentModelMm: null,

  needed_stars: 0,
  not_enough_stars: false,

  modelIsUnlocked: function() {
    if(this.get('myComponentModelMm').get('status') === 'unlocked') {
      return true;
    }
    else {
      return false;
    }
  }.property('myComponentModelMm.status'),

  actions: {
    upgrade_capacity: function() {
      this.set('targetObject.not_enough_stars', false);
      var me = this.store.peekRecord('me', 1);
      me.get('user').then(user => {
        if(user.get('stars') >= this.get('myComponentModelMm').get('capacity_upgrade_costs').get('content')) {
          user.set('stars', user.get('stars') - this.get('myComponentModelMm').get('capacity_upgrade_costs').get('content'));
          user.save().then(() => {
            this.get('myComponentModelMm').set('capacity', this.get('myComponentModelMm').get('capacity') + 1);
            this.get('myComponentModelMm').save();
          });
        }
        else {
          this.set('targetObject.needed_stars', this.get('myComponentModelMm').get('capacity_upgrade_costs').get('content'));
          this.set('targetObject.not_enough_stars', true);
          this.set('targetObject.show_missing_requirements_message', true);
        }
      });
    },
    upgrade_recharge_rate: function() {
      this.set('targetObject.not_enough_stars', false);
      this.set('targetObject.show_missing_requirements_message', false);
      var me = this.store.peekRecord('me', 1);
      me.get('user').then(user => {
        if(user.get('stars') >= this.get('myComponentModelMm').get('recharge_rate_upgrade_costs').get('content')) {
          user.set('stars', user.get('stars') - this.get('myComponentModelMm').get('recharge_rate_upgrade_costs').get('content'));
          user.save().then(() => {
            this.get('myComponentModelMm').set('recharge_rate', this.get('myComponentModelMm').get('recharge_rate') + 1);
            this.get('myComponentModelMm').save();
          });
        }
        else {
          this.set('targetObject.needed_stars', this.get('myComponentModelMm').get('recharge_rate_upgrade_costs').get('content'));
          this.set('targetObject.not_enough_stars', true);
          this.set('targetObject.show_missing_requirements_message', true);
        }
      });
    }
  }
});
