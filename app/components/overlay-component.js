import Ember from 'ember';

export default Ember.Component.extend({
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
