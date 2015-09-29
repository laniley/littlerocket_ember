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
                    if(challenge.get('from_player_has_played') > 0) {
                      challenge.set('hasBeenPlayedByMe', true);
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
                    if(challenge.get('to_player_has_played') > 0) {
                      challenge.set('hasBeenPlayedByMe', true);
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

  unplayedChallenges: function() {
    return DS.PromiseObject.create({
      promise: this.get('challenges').then(challenges => {
        return challenges.filterBy('hasBeenPlayedByMe', false);
      })
    });
  }.property('challenges.@each.hasBeenPlayedByMe'),

  waitingChallenges: function() {
    return DS.PromiseObject.create({
      promise: this.get('challenges').then(challenges => {
        return challenges.filterBy('hasBeenPlayedByMe', true);
      })
    });
  }.property('challenges.@each.hasBeenPlayedByMe'),

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
      this.get('me').set('activeChallenge', challenge);
    },

    stopChallenge: function() {
      this.get('me').set('activeChallenge', null);
    }
  }
});
