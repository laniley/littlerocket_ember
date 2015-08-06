import DS from 'ember-data';

export default DS.Model.extend({
  shieldModelMm: DS.belongsTo('shield-model-mm', { async:true }),
  shieldModelRechargeLevel: DS.belongsTo('shield-model-recharge-level', { async:true }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  construction_start: DS.attr('number', { defaultValue: 0 })
});
