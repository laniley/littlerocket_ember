/* global FB */
import DS from 'ember-data';
import Ember from 'ember';

export default Ember.Component.extend({
  armadas: Ember.computed(function() {
    return DS.PromiseObject.create({
      promise: this.get('me').get('user').then(user => {
        return this.store.query('armada', {
          'mode': 'suggestions'
        }).then(armadas => {
          armadas.forEach(armada => {
            this.store.query('armadaMembershipRequest', {
              armada_id: armada.get('id'),
              user_id: user.get('id')
            });
            this.store.query('fbAppRequest', {
              armada_id: armada.get('id'),
              fb_id: user.get('fb_id')
            });
          });
          return armadas;
        });
      })
    });
  }),

  deleteFBAppRequest(fbAppRequest) {
    FB.api(fbAppRequest.get('fb_request_id') + '_' + fbAppRequest.get('fb_id'), 'delete', response => {
      console.log(response);
      fbAppRequest.get('content').destroyRecord();
    });
  },

  actions: {
    close() {
      this.get('targetObject').set('showJoinableArmadas', false);
    },
    join(fbAppRequest) {
      this.get('me').get('user').then(user => {
        fbAppRequest.get('armada').then(armada => {
          this.deleteFBAppRequest(fbAppRequest);
          this.store.query('armadaMembershipRequest', {
            armada_id: armada.get('id'),
            user_id: user.get('id')
          }).then(armadaMembershipRequests => {
            armadaMembershipRequests.get('firstObect').destroyRecord();
          });
          user.set('armada', armada);
          user.set('armada_rank', 'Private');
          user.save();
        });
      });
    },
    sendRequest(armada) {
      this.get('me').get('user').then(user => {
        this.store.queryRecord('armada-membership-request', {
          user_id: user.get('id'),
          armada_id: armada.get('id')
        }).then(request => {
          if(Ember.isEmpty(request)) {
            request = this.store.createRecord('armada-membership-request', {
              'armada': armada,
              'user': user
            });
            request.save();
          }
        });
      });
    },
    showCreateDialog() {
      this.get('targetObject').set('showJoinableArmadas', false);
      this.get('targetObject').set('showCreateDialog', true);
    }
  }
});
