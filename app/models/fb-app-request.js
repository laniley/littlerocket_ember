import DS from 'ember-data';

export default DS.Model.extend({
  fb_request_id: DS.attr('string'),
  type: DS.attr('string'),
  fb_id: DS.attr('string'),
  armada: DS.belongsTo('armada'),
  created_at: DS.attr('date')
});
