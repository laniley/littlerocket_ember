import Ember from 'ember';

export default Ember.Service.extend({

    store: Ember.inject.service('store'),
    me: Ember.inject.service('me'),

	game: null,

    isLoading: true,
	isPaused: true,
	showHud: false,

	width: 0, // current width of the canvas
	height: 0, // current height of the canvas

    currentScene: '',
	pressedKey: null,

    distance_to_goal: 0,
    collected_stars: 0,
    speed_percentage: 0,

    rocket: null,
	cannon: null,
	shield: null,
	engine: null,

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
