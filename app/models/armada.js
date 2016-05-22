import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  users: DS.hasMany('user', { async: true}),
  armadaMembershipRequests: DS.hasMany('armada-membership-requests'),

  admirals: Ember.computed('users.@each.armada_rank', function() {
    return this.get('users').filter(user => {
      return user.get('armada_rank') === 'Admiral';
    });
  })
});
