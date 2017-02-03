import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Service.extend({
    store: Ember.inject.service('store'),
    session: Ember.inject.service('session'),

    user: Ember.computed('session.data.user_id', function() {
        var user_id = this.get('session.data.user_id');
        if(!Ember.isEmpty(user_id)) {
            return DS.PromiseObject.create({
              promise: this.get('store').findRecord('user', user_id)
            });
        }
    })
});
