import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  email: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  img_url: DS.attr('string'),
  gender: DS.attr('string'),

  rank: DS.attr('number'),
  score: DS.attr('number', { defaultValue: 0 }),
  stars: DS.attr('number', { defaultValue: 0 }),
  reached_level: DS.attr('number', { defaultValue: 1 }),
  experience: DS.attr('number', { defaultValue: 0 }),

  lab: DS.belongsTo('lab', { async: true}),
  rocket: DS.belongsTo('rocket', { async: true }),
  challenges: DS.hasMany('challenge', { async: true, inverse: null }),

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
  }.property('exp_level')
});
