import DS from 'ember-data';

export default DS.Model.extend({
  costs: DS.attr('number', { defaultValue: 500 }),
  construction_time: DS.attr('number', { defaultValue: 120 }),
  capacity: DS.attr('number', { defaultValue: 3 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  rocket: DS.belongsTo('rocket')
});
