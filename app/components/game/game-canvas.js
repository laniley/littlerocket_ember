import Ember from 'ember';

export default Ember.Component.extend({

    gameState: Ember.inject.service('game-state'),

    elementId: 'game',
    tagName: 'canvas',
    attributeBindings: ['width','height'],

    didInsertElement() {
        var ctx = this.get('element').getContext('2d');
        this.get('gameState').set('context', ctx);

        ctx.canvas.width  = Ember.$('#game-canvas-container').innerWidth();
        ctx.canvas.height = Ember.$('#game-canvas-container').innerHeight();

        // ctx.fillStyle = "#000";
        // ctx.fillRect(0, 0, 100, 100);
    },
});
