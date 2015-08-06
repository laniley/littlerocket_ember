import DS from 'ember-data';

export default DS.Model.extend({
  canonModelMm: DS.belongsTo('canon-model-mm', { async:true }),
  canonModelAmmoLevel: DS.belongsTo('canon-model-ammo-level', { async:true }),
  status: DS.attr('String', { defaultValue: 'locked' }),
  construction_start: DS.attr('number', { defaultValue: 0 })
});
