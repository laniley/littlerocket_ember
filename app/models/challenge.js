import DS from 'ember-data';

export default DS.Model.extend({
  fb_request_id: DS.attr('string'),
  from_player: DS.belongsTo('user', { async: true }),
  to_player: DS.belongsTo('user', { async: true }),
  from_player_score: DS.attr('number', { defaultValue: 0 }),
  to_player_score: DS.attr('number', { defaultValue: 0 }),
  from_player_has_played: DS.attr('boolean', { defaultValue: false }),
  to_player_has_played: DS.attr('boolean', { defaultValue: false }),
  hasBeenPlayedByMe: DS.attr('boolean', { defaultValue: false }),
  winner: DS.belongsTo('user'),
  created_at: DS.attr('date')
});
