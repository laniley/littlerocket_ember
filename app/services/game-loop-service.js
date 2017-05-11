import Ember from 'ember';

export default Ember.Service.extend({

	gameState: Ember.inject.service('game-state-service'),
	gameRenderer: Ember.inject.service('game-render-service'),

	animationFrame: null,
	lastGameLoopFrame: null,
	loopFrame: 0,
	loopDT: 0, // time delta since last iteration of the game loop
	frameTimeLimit: 100,

	/**
		The callback will be called with the fraction of a second that has elapsed since the last call to the loop method.
	*/
	gameIsPausedObserver: Ember.observer('gameState.isPaused', function() {
		/**
			Pause the entire game by canceling the requestAnimationFrame call. If you use setTimeout or
			setInterval in your game, those will, of course, keep on rolling...
		*/
		if(this.get('gameState.isPaused')) {

			window.cancelAnimationFrame(this.get('animationFrame'));

			this.set('animationFrame', null);
		}
		/*
			Unpause the game by starting a requestAnimationFrame-based loop.
		*/
		else {

			this.set('lastGameLoopFrame', new Date().getTime());

			// Short circuit the loop check in case multiple scenes are staged immediately
			this.set('animationFrame', true);

			// Keep track of the frame we are on (so that animations can be synced to the next frame)
			this.set('loopFrame', 0);

			window.requestAnimationFrame(animationFrame => {
				this.set('animationFrame', animationFrame);
				this.loop();
			});
		}
	}).on('init'),

	loop() {

		var now = new Date().getTime();

		this.set('loopFrame', this.get('loopFrame') + 1);

		var dt = now - this.get('lastGameLoopFrame');
		/* Prevent fast-forwarding by limiting the length of a single frame. */
		if(dt > this.get('frameTimeLimit')) {
			dt =  this.get('frameTimeLimit');
		}

	    if(dt < 0) {
			dt = 1.0/60;
		}
	    if(dt > 1/15) {
			dt  = 1.0/15;
		}

		this.set('loopDT', dt);

		this.get('gameRenderer').step(this.get('loopDT'));
		this.get('gameRenderer').clear();
		this.get('gameRenderer').render();

		this.set('lastGameLoopFrame', now);

		if(!this.get('gameState.isPaused')) {
			window.requestAnimationFrame(() => {
				this.loop();
			});
		}
	},

});
