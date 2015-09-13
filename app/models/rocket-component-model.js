import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('String'),
  model: DS.attr('number'),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),
  rocketComponentModelLevels: DS.hasMany('rocket-component-model-level', { async: true }),

  tooltip: function() {
    return "You need " + this.get('costs') + " stars to unlock this " + this.get('type') + " model.";
  }.property('costs', 'type'),

  rareness: function() {
    if(this.get('model') === 1) {
      return 'common';
    }
    else if(this.get('model') === 2) {
      return 'uncommon';
    }
    else if(this.get('model') === 3) {
      return 'rare';
    }
    else {
      return 'common';
    }
  }.property('model'),

  rocketComponentModelCapacityLevels: function() {
    return this.get('rocketComponentModelLevels').then(rocketComponentModelLevels => {
      return rocketComponentModelLevels.filter(rocketComponentModelLevel => {
        return rocketComponentModelLevel.get('type') === 'capacity';
      });
    });
  }.property('rocketComponentModelLevels'),

  rocketComponentModelRechargeRateLevels: function() {
    return this.get('rocketComponentModelLevels').then(rocketComponentModelLevels => {
      return rocketComponentModelLevels.filter(rocketComponentModelLevel => {
        return rocketComponentModelLevel.get('type') === 'recharge_rate';
      });
    });
  }.property('rocketComponentModelLevels')
});
