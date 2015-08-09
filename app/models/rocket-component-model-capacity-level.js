import DS from 'ember-data';

export default DS.Model.extend({
  level: DS.attr('number'),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),
  capacity: DS.attr('number', { defaultValue: 3 }),
  rocketComponentModel: DS.belongsTo('rocket-component-model', { async:true })
});
