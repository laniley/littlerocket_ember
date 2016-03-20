import Ember from 'ember';
import DS from 'ember-data';
import Achievement from "./achievement";

export default Achievement.extend({
  reached_progress_points: Ember.computed('me.user.stars_all_time', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          var reached = this.get('needed_progress_points');
          if(user.get('stars_all_time') < this.get('needed_progress_points')) {
            reached = user.get('stars_all_time');
          }
          return reached;
        }
        else {
          return 0;
        }
      })
    });
  }),

  in_progress: Ember.computed('me.user.stars_all_time', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          if(user.get('stars_all_time') < this.get('needed_progress_points')) {
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
  })
});
