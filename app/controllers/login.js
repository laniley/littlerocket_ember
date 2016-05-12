import Ember from 'ember';

export default Ember.Controller.extend({
  session: Ember.inject.service('session'),
  actions: {
    login() {
      this.get('session').authenticate('authenticator:facebook').catch((reason) => {
        this.set('errorMessage', reason.error || reason);
      });
    }
  }
});
