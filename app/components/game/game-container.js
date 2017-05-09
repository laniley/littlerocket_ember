import Ember from 'ember';
import ResizeAware from 'ember-resize/mixins/resize-aware';

export default Ember.Component.extend(ResizeAware, {

    gameState: Ember.inject.service('game-state-service'),

    classNames: ['game-container'],
    resizeWidthSensitive: true,
    resizeHeightSensitive: true,

    debouncedDidResize(width, height/*, evt*/) {
        console.log(`Game-Container resized! ${width}x${height}`);
        var game = document.getElementById('game');
        if(game) {
            var ctx = document.getElementById('game').getContext('2d');
            ctx.canvas.width  = width;
            ctx.canvas.height = height;
			this.get('gameState').set('width', width);
			this.get('gameState').set('height', height);
            this.get('gameState').get('game').rerender();
        }
    },
});
