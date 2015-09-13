import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  isLoggedIn: DS.attr('boolean', { defaultValue: false }),
  rocketComponentModelCapacityLevelMms: DS.hasMany('rocket-component-model-level-mm', { async: true }),
  rocketComponentModelRechargeRateLevelMms: DS.hasMany('rocket-component-model-level-mm', { async: true })
});
