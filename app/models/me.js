import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  isLoggedIn: DS.attr('boolean', { defaultValue: false })
});
