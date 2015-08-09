import DS from 'ember-data';

export default DS.Model.extend({
  rocketComponentModelMm: DS.belongsTo('rocket-component-model-mm', { async:true }),
  rocketComponentModelRechargeRateLevel: DS.belongsTo('rocket-component-model-recharge-rate-level', { async:true }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  construction_start: DS.attr('number', { defaultValue: 0 })
});
