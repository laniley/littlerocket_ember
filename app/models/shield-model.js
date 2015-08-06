import DS from 'ember-data';

export default DS.Model.extend({
  model: DS.attr('number'),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),
  shieldModelCapacityLevels: DS.hasMany('shield-model-capacity-level', { async: true }),
  shieldModelRechargeLevels: DS.hasMany('shield-model-recharge-level', { async: true })
});
