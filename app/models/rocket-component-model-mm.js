import DS from 'ember-data';

export default DS.Model.extend({
  rocketComponent: DS.belongsTo('rocket-component', { async:true, inverse: 'rocketComponentModelMms' }),
  rocketComponentModel: DS.belongsTo('rocket-component-model', { async:true }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  capacity: DS.attr('number', { defaultValue: 3 }),
  recharge_rate: DS.attr('number', { defaultValue: 1 }),

  recharge_rate_percentage: function() {
    return this.get('recharge_rate') * 10;
  }.property('recharge_rate'),

  capacity_upgrade_costs: function() {
    return (this.get('capacity') + 1) * 100;
  }.property('capacity'),

  recharge_rate_upgrade_costs: function() {
    return (this.get('recharge_rate') + 1) * 100;
  }.property('recharge_rate')
});
