import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),
  type: DS.attr('string'),
  needed_progress_points: DS.attr('number', { defaultValue: 0 }),
  achievement_points: DS.attr('number', { defaultValue: 0 }),
  unlocked: DS.attr('boolean', { defaultValue: false }),

  me: Ember.computed(function() {
    return this.store.peekRecord('me', 1);
  }),

  reached_progress_points: Ember.computed('user.flights', 'user.stars_all_time', 'me.friends_playing.length', function() {
    return DS.PromiseObject.create({
      promise: this.get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          var reached = this.get('needed_progress_points');
          if(this.get('type') === 'flight-achievement' && user.get('flights') < this.get('needed_progress_points')) {
            reached = user.get('flights');
          }
          else if(this.get('type') === 'stars-all-time-achievement' && user.get('stars_all_time') < this.get('needed_progress_points')) {
            reached = user.get('stars_all_time');
          }
          else if(this.get('type') === 'friends-achievement' && this.get('me').get('friends_playing.length') < this.get('needed_progress_points')) {
            reached = this.get('me').get('friends_playing.length');
          }
          return reached;
        }
        else {
          return 0;
        }
      })
    });
  }),

  in_progress: Ember.computed('user.flights', 'user.stars_all_time', 'me.friends_playing.length', function() {
    return DS.PromiseObject.create({
      promise: this.get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          if(this.get('type') === 'flight-achievement' && user.get('flights') < this.get('needed_progress_points')) {
            return true;
          }
          else if(this.get('type') === 'stars-all-time-achievement' && user.get('stars_all_time') < this.get('needed_progress_points')) {
            return true;
          }
          else if(this.get('type') === 'friends-achievement' && this.get('me').get('friends_playing.length') < this.get('needed_progress_points')) {
            return true;
          }
          else {
            return false;
          }
        }
        else {
          return false;
        }
      })
    });
  }),

  update_unlocked: Ember.observer('user.flights', 'user.stars_all_time', 'me.friends_playing.length', function() {
    return DS.PromiseObject.create({
      promise: this.get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          var unlocked_old = this.get('unlocked');
          if(this.get('type') === 'flight-achievement' && user.get('flights') >= this.get('needed_progress_points')) {
            this.set('unlocked', true);
            if(!unlocked_old) {
              this.save();
            }
          }
          else if(this.get('type') === 'stars-all-time-achievement' && user.get('stars_all_time') >= this.get('needed_progress_points')) {
            this.set('unlocked', true);
            if(!unlocked_old) {
              this.save();
            }
          }
          else if(this.get('type') === 'friends-achievement' && this.get('me').get('friends_playing.length') >= this.get('needed_progress_points')) {
            this.set('unlocked', true);
            if(!unlocked_old) {
              this.save();
            }
          }
        }
      })
    });
  }).on('init')
});
