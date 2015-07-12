import DS from 'ember-data';

export default DS.Model.extend({
  first_name: DS.attr('string'),
  last_name: DS.attr('string'),
  img_url: DS.attr('string'),
  isLoggedIn: DS.attr('boolean', { defaultValue: false })
});
