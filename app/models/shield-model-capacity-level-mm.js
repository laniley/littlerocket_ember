import DS from 'ember-data';

export default DS.Model.extend({
  shieldModelMm: DS.belongsTo('shield-model-mm', { async:true }),
  shieldModelCapacityLevel: DS.belongsTo('shield-model-capacity-level', { async:true }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  construction_start: DS.attr('number', { defaultValue: 0 })
});
