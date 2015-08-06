import DS from 'ember-data';

export default DS.Model.extend({
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 240 }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  rocket: DS.belongsTo('rocket', { async: true }),
  selectedShieldModelMm: DS.belongsTo('shield-model-mm', { async: true })
});
