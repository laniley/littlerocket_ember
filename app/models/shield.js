import DS from 'ember-data';

export default DS.Model.extend({
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 240 }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  capacity: DS.attr('number', { defaultValue: 1 }),
  recharge_rate: DS.attr('number', { defaultValue: 0.1 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  rocket: DS.belongsTo('rocket')
});
