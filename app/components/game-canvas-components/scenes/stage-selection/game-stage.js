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

    reached_stage: Ember.computed('me.user.reached_level', function() {
        return DS.PromiseObject.create({
            promise: this.get('me').get('user').then(user => {
                return user.get('reached_level');
            })
        });
    }),

    is_locked: Ember.computed('reached_stage', 'stage', function() {
        return DS.PromiseObject.create({
            promise: this.get('reached_stage').then(reached_stage => {
                return reached_stage > this.get('stage');
            })
        });
    }),

    actions: {
        loadStage() {
            this.get('reached_stage').then(reached_stage => {
                if(reached_stage >= this.get('stage')) {
                    this.get('gameState').set('stage', this.get('stage'));
                    this.get('router').transitionTo('intern.stage');
                	// this.get('Q').clearStages();
                	// this.get('Q').stageScene("mainMenu");
                }
            });
        }
    }
});
