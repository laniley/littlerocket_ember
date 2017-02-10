import Ember from 'ember';

export default Ember.Route.extend({

    me: Ember.inject.service('me'),

    beforeModel() {
        this.get('me.user').then(user => {
            if( user.get('planets.length') <= 0 ) {
                this.transitionTo('intern.stage.menu');
            }
        });
    }
});
