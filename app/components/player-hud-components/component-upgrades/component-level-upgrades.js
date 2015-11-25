import Ember from 'ember';

export default Ember.Component.extend({

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
    buyComponentLevel: function(aComponentModelLevelMm) {
      this.get('targetObject.me').get('user').then(user => {
        aComponentModelLevelMm.get('rocketComponentModelLevel').then(componentModelLevel => {
          if(user.get('stars') >= componentModelLevel.get('costs')) {
            var now = Math.floor(new Date().getTime() / 1000); // current timestamp in seconds
            aComponentModelLevelMm.set('construction_start', now);
            aComponentModelLevelMm.set('status', 'unlocked');
            aComponentModelLevelMm.save().then(() => {
              user.set('stars', user.get('stars') - componentModelLevel.get('costs'));
              user.save();
              if(componentModelLevel.get('type') === 'capacity') {
                this.get('myComponentModelMm').get('selectedRocketComponentModelCapacityLevelMm').then(selectedRocketComponentModelCapacityLevelMm => {
                  selectedRocketComponentModelCapacityLevelMm.set('isSelected', false);
                  aComponentModelLevelMm.set('isSelected', true);
                  this.get('myComponentModelMm').set('selectedRocketComponentModelCapacityLevelMm', aComponentModelLevelMm);
                  this.get('myComponentModelMm').save();
                });
              }
              else {
                this.get('myComponentModelMm').get('selectedRocketComponentModelRechargeRateLevelMm').then(selectedRocketComponentModelRechargeRateLevelMm => {
                  selectedRocketComponentModelRechargeRateLevelMm.set('isSelected', false);
                  aComponentModelLevelMm.set('isSelected', true);
                  this.get('myComponentModelMm').set('selectedRocketComponentModelRechargeRateLevelMm', aComponentModelLevelMm);
                  this.get('myComponentModelMm').save();
                });
              }
            });
          }
          else {
            this.set('targetObject.not_enough_stars', true);
            this.set('targetObject.needed_stars', componentModelLevel.get('costs'));
            this.set('targetObject.show_missing_requirements_message', true);
          }
        });
      });
    }
  }
});
