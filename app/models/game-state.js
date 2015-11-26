import DS from 'ember-data';

export default DS.Model.extend({
  flown_distance: DS.attr('number', { defaultValue: 0 }),
  level: DS.attr('number', { defaultValue: 1 })
});
