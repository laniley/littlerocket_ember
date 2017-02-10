import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
    classNames: ['stage'],
    classNameBindings: ['stageClass', 'is_end_boss_stage', 'is_locked'],

    Q: null,
    me: Ember.inject.service('me'),
    gameState: Ember.inject.service('game-state'),

    stage: 0,
    is_end_boss_stage: false,

    stageClass: Ember.computed('stage', function() {
        return "stage-" + this.get('stage');
    }),

    is_locked: Ember.computed('me.user.reached_stage', 'stage', function() {
        return this.get('me.user.reached_stage') < this.get('stage');
    }),

    click() {
        this.loadStage();
    },

    actions: {
        loadStage() {
            if(!this.get('is_locked')) {
                this.get('gameState').set('stage', this.get('stage'));
                this.get('router').transitionTo('intern.stage');
            }
        }
    }
});
