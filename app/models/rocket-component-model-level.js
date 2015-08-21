import DS from 'ember-data';

export default DS.Model.extend({
  type: DS.attr('string'),
  level: DS.attr('number'),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),
  value: DS.attr('number', { defaultValue: 0 }),
  rocketComponentModel: DS.belongsTo('rocket-component-model', { async:true })
});
