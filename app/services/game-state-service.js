import Ember from 'ember';

export default Ember.Service.extend({

    store: Ember.inject.service('store'),
    me: Ember.inject.service('me'),

	game: null,

    isLoading: true,
	isPaused: true,
	showHud: false,
	showMenu: false,

	initWidth: 0, // initial width of the canvas
	initHeight: 0, // initial width of the canvas
	width: 0, // current width of the canvas
	height: 0, // current height of the canvas

    currentScene: '',

	speed: 100,
	max_speed: 300,

    distance_to_goal: 50,
    collected_stars: 0,
    speed_percentage: 0,

    rocket: null,
	cannon: null,
	shield: null,
	engine: null,

	isPausedObserver: Ember.observer('isPaused', function() {
		console.log('Game is ' + (this.get('isPaused') ? 'paused.' : 'running.' ));
	}),

    resetRocketComponents: function() {
        this.resetRocketComponent('cannon');
        this.resetRocketComponent('shield');
        this.resetRocketComponent('engine');
    },

    resetRocketComponent: function(componentType) {
		this.get('me.user').then(user => {
			user.get('rocket').then(rocket => {
	            if(!Ember.isEmpty(rocket)) {
	                rocket.get(componentType).then(component => {
	                    if(component.get('status') === "unlocked") {
	                        component.get('selectedRocketComponentModelMm').then(selectedRocketComponentModelMm => {
	                            component.set('currentValue', selectedRocketComponentModelMm.get('capacity'));
	                            component.set('isReloading', false);
	                        });
	                    }
	                    else {
	                        component.set('currentValue', 0);
	                        component.set('isReloading', false);
	                    }
	                });
	            }
	        });
		});
    },

});
