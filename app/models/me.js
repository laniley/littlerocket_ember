import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user', { async: true }),
  friends: DS.hasMany('friend'),
  isLoggedIn: DS.attr('boolean', { defaultValue: false }),
  activeChallenge: DS.belongsTo('challenge')
});
