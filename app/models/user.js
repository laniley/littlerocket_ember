import Ember from 'ember';
import DS from 'ember-data';
import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo, hasMany } from 'ember-data/relationships';

export default Model.extend({
  fb_id: attr('string'),
  email: attr('string'),
  first_name: attr('string'),
  last_name: attr('string'),
  gender: attr('string'),

  rank_by_score: attr('number', { defaultValue: 0 }),
  rank_by_won_challenges: attr('number', { defaultValue: 0 }),
  rank_by_achievement_points: attr('number', { defaultValue: 0 }),
  score: attr('number', { defaultValue: 0 }),
  stars: attr('number', { defaultValue: 0 }),
  stars_all_time: attr('number', { defaultValue: 0 }),
  challenges_won: attr('number', { defaultValue: 0 }),
  reached_level: attr('number', { defaultValue: 1 }),
  flights: attr('number', { defaultValue: 0 }),
  experience: attr('number', { defaultValue: 0 }),
  achievement_points: attr('number', { defaultValue: 0 }),
  armada_rank: attr('string'),

  energy: belongsTo('user-energy'),
  lab: belongsTo('lab'),
  rocket: belongsTo('rocket'),
  armada: belongsTo('armada'),

  challenges: hasMany('challenge', { inverse: null }),
  achievements: hasMany('achievement'),

  user_quests: hasMany('user-quest'),
  unlocked_user_quest: Ember.computed('user_quests.@each.is_unlocked', function() {
    return DS.PromiseObject.create({
      promise: this.get('user_quests').then(user_quests => {
        return user_quests.filter(quest => {
          return quest.get('is_unlocked');
        });
      }),
    });
  }),

  messages_send: hasMany('message'),
  messages_received: hasMany('message'),
  fb_app_requests_send: hasMany('fb-app-request'),
  fb_app_requests_received: hasMany('fb-app-request'),

  messages_amount: Ember.computed('messages_received', 'fb_app_requests_received', function () {
    return this.get('messages_received.length') + this.get('fb_app_requests_received.length');
  }),

  name: Ember.computed('first_name', 'last_name', function () {
    var name = '';
    if (this.get('first_name')) {
      name += this.get('first_name');
    }

    if (this.get('last_name')) {
      name += ' ' + this.get('last_name');
    }

    return name;
  }),

  exp_level: Ember.computed('experience', function () {
    return Math.floor(Math.sqrt(this.get('experience') / 500)) + 1;
  }),

  needed_exp_for_current_level: Ember.computed('exp_level', function () {
    return 500 * Math.pow(this.get('exp_level') - 1, 2);
  }),

  needed_exp_for_next_level: Ember.computed('exp_level', function () {
    return 500 * Math.pow(this.get('exp_level'), 2);
  }),

  unplayedChallenges: Ember.computed('challenges.@each.from_player_score', 'challenges.@each.to_player_score', function () {
    return DS.PromiseObject.create({
      promise: this.get('challenges').then(challenges => {
        return challenges.filter(challenge => {
          return (challenge.get('from_player').get('id') === this.get('id') && challenge.get('from_player_score') === 0) ||
                 (challenge.get('to_player').get('id') === this.get('id') && challenge.get('to_player_score') === 0);
        });
      }),
    });
  }),

  img_url: Ember.computed('fb_id', function () {
    return `http://graph.facebook.com/${this.get('fb_id')}/picture`;
  }),
});
