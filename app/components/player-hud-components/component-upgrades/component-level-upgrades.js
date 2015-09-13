import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({

  me: null,
  myComponentModelMm: null,

  allComponentModelCapacityLevelMms: function() {
    return DS.PromiseArray.create({
      promise: this.get('me').get('rocketComponentModelCapacityLevelMms').then(rocketComponentModelCapacityLevelMms => {
        return rocketComponentModelCapacityLevelMms.filter(rocketComponentModelCapacityLevelMm => {
          return rocketComponentModelCapacityLevelMm.get('rocketComponentModelMm').get('id') === this.get('myComponentModelMm').get('id');
        });
      })
    });
  }.property('me.rocketComponentModelCapacityLevelMms.length', 'me.rocketComponentModelCapacityLevelMms.@each.rocketComponentModelMm'),

  allComponentModelRechargeRateLevelMms: function() {
    return DS.PromiseArray.create({
      promise: this.get('me').get('rocketComponentModelRechargeRateLevelMms').then(rocketComponentModelRechargeRateLevelMms => {
        return rocketComponentModelRechargeRateLevelMms.filter(rocketComponentModelRechargeRateLevelMm => {
          return rocketComponentModelRechargeRateLevelMm.get('rocketComponentModelMm').get('id') === this.get('myComponentModelMm').get('id');
        });
      })
    });
  }.property('me.rocketComponentModelRechargeRateLevelMms.length', 'me.rocketComponentModelRechargeRateLevelMms.@each.rocketComponentModelMm')
});
