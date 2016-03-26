import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({

  me: null,

  achievements: Ember.computed('me.user.achievements.@each', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          return user.get('achievements').then(achievements => {
            return achievements;
          });
        }
      })
    });
    }
  ),

  flight_achievements: Ember.computed('achievements.@each', function() {
    return DS.PromiseObject.create({
      promise: this.get('achievements').then(achievements => {
        if(!Ember.isEmpty(achievements)) {
          return Ember.RSVP.filter(achievements.toArray(), achievement => {
            return achievement.get('type') === 'flight-achievement';
          });
        }
      })
    });
  }),

  stars_all_time_achievements: Ember.computed('achievements.@each', function() {
    return DS.PromiseObject.create({
      promise: this.get('achievements').then(achievements => {
        if(!Ember.isEmpty(achievements)) {
          return Ember.RSVP.filter(achievements.toArray(), achievement => {
            return achievement.get('type') === 'stars-all-time-achievement';
          });
        }
      })
    });
  }),

  friends_achievements: Ember.computed('achievements.@each', function() {
    return DS.PromiseObject.create({
      promise: this.get('achievements').then(achievements => {
        if(!Ember.isEmpty(achievements)) {
          return Ember.RSVP.filter(achievements.toArray(), achievement => {
            return achievement.get('type') === 'friends-achievement';
          });
        }
      })
    });
  }),

  reached_achievements: Ember.computed('achievements.@each.in_progress', function() {
    return DS.PromiseObject.create({
      promise: this.get('achievements').then(achievements => {
        if(!Ember.isEmpty(achievements)) {
          return Ember.RSVP.filter(achievements.toArray(), achievement => {
            return achievement.get('in_progress').then(in_progress => {
              return !in_progress;
            });
          });
        }
      })
    });
  }),

  achievementPoints: Ember.computed('reached_achievements.@each', function() {
    return DS.PromiseObject.create({
      promise: this.get('reached_achievements').then(reached_achievements => {
        if(!Ember.isEmpty(reached_achievements)) {
          return reached_achievements.reduce(function(previousValue, achievement) {
            return previousValue += achievement.get('achievement_points');
          }, 0);
        }
      })
    });
  }),

  achievementPointsTotal: Ember.computed('achievements.@each', function() {
    return DS.PromiseObject.create({
      promise: this.get('achievements').then(achievements => {
        if(!Ember.isEmpty(achievements)) {
          return achievements.reduce(function(previousValue, achievement) {
            return previousValue += achievement.get('achievement_points');
          }, 0);
        }
      })
    });
  })
});
