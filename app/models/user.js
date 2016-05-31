import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  email: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  img_url: DS.attr('string'),
  gender: DS.attr('string'),

  rank_by_score: DS.attr('number', { defaultValue: 0 }),
  rank_by_won_challenges: DS.attr('number', { defaultValue: 0 }),
  rank_by_achievement_points: DS.attr('number', { defaultValue: 0 }),
  energy: DS.attr('number', { defaultValue: 10}),
  score: DS.attr('number', { defaultValue: 0 }),
  stars: DS.attr('number', { defaultValue: 0 }),
  stars_all_time: DS.attr('number', { defaultValue: 0 }),
  challenges_won: DS.attr('number', { defaultValue: 0 }),
  reached_level: DS.attr('number', { defaultValue: 1 }),
  flights: DS.attr('number', { defaultValue: 0 }),
  experience: DS.attr('number', { defaultValue: 0 }),
  achievement_points: DS.attr('number', { defaultValue: 0}),
  armada_rank: DS.attr('string'),

  lab: DS.belongsTo('lab', { async: true}),
  rocket: DS.belongsTo('rocket', { async: true }),
  challenges: DS.hasMany('challenge', { async: true, inverse: null }),
  achievements: DS.hasMany('achievement'),
  armada: DS.belongsTo('armada', { async: true }),
  fb_app_requests: DS.hasMany('fb-app-request', { async: true}),

  name: function() {
    var name = '';
    if(this.get('first_name')) {
      name += this.get('first_name');
    }
    if(this.get('last_name')) {
      name += ' ' + this.get('last_name');
    }
    return name;
  }.property('first_name', 'last_name'),

  exp_level: function() {
    return Math.floor(Math.sqrt(this.get('experience')/500)) + 1;
  }.property('experience'),

  needed_exp_for_next_level: function() {
    return 500 * Math.pow(this.get('exp_level'), 2);
  }.property('exp_level'),

  unplayedChallenges: function() {
    return DS.PromiseObject.create({
      promise: this.get('challenges').then(challenges => {
        return challenges.filter(challenge => {
          return (challenge.get('from_player').get('id') === this.get('id') && challenge.get('from_player_score') === 0) ||
                 (challenge.get('to_player').get('id') === this.get('id') && challenge.get('to_player_score') === 0);
        });
      })
    });
  }.property('challenges.@each.from_player_score', 'challenges.@each.to_player_score'),
});
