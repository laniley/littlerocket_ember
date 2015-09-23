import DS from 'ember-data';

export default DS.Model.extend({
  me: DS.belongsTo('me'),
  user: DS.belongsTo('user'),
  long_fb_id: DS.attr('string'),
  name: DS.attr('string'),
  img_url: DS.attr('string'),
  isAlreadyPlaying: DS.attr('boolean')
});
