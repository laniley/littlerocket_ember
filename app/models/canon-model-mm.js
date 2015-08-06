import DS from 'ember-data';

export default DS.Model.extend({
  canon: DS.belongsTo('canon', { async:true }),
  canonModel: DS.belongsTo('canon-model', { async:true }),
  construction_start: DS.attr('number', { defaultValue: 0 }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  canonModelAmmoLevelMm: DS.belongsTo('canon-model-ammo-level-mm', { async: true }),
  canonModelBpsLevelMm: DS.belongsTo('canon-model-bps-level-mm', { async: true })
});
