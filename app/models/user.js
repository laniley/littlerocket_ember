import DS from 'ember-data';

export default DS.Model.extend({
  fb_id: DS.attr('string'),
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  img_url: DS.attr('string'),
  score: DS.attr('number', { defaultValue: 0 }),
  max_level: DS.attr('number', { defaultValue: 1 })
});
