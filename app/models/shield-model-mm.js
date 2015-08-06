import DS from 'ember-data';

export default DS.Model.extend({
  shield: DS.belongsTo('shield', { async:true }),
  shieldModel: DS.belongsTo('shield-model', { async:true }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  shieldModelCapacityLevelMm: DS.belongsTo('shield-model-capacity-level-mm', { async: true }),
  shieldModelRechargeLevelMm: DS.belongsTo('shield-model-recharge-level-mm', { async: true })
});
