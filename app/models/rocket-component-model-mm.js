import DS from 'ember-data';

export default DS.Model.extend({
  rocketComponent: DS.belongsTo('rocket-component', { async:true, inverse: null }),
  rocketComponentModel: DS.belongsTo('rocket-component-model', { async:true }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  rocketComponentModelCapacityLevelMm: DS.belongsTo('rocket-component-model-level-mm', { async: true }),
  rocketComponentModelRechargeRateLevelMm: DS.belongsTo('rocket-component-model-level-mm', { async: true })
});
