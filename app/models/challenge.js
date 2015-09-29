import DS from 'ember-data';

export default DS.Model.extend({
  fb_request_id: DS.attr('string'),
  from_player: DS.belongsTo('user', { async: true }),
  to_player: DS.belongsTo('user', { async: true }),
  from_player_score: DS.attr('number', { defaultValue: 0 }),
  to_player_score: DS.attr('number', { defaultValue: 0 }),
  myScore: DS.attr('number', { defaultValue: 0 }),
  opponentScore: DS.attr('number', { defaultValue: 0 }),
  hasBeenPlayedByMe: DS.attr('boolean', { defaultValue: false }),
  hasBeenPlayedByOpponent: DS.attr('boolean', { defaultValue: false }),
  isActive: DS.attr('boolean', { defaultValue: false }),
  iAm: DS.attr('string'),
  winner: DS.belongsTo('user'),
  created_at: DS.attr('date'),

  from_player_has_played: function() {
    return this.get('from_player_score') > 0;
  }.property('from_player_score'),
  to_player_has_played: function() {
    return this.get('to_player_score') > 0;
  }.property('to_player_score'),
  action: function() {
    if(!this.get('isActive')) {
      return "playChallenge";
    }
    else {
      return "stopChallenge";
    }
  }.property('isActive')
});
