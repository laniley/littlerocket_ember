import DS from 'ember-data';

export default DS.Model.extend({
  flown_distance: DS.attr('number', { defaultValue: 0 }),
  level: DS.attr('number', { defaultValue: 1 }),
  new_stage_reached: DS.attr('boolean', { defaultValue: false }),
  stars: DS.attr('number', { defaultValue: 0 }),
  speed: DS.attr('number', { defaultValue: 300 }),
  max_speed: DS.attr('number', { defaultValue: 500 }),
  distance_to_goal: DS.attr('number', { defaultValue: 50 }),
  reached_end: DS.attr('boolean', { defaultValue: false }),
  mode: DS.attr('string', { defaultValue: 'adventure' }),
  speed_percentage: function() {
    return Math.floor(this.get('speed') * 100 / this.get('max_speed'));
  }.property('speed', 'max_speed')
});
