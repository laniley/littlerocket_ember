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

  name: function() {
    return this.get('first_name') + ' ' + this.get('last_name');
  }.property('first_name', 'last_name')
});
