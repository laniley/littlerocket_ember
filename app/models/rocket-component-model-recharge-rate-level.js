import DS from 'ember-data';

export default DS.Model.extend({
  level: DS.attr('number'),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),
  recharge_rate: DS.attr('number', { defaultValue: 0.1 }),
  rocketComponentModel: DS.belongsTo('rocket-component-model', { async:true })
});
