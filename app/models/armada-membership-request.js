import DS from 'ember-data';

export default DS.Model.extend({
  armada: DS.belongsTo('armada'),
  user: DS.belongsTo('user'),
  created_at: DS.attr('date')
});
