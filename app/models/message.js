import DS from 'ember-data';

export default DS.Model.extend({
  from_user: DS.belongsTo('user', { inverse: 'messages_send' }),
  to_user: DS.belongsTo('user', { inverse: 'messages_received' }),
  type: DS.attr('string'),

  delete() {
    this.destroyRecord();
  }
});
