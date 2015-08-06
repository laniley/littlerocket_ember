import DS from 'ember-data';

export default DS.Model.extend({
  level: DS.attr('number'),
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),
  bps: DS.attr('number', { defaultValue: 0.5 }),
  canonModel: DS.belongsTo('canon-model', { async:true })
});
