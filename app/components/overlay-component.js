import Ember from 'ember';
import DS from 'ember-data';

export default Ember.Component.extend({
  fb_app_requests: Ember.computed('me.user.fb_app_requests_received.length', function() {
    return DS.PromiseObject.create({
      promise:  this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          return user.get('fb_app_requests_received').then(fb_app_requests_received => {
            return fb_app_requests_received;
          });
        }
      })
    });
  }),
  messages: Ember.computed('me.user.messages_received.length', function() {
    return DS.PromiseObject.create({
      promise:  this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          return user.get('messages_received').then(messages_received => {
            return messages_received;
          });
        }
      })
    });
  }),
  actions: {
    close() {
      this.get('router').transitionTo('intern', { queryParams: { overlay_section: 'none' }});
    },
    sendEnergy(request) {
      request.get('from_user').then(from_user => {
        request.get('to_user').then(to_user => {
          var reception = this.store.createRecord('message', {
            from_user: to_user,
            to_user: from_user,
            type: 'energy-reception'
          });
          reception.save();
          request.delete();
        });
      });
    },
    receiveEnergy(request) {
      this.get('me').get('user').then(user => {
        user.get('energy').then(energy => {
          if(!energy.get('isFull')) {
            energy.set('current', energy.get('current') + 1);
            request.delete();
          }
        });
      });
    }
  }
});
