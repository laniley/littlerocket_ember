import DS from 'ember-data';

export default DS.Model.extend({
  fb_request_id: DS.attr('string'),
  from_player: DS.belongsTo('user'),
  to_player: DS.belongsTo('user'),
  from_player_score: DS.attr('number'),
  to_player_score: DS.attr('number'),
  winner: DS.belongsTo('user'),
  status: DS.attr('string'),
  created_at: DS.attr('date')
});
