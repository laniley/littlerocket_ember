import Ember from 'ember';

export default Ember.Component.extend({

  classNames: ['list-item-column', 'component-level-upgrades'],

  me: null,
  myComponentModelMm: null,
  // show_not_enough_stars_alert: false,
  // not_enough_stars: false,
  // needed_stars: 0,

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
      this.get('myComponentModelMm').set('capacity', this.get('myComponentModelMm').get('capacity') + 1);
      this.get('myComponentModelMm').save();
    },
    upgrade_recharge_rate: function() {
      this.get('myComponentModelMm').set('recharge_rate', this.get('myComponentModelMm').get('recharge_rate') + 1);
      this.get('myComponentModelMm').save();
    }
  }
});
