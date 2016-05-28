import DS from 'ember-data';
import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['armada'],
  armadaSection: 'main',
  armadaMainSection: 'home',
  showInvitations: false,
  showJoinableArmadas: false,
  showCreateDialog: false,

  invitations: Ember.computed('me.user.fb_app_requests', function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        return this.store.query('fb-app-request', {
            'fb_id': user.get('fb_id'),
            'type': 'armada-invitation',
          }).then(invitations => {
            return Ember.RSVP.filter(invitations.toArray(), invitation => {
              return invitation.get('armada').then(armada => {
                return armada.get('users.length') < 20;
              });
            });
        });
      })
    });
  }),

  actions: {

    showInvitations() {
      this.set('showInvitations', true);
    },

    showJoinableArmadas() {
      this.set('showJoinableArmadas', true);
    },

    showCreateDialog() {
      this.set('showCreateDialog', true);
    }

  }
});
