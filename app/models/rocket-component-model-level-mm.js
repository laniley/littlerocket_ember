import DS from 'ember-data';

export default DS.Model.extend({
  rocketComponentModelMm: DS.belongsTo('rocket-component-model-mm', { async:true, inverse: null }),
  rocketComponentModelLevel: DS.belongsTo('rocket-component-model-level', { async:true }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  construction_start: DS.attr('number', { defaultValue: 0 })
});
