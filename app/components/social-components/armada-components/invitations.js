import DS from 'ember-data';
import Ember from 'ember';

export default Ember.Component.extend({
  invitations: Ember.computed('', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        return this.store.query('fb-app-request', {
            'fb_id': user.get('fb_id'),
            'type': 'armada-invitation',
          }).then(invitations => {
          return invitations;
        });
      })
    });
  }),
  actions: {
    close() {
      this.get('targetObject').set('showInvitations', false);
    },
  }
});
