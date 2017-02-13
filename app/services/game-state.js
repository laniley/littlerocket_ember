import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Service.extend({

    store: Ember.inject.service('store'),
    me: Ember.inject.service('me'),

    isLoading: true,

    currentScene: '',

    distance_to_goal: 0,
    collected_stars: 0,
    speed_percentage: 0,

    rocket: Ember.computed('me.user.rocket', function() {
        return DS.PromiseObject.create({
            promise: this.get('me.user').then(user => {
                return user.get('rocket').then(rocket => {
                    return rocket;
                });
            })
        });
    }),

    resetRocketComponents: function() {
        this.resetRocketComponent('cannon');
        this.resetRocketComponent('shield');
        this.resetRocketComponent('engine');
    },

    resetRocketComponent: function(componentType) {
        this.get('rocket').then(rocket => {
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
    },

});
