import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  me: null,

  achievementPoints: Ember.computed('reached_achievements.@each', function() {
    return DS.PromiseObject.create({
      promise: this.get('reached_achievements').then(reached_achievements => {
        return reached_achievements.reduce(function(previousValue, achievement) {
          return previousValue += achievement.get('achievement_points');
        }, 0);
      })
    });
  }),

  reached_achievements: Ember.computed('me.achievements.@each.in_progress', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('achievements').then(achievements => {
        return Ember.RSVP.filter(achievements.toArray(), achievement => {
          return achievement.get('in_progress').then(in_progress => {
            return !in_progress;
          });
        });
      })
    });
  })
});
