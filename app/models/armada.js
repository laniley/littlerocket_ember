import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  users: DS.hasMany('user', { async: true}),
  armadaMembershipRequests: DS.hasMany('armada-membership-requests'),
  fbAppRequest: DS.belongsTo('fb-app-request'),

  admirals: Ember.computed('users.@each.armada_rank', function() {
    return this.get('users').filter(user => {
      return user.get('armada_rank') === 'Admiral';
    });
  }),

  score: Ember.computed('users.@each.score', 'users.@each.experience', function() {
    return DS.PromiseObject.create({
      promise: this.get('users').then(users => {
        var score = 0;
        users.forEach(user => {
          score += (user.get('score') + user.get('experience'));
        });
        return score;
      })
    });
  })
});
