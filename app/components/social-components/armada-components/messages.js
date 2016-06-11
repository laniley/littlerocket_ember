import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    acceptRequest(request) {
      request.get('user').then(user => {
        request.get('armada').then(armada => {
          user.set('armada', armada);
          user.set('armada_rank', 'Private');
          user.save();
          this.store.query('armadaMembershipRequest', {
            user_id: user.get('id')
          }).then(requests => {
            requests.forEach(request => {
              request.destroyRecord();
            });
          });
        });
      });
    }
  }
});
