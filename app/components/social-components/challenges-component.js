/* global FB */
import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  me: null,
  currentSection: 'unplayed',
  search_term: '',

  friends_matching_search: function() {
    return this.get('me').get('friends').filter(friend => {
      return friend.get('name').toLowerCase().indexOf(this.get('search_term').toLowerCase()) !== -1;
    });
  }.property('search_term', 'me.friends.[]'),

  challenges: function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          return user.get('challenges').then(challenges => {
            return Ember.RSVP.map(challenges.toArray(), challenge => {
                return challenge.get('from_player').then(from_player => {
                  if(Ember.isEqual(user, from_player)) {
                    challenge.set('iAm', 'from_player');
                    if(challenge.get('from_player_has_played')) {
                      challenge.set('hasBeenPlayedByMe', true);
                      challenge.set('myScore', challenge.get('from_player_score'));
                    }
                    if(challenge.get('to_player_has_played')) {
                      challenge.set('hasBeenPlayedByOpponent', true);
                      challenge.set('opponentScore', challenge.get('to_player_score'));
                    }
                    if(Ember.isEqual(challenge, this.get('me').get('activeChallenge'))) {
                      challenge.set('isActive', true);
                    }
                    else {
                      challenge.set('isActive', false);
                    }
                    return challenge;
                  }
                  else {
                    challenge.set('iAm', 'to_player');
                    if(challenge.get('from_player_has_played') > 0) {
                      challenge.set('hasBeenPlayedByOpponent', true);
                      challenge.set('opponentScore', challenge.get('from_player_score'));
                    }
                    if(challenge.get('to_player_has_played') > 0) {
                      challenge.set('hasBeenPlayedByMe', true);
                      challenge.set('myScore', challenge.get('to_player_score'));
                    }
                    if(Ember.isEqual(challenge, this.get('me').get('activeChallenge'))) {
                      challenge.set('isActive', true);
                    }
                    else {
                      challenge.set('isActive', false);
                    }
                    return challenge;
                  }
                });
            });
          });
        }
        else {
          return [];
        }
      })
    });
  }.property('me.user.challenges.[]', 'me.activeChallenge'),

  waitingChallenges: function() {
    return DS.PromiseObject.create({
      promise: this.get('challenges').then(challenges => {
        return challenges.filter(challenge => {
          return challenge.get('hasBeenPlayedByMe') === true && challenge.get('hasBeenPlayedByOpponent') === false;
        });
      })
    });
  }.property('challenges.@each.hasBeenPlayedByMe', 'challenges.@each.hasBeenPlayedByOpponent'),

  wonChallenges: function() {
    return DS.PromiseObject.create({
      promise: this.get('challenges').then(challenges => {
        return challenges.filter(challenge => {
          return challenge.get('hasBeenPlayedByMe') === true && challenge.get('hasBeenPlayedByOpponent') === true &&
                 challenge.get('myScore') > challenge.get('opponentScore');
        });
      })
    });
  }.property('challenges.@each.hasBeenPlayedByMe', 'challenges.@each.hasBeenPlayedByOpponent', 'challenges.@each.myScore', 'challenges.@each.opponentScore'),

  lostChallenges: function() {
    return DS.PromiseObject.create({
      promise: this.get('challenges').then(challenges => {
        return challenges.filter(challenge => {
          return challenge.get('hasBeenPlayedByMe') === true && challenge.get('hasBeenPlayedByOpponent') === true &&
                 challenge.get('myScore') < challenge.get('opponentScore');
        });
      })
    });
  }.property('challenges.@each.hasBeenPlayedByMe', 'challenges.@each.hasBeenPlayedByOpponent', 'challenges.@each.myScore', 'challenges.@each.opponentScore'),

  stopChallenge: function() {
    if(!Ember.isEmpty(this.get('me').get('activeChallenge'))) {
      this.get('me').get('activeChallenge').set('isActive', false);
      this.get('me').set('activeChallenge', null);
    }
  },

  actions: {
    sendChallengeRequest: function(friend) {
      FB.ui({method: 'apprequests',
        message: 'I want to challenge you in Little Rocket! Can you beat me?',
        to: friend.get('long_fb_id')
      }, response => {
          this.get('targetObject.store').query('user', { 'fb_id': response.to[0] }).then(users => {
            if(Ember.isEmpty(users)) {
              var new_user = this.get('targetObject.store').createRecord('user', {
                fb_id: response.to[0],
                first_name: friend.get('name'),
                img_url: friend.get('img_url')
              });
              new_user.save().then(user => {
                var challenge = this.get('targetObject.store').createRecord('challenge', {
                  fb_request_id: response.request,
                  from_player: this.get('me').get('user'),
                  to_player: user
                });
                challenge.save();
              });
            }
            else {
              var challenge = this.get('targetObject.store').createRecord('challenge', {
                fb_request_id: response.request,
                from_player: this.get('me').get('user'),
                to_player: users.get('firstObject')
              });
              challenge.save();
            }
          });
      });
    },

    playChallenge: function(challenge) {
      this.stopChallenge();
      challenge.set('isActive', true);
      this.get('me').set('activeChallenge', challenge);
    },

    stopChallenge: function() {
      this.stopChallenge();
    }
  }
});
