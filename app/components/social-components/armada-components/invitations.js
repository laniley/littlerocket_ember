/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({

  deleteInvitation(invitation) {
    FB.api(invitation.get('fb_request_id') + '_' + invitation.get('fb_id'), 'delete', response => {
      console.log(response);
      invitation.destroyRecord();
    });
  },

  actions: {
    close() {
      this.get('targetObject').set('showInvitations', false);
    },
    join(invitation) {
      this.get('me').get('user').then(user => {
        invitation.get('armada').then(armada => {
          this.deleteInvitation(invitation);
          this.store.query('armadaMembershipRequest', {
            armada_id: armada.get('id'),
            user_id: user.get('id')
          }).then(armadaMembershipRequests => {
            console.log('test', armadaMembershipRequests);
            armadaMembershipRequests.get('firstObject').destroyRecord();
          });
          user.set('armada', armada);
          user.set('armada_rank', 'Private');
          user.save();
        });
      });
    }
  }
});
