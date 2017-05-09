import Ember from 'ember';

export default Ember.Component.extend({

    gameState: Ember.inject.service('game-state-service'),

    classNames: ['hud']
});
