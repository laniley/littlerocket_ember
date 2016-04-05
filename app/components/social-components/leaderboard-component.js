/* global FB */
import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  me: null,
  filterBy: 'all',
  sortBy: 'score',

  // sortProperties: ['achievement_points:desc'],
  sortedPlayers: Ember.computed.sort('players.content', 'sortProperties'),

  sortProperties: Ember.computed('sortBy', function() {
    var props = [];
    if(this.get('sortBy') === 'score') {
      props.push('rank_by_score');
      return props;
    }
    else {
      props.push('achievement_points:desc');
      return props;
    }
  }),

  players: Ember.computed('me.users_of_friends_playing.length', 'filterBy', 'sortBy', function() {
    if(this.get('filterBy') === 'friends') {
      return DS.PromiseObject.create({
        promise: this.get('me.users_of_friends_playing').then(friends => {
          return friends;
        })
      });
    }
    else {
      return DS.PromiseObject.create({
        promise: this.store.query('user', {
            'mode': 'leaderboard',
            'type': this.get('sortBy'),
          }).then(users => {
          return users;
        })
      });
    }
  }),

  actions: {
    invite() {
      FB.ui({
        method: 'apprequests',
        message: 'Come and play Little Rocket with me!',
        filters: ['app_non_users']
      }, function(response){
        console.log(response);
        //request
        //to[index]
      });
    }
  }
});
