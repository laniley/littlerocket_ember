import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  rocketComponent: DS.belongsTo('rocket-component', { async:true, inverse: 'rocketComponentModelMms' }),
  rocketComponentModel: DS.belongsTo('rocket-component-model', { async:true }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  selectedRocketComponentModelCapacityLevelMm: DS.belongsTo('rocket-component-model-level-mm', { async: true }),
  selectedRocketComponentModelRechargeRateLevelMm: DS.belongsTo('rocket-component-model-level-mm', { async: true }),
  rocketComponentModelLevelMms: DS.hasMany('rocket-component-model-level-mm', { async: true }),

  rocketComponentModelCapacityLevelMms: function() {
    var previousLevelMm = null;
    return DS.PromiseObject.create({
      promise: this.get('rocketComponentModelLevelMms').then(rocketComponentModelLevelMms => {
        return Ember.RSVP.filter(rocketComponentModelLevelMms.toArray(), rocketComponentModelLevelMm => {
          return rocketComponentModelLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelLevel => {
            if(rocketComponentModelLevel.get('type') === 'capacity') {
              rocketComponentModelLevelMm.set('previousLevelMm', previousLevelMm);
              previousLevelMm = rocketComponentModelLevelMm;
              return true;
            }
          });
        });
      })
    });
  }.property('rocketComponentModelLevelMms.length'),

  rocketComponentModelRechargeRateLevelMms: function() {
    var previousLevelMm = null;
    return DS.PromiseObject.create({
      promise: this.get('rocketComponentModelLevelMms').then(rocketComponentModelLevelMms => {
        return Ember.RSVP.filter(rocketComponentModelLevelMms.toArray(), rocketComponentModelLevelMm => {
          return rocketComponentModelLevelMm.get('rocketComponentModelLevel').then(rocketComponentModelLevel => {
            if(rocketComponentModelLevel.get('type') === 'recharge_rate') {
              rocketComponentModelLevelMm.set('previousLevelMm', previousLevelMm);
              previousLevelMm = rocketComponentModelLevelMm;
              return true;
            }
          });
        });
      })
    });
  }.property('rocketComponentModelLevelMms.length')
});
