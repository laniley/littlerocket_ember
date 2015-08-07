import DS from 'ember-data';

export default DS.Model.extend({
  hasAShield: DS.attr('boolean', { defaultValue: false }),
  hasASpecialEngine: DS.attr('boolean', { defaultValue: false }),
  user: DS.belongsTo('user', { async: true }),
  canon: DS.belongsTo('canon', { async: true }),
  shield: DS.belongsTo('shield', { async: true }),
  engine: DS.belongsTo('engine', { async: true })
});
