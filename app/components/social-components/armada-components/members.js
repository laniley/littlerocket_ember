/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({

  userInEditMode: null,

  exclude_ids: Ember.computed('me.user.armada.users.length', function() {
    return this.get('me').get('user').then(user => {
      return user.get('armada').then(armada => {
        return armada.get('users').then(members => {
          var exclude_ids = [];
          members.forEach(member => {
            exclude_ids.push(member.get('fb_id'));
          });
          return exclude_ids;
        });
      });
    });
  }),

  actions: {
    edit(user) {
      this.set('userInEditMode', user);
    },
    save(user) {
      user.set('armada_rank', Ember.$('#armada_rank').val());
      user.save().then(() => {
        this.set('userInEditMode', null);
      });
    },
    recruit(armada) {
      this.get('exclude_ids').then(exclude_ids => {
        this.store.query('fb-app-request', {
          armada_id: armada.get('id')
        }).then(requests => {
          requests.forEach(request => {
            exclude_ids.push(request.get('fb_id'));
          });
          FB.ui({
            method: 'apprequests',
            message: 'Come and join my Armada! Help me fight my enemies!',
            exclude_ids: exclude_ids
          }, response => {
            console.log(response);
            response.to.forEach(fb_id => {
              var request = this.store.createRecord('fb-app-request', {
                fb_request_id: response.request,
                type: 'armada-invitation',
                armada: armada,
                fb_id: fb_id
              });
              request.save();
            });
          });
        });
      });
    }
  }
});
