import Ember from 'ember';
import FacebookLoginMixin from './../mixins/facebook-login';

export default Ember.Controller.extend(FacebookLoginMixin, {
  actions: {
    login() {
      this.login();
    }
  }
});
