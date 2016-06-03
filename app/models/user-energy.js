import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  current: DS.attr('number', { defaultValue: 10}),
  max: DS.attr('number', { defaultValue: 10}),
  last_recharge: DS.attr('date')
});
