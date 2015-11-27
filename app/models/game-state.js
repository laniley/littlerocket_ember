import DS from 'ember-data';

export default DS.Model.extend({
  flown_distance: DS.attr('number', { defaultValue: 0 }),
  level: DS.attr('number', { defaultValue: 1 }),
  stars: DS.attr('number', { defaultValue: 0 }),
  speed: DS.attr('number', { defaultValue: 250 }),
  max_speed: DS.attr('number', { defaultValue: 500 }),
  speed_percentage: function() {
    return Math.floor(this.get('speed') * 100 / this.get('max_speed'));
  }.property('speed', 'max_speed')
});
