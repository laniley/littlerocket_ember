/* global FB */
import Ember from 'ember';

export default Ember.Component.extend({
  actions: {
    buy() {
      this.get('me').get('user').then(user => {
        if(!Ember.isEmpty(user)) {
          user.get('energy').then(energy => {
            energy.buy().then(response => {
              console.log(response);
              user.set('stars', response.user.stars);
              energy.set('current', response.userEnergy.current);
            });
          });
        }
      });
    },
    ask() {
      FB.ui({
        method: 'apprequests',
        message: 'S.O.S. !!! I\'m out of energy! Please, help me and send me some!'
      }, response => {
        console.log(response);
        this.get('me').get('user').then(user => {
          response.to.forEach(fb_id => {
            var request = this.store.createRecord('fb-app-request', {
              fb_request_id: response.request,
              type: 'energy-request',
              from_user: user,
              fb_id: fb_id
            });
            request.save();
          });
        });
      });
    }
  }
});
