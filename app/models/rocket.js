import DS from 'ember-data';

export default DS.Model.extend({
  hasAShield: DS.attr('boolean', { defaultValue: false }),
  hasASpecialEngine: DS.attr('boolean', { defaultValue: false }),
  user: DS.belongsTo('user', { async: true }),
  canon: DS.belongsTo('rocket-component', { async: true }),
  shield: DS.belongsTo('rocket-component', { async: true }),
  engine: DS.belongsTo('rocket-component', { async: true })
});
