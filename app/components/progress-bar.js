import Ember from 'ember';

export default Ember.Component.extend({

  achievement: null,

  set_progress: function() {
    var achievement = this.get('achievement');
    if(!Ember.isEmpty(achievement)) {
      achievement.get('reached_progress_points').then(reached_progress_points => {
        var percentage = reached_progress_points / achievement.get('needed_progress_points') * 100;
        Ember.$('#' + this.get('elementId') + "-progress").width((percentage) + '%');
      });
    }
  }.observes('achievement.reached_progress_points.content', 'achievement.needed_progress_points.content').on('init')
});
