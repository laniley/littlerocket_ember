import DS from 'ember-data';

export default DS.Model.extend({
  hasACanon: DS.attr('boolean', { defaultValue: false }),
  user: DS.belongsTo('user', { async: true })
});
