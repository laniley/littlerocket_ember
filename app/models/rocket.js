import DS from 'ember-data';

export default DS.Model.extend({
  speed: DS.attr('number', { defaultValue: 50 }),
  distanceToGoal: DS.attr('number', { defaultValue: 50 }),
  distance: DS.attr('numer', { defaultValue: 0 }),
  hasACanon: DS.attr('boolean', { defaultValue: false }),
  user: DS.belongsTo('user', { async: true })
});
