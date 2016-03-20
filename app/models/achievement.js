// import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  me: DS.belongsTo('me'),
  needed_progress_points: DS.attr('number', { defaultValue: 0 }),
  in_progress: DS.attr('boolean', { defaultValue: true }),
  achievement_points: DS.attr('number', { defaultValue: 0 })
});
